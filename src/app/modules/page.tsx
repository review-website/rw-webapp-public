'use client';

import { useEffect } from 'react';
import { ModuleList } from '@/components/modules/ModuleList';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { useModulesStore } from '@/stores';

export default function ModulesPage() {
  const { modules, pagination, loading, error, searchModules, goToPage, fetchModules } = useModulesStore();

  // 组件挂载时加载数据
  useEffect(() => {
    
    fetchModules();
  }, [fetchModules]);

  // 调试状态变化
  useEffect(() => {
  }, [modules, loading, error, pagination]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-700">模组列表</h1>
        <Button variant="outline">添加模组</Button>
      </div>

      <SearchBar 
        placeholder="搜索模组、作者、系统..."
        onSearch={searchModules}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">错误: {error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => {
              
              fetchModules();
            }}
          >
            重试
          </Button>
        </div>
      )}

      <ModuleList 
        modules={modules}
        pagination={pagination}
        loading={loading}
        onPageChange={goToPage}
      />
    </div>
  );
}