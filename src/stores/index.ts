// 优化导出，使用动态导入减少初始包大小
export { useModulesStore } from './modulesStore';
export { useVotingStore } from './votingStore';
export { useUserStore } from './userStore';

// 动态导入函数，用于代码分割
export const lazyLoadStore = {
  modules: () => import('./modulesStore').then(m => m.useModulesStore),
  voting: () => import('./votingStore').then(m => m.useVotingStore),
  user: () => import('./userStore').then(m => m.useUserStore),
};

// 可以在这里添加 store 之间的组合逻辑
// 例如：当用户登录时，同步加载投票历史等 