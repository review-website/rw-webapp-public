import { create } from 'zustand';
import { TagSubcategory } from '@/lib/types';
import { 
  generateSessionId, 
  saveVoteToLocal, 
  hasVotedForModule, 
  getLocalVoteForModule,
  removeVoteFromLocal,
  LocalVoteRecord 
} from '@/lib/utils';

interface VotingState {
  // 投票状态
  selectedSubcategories: string[];
  isSubmitting: boolean;
  isLoadingPreviousVote: boolean;
  hasVoted: boolean;
  existingVote: LocalVoteRecord | null;
  
  // Actions
  setSelectedSubcategories: (subcategories: string[]) => void;
  setSubmitting: (submitting: boolean) => void;
  setLoadingPreviousVote: (loading: boolean) => void;
  setHasVoted: (hasVoted: boolean) => void;
  setExistingVote: (vote: LocalVoteRecord | null) => void;
  
  // 业务逻辑
  toggleSubcategory: (subcategoryId: string) => void;
  submitVote: (moduleId: string, moduleName: string, subcategories: TagSubcategory[]) => Promise<any>;
  revote: (moduleId: string) => Promise<void>;
  loadPreviousVote: (moduleId: string) => Promise<void>;
  
  // 重置状态
  reset: () => void;
}

const initialState = {
  selectedSubcategories: [],
  isSubmitting: false,
  isLoadingPreviousVote: false,
  hasVoted: false,
  existingVote: null
};

export const useVotingStore = create<VotingState>((set, get) => ({
  ...initialState,
  
  // 基础状态设置
  setSelectedSubcategories: (subcategories) => set({ selectedSubcategories: subcategories }),
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setLoadingPreviousVote: (loading) => set({ isLoadingPreviousVote: loading }),
  setHasVoted: (hasVoted) => set({ hasVoted }),
  setExistingVote: (vote) => set({ existingVote: vote }),
  
  // 切换二级标签选择
  toggleSubcategory: (subcategoryId: string) => {
    const { selectedSubcategories } = get();
    set({
      selectedSubcategories: selectedSubcategories.includes(subcategoryId)
        ? selectedSubcategories.filter(id => id !== subcategoryId)
        : [...selectedSubcategories, subcategoryId]
    });
  },
  
  // 加载历史投票数据
  loadPreviousVote: async (moduleId: string) => {
    const { setLoadingPreviousVote, setExistingVote, setSelectedSubcategories } = get();
    const existingVote = getLocalVoteForModule(moduleId);
    
    if (!existingVote) return;
    
    setExistingVote(existingVote);
    setLoadingPreviousVote(true);
    
    try {
      const response = await fetch(`/api/tags/votes/user?module_id=${moduleId}&session_id=${existingVote.sessionId}`);
      
      if (response.ok) {
        const serverVotes = await response.json();
        
        if (Array.isArray(serverVotes) && serverVotes.length > 0) {
          const subcategoryIds = serverVotes.map(vote => vote.subcategory_id);
          setSelectedSubcategories(subcategoryIds);
        }
      }
    } catch (error) {
      console.error('获取历史投票数据失败:', error);
    } finally {
      setLoadingPreviousVote(false);
    }
  },
  
  // 提交投票
  submitVote: async (moduleId: string, moduleName: string, subcategories: TagSubcategory[]) => {
    const { selectedSubcategories, existingVote, setSubmitting, setHasVoted, setExistingVote, setSelectedSubcategories } = get();
    
    if (selectedSubcategories.length === 0) {
      throw new Error('请选择至少一个标签');
    }
    
    setSubmitting(true);
    
    try {
      // 如果已有投票记录，先删除旧投票
      if (existingVote) {
        const deleteResponse = await fetch('/api/tags/votes', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            module_id: moduleId,
            session_id: existingVote.sessionId
          })
        });
        
        if (!deleteResponse.ok) {
          const error = await deleteResponse.json();
          throw new Error(error.error || '删除旧投票记录失败');
        }
        
        removeVoteFromLocal(moduleId);
      }
      
      // 使用原有的 sessionId 或生成新的
      const sessionId = existingVote?.sessionId || generateSessionId();
      
      // 提交到服务器
      const response = await fetch('/api/tags/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          module_id: moduleId,
          subcategory_ids: selectedSubcategories,
          session_id: sessionId
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '投票提交失败');
      }
      
      // 保存到本地存储
      const selectedSubcategoryData = subcategories.filter(sub => 
        selectedSubcategories.includes(sub.id)
      );
      
      const categoryNames = selectedSubcategoryData.map(sub => sub.category?.name).filter((name): name is string => Boolean(name));
      const selectedCategoryNames = Array.from(new Set(categoryNames));
      
      const voteRecord = {
        moduleId,
        moduleName,
        subcategoryIds: selectedSubcategories,
        subcategoryNames: selectedSubcategoryData.map(sub => sub.name),
        categoryName: selectedCategoryNames.join(', '),
        sessionId: sessionId
      };
      
      saveVoteToLocal(voteRecord);
      
      // 更新投票状态
      setHasVoted(true);
      setExistingVote({
        ...voteRecord,
        sessionId: sessionId,
        timestamp: Date.now()
      });
      
      // 重置选择状态
      setSelectedSubcategories([]);
      
      return await response.json();
    } catch (error) {
      console.error('投票提交失败:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  },
  
  // 重新投票
  revote: async (moduleId: string) => {
    const { existingVote, setSubmitting, setHasVoted, setExistingVote, setSelectedSubcategories } = get();
    
    if (!existingVote) return;
    
    setSubmitting(true);
    
    try {
      // 删除后端投票记录
      const response = await fetch('/api/tags/votes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          module_id: moduleId,
          session_id: existingVote.sessionId
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '删除投票记录失败');
      }
      
      // 保留本地投票记录中的选择信息供重新投票使用
      const previousSubcategoryIds = existingVote.subcategoryIds || [];
      
      // 删除本地存储的投票记录
      const voteHistory = JSON.parse(localStorage.getItem('userVoteHistory') || '[]');
      const updatedHistory = voteHistory.filter((vote: any) => 
        !(vote.moduleId === moduleId && vote.sessionId === existingVote.sessionId)
      );
      localStorage.setItem('userVoteHistory', JSON.stringify(updatedHistory));
      
      // 重置投票状态，但保留选择状态以便用户修改
      setHasVoted(false);
      setExistingVote(null);
      
      // 如果之前的选择状态为空，则使用历史记录中的选择
      if (get().selectedSubcategories.length === 0 && previousSubcategoryIds.length > 0) {
        setSelectedSubcategories(previousSubcategoryIds);
      }
    } catch (error) {
      console.error('重新投票失败:', error);
      alert(error instanceof Error ? error.message : '重新投票失败');
    } finally {
      setSubmitting(false);
    }
  },
  
  // 重置状态
  reset: () => set(initialState)
})); 