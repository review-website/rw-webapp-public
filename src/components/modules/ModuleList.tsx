'use client';

import { ModuleCard } from './ModuleCard';
import { Button } from '@/components/ui/Button';
import { Module } from '@/lib/types';

interface ModuleListProps {
  modules: Module[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading?: boolean;
  onPageChange?: (page: number) => void;
}

export function ModuleList({ 
  modules, 
  pagination, 
  loading = false, 
  onPageChange 
}: ModuleListProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg">暂无模组数据</p>
          <p className="text-sm">请稍后再试或联系管理员</p>
        </div>
      </div>
    );
  }

  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-6">
      {/* 模组网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>

      {/* 分页信息 */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            显示第 {startIndex} - {endIndex} 项，共 {pagination.total} 项
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
            >
              上一页
            </Button>

            {/* 页码按钮 */}
            <div className="flex space-x-1">
              {(() => {
                const pages = [];
                const current = pagination.page;
                const total = pagination.totalPages;
                
                // 简单的分页逻辑：显示当前页前后各2页
                const start = Math.max(1, current - 2);
                const end = Math.min(total, current + 2);

                if (start > 1) {
                  pages.push(
                    <Button
                      key={1}
                      variant={1 === current ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => onPageChange?.(1)}
                    >
                      1
                    </Button>
                  );
                  if (start > 2) {
                    pages.push(<span key="ellipsis1" className="px-2">...</span>);
                  }
                }

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={i === current ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => onPageChange?.(i)}
                    >
                      {i}
                    </Button>
                  );
                }

                if (end < total) {
                  if (end < total - 1) {
                    pages.push(<span key="ellipsis2" className="px-2">...</span>);
                  }
                  pages.push(
                    <Button
                      key={total}
                      variant={total === current ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => onPageChange?.(total)}
                    >
                      {total}
                    </Button>
                  );
                }

                return pages;
              })()}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}