import { create } from 'zustand';
import { LocalVoteRecord } from '@/lib/utils';
import { 
  getLocalVoteHistory, 
  getLocalVoteStats, 
  removeVoteFromLocal,
  cleanupExpiredLocalData
} from '@/lib/utils';

interface UserState {
  // 用户状态
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  email: string | null;
  
  // 投票历史
  voteHistory: LocalVoteRecord[];
  voteStats: {
    totalVotes: number;
    uniqueModules: number;
    oldestVote: Date | null;
    sessionId: string;
  };
  historyLoading: boolean;
  
  // Actions
  setAuthenticated: (authenticated: boolean) => void;
  setUser: (user: { id: string; username: string; email: string } | null) => void;
  setVoteHistory: (history: LocalVoteRecord[]) => void;
  addVoteToHistory: (vote: LocalVoteRecord) => void;
  removeVoteFromHistory: (moduleId: string) => void;
  clearVoteHistory: () => void;
  
  // 投票历史管理
  loadVoteHistory: () => void;
  removeVote: (moduleId: string) => void;
  cleanupOldData: (daysToKeep?: number) => void;
  
  // 重置状态
  reset: () => void;
}

const initialState = {
  isAuthenticated: false,
  userId: null,
  username: null,
  email: null,
  voteHistory: [],
  voteStats: {
    totalVotes: 0,
    uniqueModules: 0,
    oldestVote: null,
    sessionId: ''
  },
  historyLoading: false
};

export const useUserStore = create<UserState>((set, get) => ({
  ...initialState,
  
  // 基础状态设置
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  
  setUser: (user) => set({
    isAuthenticated: !!user,
    userId: user?.id || null,
    username: user?.username || null,
    email: user?.email || null
  }),
  
  setVoteHistory: (history) => set({ voteHistory: history }),
  
  addVoteToHistory: (vote) => {
    const { voteHistory } = get();
    const existingIndex = voteHistory.findIndex(v => v.moduleId === vote.moduleId);
    
    if (existingIndex >= 0) {
      // 更新现有投票
      const updatedHistory = [...voteHistory];
      updatedHistory[existingIndex] = vote;
      set({ voteHistory: updatedHistory });
    } else {
      // 添加新投票
      set({ voteHistory: [...voteHistory, vote] });
    }
  },
  
  removeVoteFromHistory: (moduleId) => {
    const { voteHistory } = get();
    set({
      voteHistory: voteHistory.filter(vote => vote.moduleId !== moduleId)
    });
  },
  
  clearVoteHistory: () => set({ voteHistory: [] }),
  
  // 投票历史管理
  loadVoteHistory: () => {
    set({ historyLoading: true });
    try {
      const history = getLocalVoteHistory();
      const voteStats = getLocalVoteStats();
      
      set({ 
        voteHistory: history,
        voteStats: voteStats,
        historyLoading: false
      });
    } catch (error) {
      console.error('加载本地投票历史失败:', error);
      set({ historyLoading: false });
    }
  },
  
  removeVote: (moduleId: string) => {
    removeVoteFromLocal(moduleId);
    const { loadVoteHistory } = get();
    loadVoteHistory(); // 重新加载
  },
  
  cleanupOldData: (daysToKeep: number = 30) => {
    cleanupExpiredLocalData(daysToKeep);
    const { loadVoteHistory } = get();
    loadVoteHistory(); // 重新加载
  },
  
  // 重置状态
  reset: () => set(initialState)
})); 