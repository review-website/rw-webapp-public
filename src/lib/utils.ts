import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 本地投票历史记录类型
export interface LocalVoteRecord {
  moduleId: string;
  moduleName: string;
  subcategoryIds: string[];
  subcategoryNames: string[];
  categoryName: string;
  timestamp: number;
  sessionId: string;
}

// 生成匿名用户会话ID
export function generateSessionId(): string {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('session_id', sessionId);
      // 记录创建时间，用于数据清理
      localStorage.setItem('session_created', Date.now().toString());
    }
    return sessionId;
  }
  return crypto.randomUUID();
}

// 保存投票记录到本地存储
export function saveVoteToLocal(voteRecord: Omit<LocalVoteRecord, 'timestamp'>, providedSessionId?: string): void {
  if (typeof window === 'undefined') return;
  
  const sessionId = providedSessionId || voteRecord.sessionId || generateSessionId();
  const record: LocalVoteRecord = {
    ...voteRecord,
    sessionId,
    timestamp: Date.now()
  };

  const history = getLocalVoteHistory();
  
  // 检查是否已存在该模组的投票记录（不管选择什么标签，每个模组只能有一条记录）
  const existingIndex = history.findIndex(item => item.moduleId === record.moduleId);

  if (existingIndex >= 0) {
    // 更新现有记录，保持原有的 sessionId
    record.sessionId = history[existingIndex].sessionId;
    history[existingIndex] = record;
  } else {
    // 添加新记录
    history.push(record);
  }

  localStorage.setItem('vote_history', JSON.stringify(history));
}

// 获取本地投票历史
export function getLocalVoteHistory(): LocalVoteRecord[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem('vote_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('读取本地投票历史失败:', error);
    return [];
  }
}

// 获取特定模组的本地投票记录
export function getLocalVoteForModule(moduleId: string): LocalVoteRecord | null {
  const history = getLocalVoteHistory();
  return history.find(record => record.moduleId === moduleId) || null;
}

// 检查用户是否已为某个模组投票
export function hasVotedForModule(moduleId: string): boolean {
  return getLocalVoteForModule(moduleId) !== null;
}

// 删除特定模组的投票记录
export function removeVoteFromLocal(moduleId: string): void {
  if (typeof window === 'undefined') return;
  
  const history = getLocalVoteHistory();
  const filteredHistory = history.filter(record => record.moduleId !== moduleId);
  localStorage.setItem('vote_history', JSON.stringify(filteredHistory));
}

// 清理过期的本地数据（可选，比如30天前的数据）
export function cleanupExpiredLocalData(daysToKeep: number = 30): void {
  if (typeof window === 'undefined') return;
  
  const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
  const history = getLocalVoteHistory();
  const filteredHistory = history.filter(record => record.timestamp > cutoffTime);
  
  localStorage.setItem('vote_history', JSON.stringify(filteredHistory));
}

// 获取投票统计信息
export function getLocalVoteStats() {
  const history = getLocalVoteHistory();
  const totalVotes = history.length;
  const uniqueModules = new Set(history.map(record => record.moduleId)).size;
  const oldestVote = history.length > 0 ? Math.min(...history.map(record => record.timestamp)) : null;

  return {
    totalVotes,
    uniqueModules,
    oldestVote: oldestVote ? new Date(oldestVote) : null,
    sessionId: generateSessionId()
  };
}

// 格式化日期
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 格式化时间戳
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 计算投票百分比
export function calculatePercentage(votes: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((votes / total) * 100);
}