// TypeScript 类型定义

export interface Module {
  id: string;
  name: string;
  author: string[]; // 改为数组支持多作者
  system: string | null;
  description: string | null;
  purchase_url: string | null; // 新增购买链接
  created_at: string;
  updated_at: string;
  vote_count?: number;
}

export interface TagCategory {
  id: string;
  name: string;
  description: string | null;
  order_index: number;
  created_at: string;
  tag_subcategories?: TagSubcategory[];
}

export interface TagSubcategory {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  order_index: number;
  created_at: string;
  category?: TagCategory;
}

export interface TagVote {
  id: string;
  module_id: string;
  subcategory_id: string;
  session_id: string;
  created_at: string;
  subcategory?: TagSubcategory;
  module?: Module;
}

export interface Comment {
  id: string;
  module_id: string;
  content: string;
  session_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface VoteStatistics {
  subcategory_id: string;
  vote_count: number;
  percentage: number;
  subcategory: TagSubcategory;
}

export interface ModuleWithVotes extends Module {
  vote_statistics: VoteStatistics[];
  total_votes: number;
}