'use client';

import { useEffect, lazy, Suspense } from 'react';
import { useModulesStore } from '@/stores';
import { Button } from '@/components/ui/Button';

// 懒加载 ModuleCard 组件
const ModuleCard = lazy(() => import('./ModuleCard').then(m => ({ default: m.ModuleCard })));

export function ModuleListWithStore() {
  const {
    modules,
    pagination,
    loading,
    error,
    fetchModules,
    goToPage,
    searchModules
  } = useModulesStore();

  // 组件挂载时加载数据
  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg">加载失败</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={() => fetchModules()}>重试</Button>
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
        <Suspense fallback={
          Array.from({ length: modules.length }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        }>
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </Suspense>
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
              onClick={() => goToPage(pagination.page - 1)}
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
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(1)}
                    >
                      1
                    </Button>
                  );
                  if (start > 2) {
                    pages.push(
                      <span key="ellipsis1" className="px-2 py-1 text-gray-500">
                        ...
                      </span>
                    );
                  }
                }

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={i === current ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => goToPage(i)}
                    >
                      {i}
                    </Button>
                  );
                }

                if (end < total) {
                  if (end < total - 1) {
                    pages.push(
                      <span key="ellipsis2" className="px-2 py-1 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <Button
                      key={total}
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(total)}
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
              onClick={() => goToPage(pagination.page + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 