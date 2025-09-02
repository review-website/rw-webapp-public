import { create } from 'zustand';
import { Module } from '@/lib/types';

interface ModulesState {
  // 数据状态
  modules: Module[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchQuery: string;
  
  // UI 状态
  loading: boolean;
  error: string | null;
  
  // Actions
  setModules: (modules: Module[]) => void;
  setPagination: (pagination: ModulesState['pagination']) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 业务逻辑
  fetchModules: (page?: number, search?: string) => Promise<void>;
  searchModules: (query: string) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  refresh: () => Promise<void>;
  
  // 重置状态
  reset: () => void;
}

const initialState = {
  modules: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  searchQuery: '',
  loading: false,
  error: null
};

export const useModulesStore = create<ModulesState>((set, get) => ({
  ...initialState,
  
  // 基础状态设置
  setModules: (modules) => set({ modules }),
  setPagination: (pagination) => set({ pagination }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // 获取模组列表
  fetchModules: async (page = 1, search = '') => {
    const { setLoading, setError, setModules, setPagination } = get();
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      const response = await fetch(`/api/modules?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('获取模组列表失败');
      }
      
      const data = await response.json();
      
      setModules(data.modules);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setModules([]);
    } finally {
      setLoading(false);
    }
  },
  
  // 搜索模组
  searchModules: async (query: string) => {
    const { setSearchQuery, setPagination, fetchModules } = get();
    
    setSearchQuery(query);
    setPagination({ ...get().pagination, page: 1 });
    await fetchModules(1, query);
  },
  
  // 翻页
  goToPage: async (page: number) => {
    const { setPagination, fetchModules, searchQuery } = get();
    
    setPagination({ ...get().pagination, page });
    await fetchModules(page, searchQuery);
  },
  
  // 刷新当前页
  refresh: async () => {
    const { pagination, searchQuery, fetchModules } = get();
    await fetchModules(pagination.page, searchQuery);
  },
  
  // 重置状态
  reset: () => set(initialState)
})); 