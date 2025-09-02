// 应用常量

export const APP_NAME = 'TRPG模组厌女要素标记平台';
export const APP_DESCRIPTION = '识别和标记TRPG模组中的厌女要素';

// 投票状态
export const VOTE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

// 评论状态
export const COMMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

// 分页配置
export const PAGINATION = {
  MODULES_PER_PAGE: 20,
  COMMENTS_PER_PAGE: 10
} as const;

// 搜索配置
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300
} as const;