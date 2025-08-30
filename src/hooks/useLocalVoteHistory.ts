'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores';

export function useLocalVoteHistory() {
  const {
    voteHistory,
    voteStats,
    historyLoading,
    loadVoteHistory,
    removeVote,
    cleanupOldData
  } = useUserStore();

  // 组件挂载时加载数据
  useEffect(() => {
    loadVoteHistory();
  }, [loadVoteHistory]);

  // 按日期排序（最新的在前）
  const sortedHistory = voteHistory.sort((a, b) => b.timestamp - a.timestamp);

  // 按模组分组
  const groupedByModule = voteHistory.reduce((groups, vote) => {
    const key = vote.moduleId;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(vote);
    return groups;
  }, {} as Record<string, typeof voteHistory>);

  return {
    // 数据
    voteHistory: sortedHistory,
    groupedByModule,
    stats: voteStats,
    
    // 状态
    loading: historyLoading,
    
    // 方法
    loadHistory: loadVoteHistory,
    removeVote,
    cleanupOldData
  };
}