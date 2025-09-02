'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { calculatePercentage } from '@/lib/utils';

interface VoteResult {
  subcategory_id: string;
  count: number;
  tag_subcategories: {
    id: string;
    name: string;
    description: string;
    tag_categories: {
      id: string;
      name: string;
    };
  };
}

interface VoteResultsProps {
  moduleId: string;
  refreshKey?: number; // 用于触发重新获取数据
}

export function VoteResults({ moduleId, refreshKey }: VoteResultsProps) {
  const [results, setResults] = useState<VoteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tags/votes?module_id=${moduleId}`, {
        cache: 'no-store' // 禁用缓存确保获取最新数据
      });
      if (!response.ok) throw new Error('获取投票结果失败');
      
      const data = await response.json();
      setResults(data || []);
      
      // 计算总投票数
      const total = data?.reduce((sum: number, result: VoteResult) => sum + result.count, 0) || 0;
      setTotalVotes(total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults, refreshKey]);

  // 添加窗口焦点时自动刷新
  useEffect(() => {
    const handleFocus = () => {
      fetchResults();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchResults]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">正在加载投票结果...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>投票统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            暂无投票数据
          </div>
        </CardContent>
      </Card>
    );
  }

  // 按分类分组
  const groupedResults = results.reduce((groups, result) => {
    const categoryName = result.tag_subcategories.tag_categories.name;
    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(result);
    return groups;
  }, {} as Record<string, VoteResult[]>);

  // 按投票数排序
  Object.keys(groupedResults).forEach(category => {
    groupedResults[category].sort((a, b) => b.count - a.count);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>投票统计</CardTitle>
        <p className="text-gray-600">总投票数: {totalVotes}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedResults).map(([categoryName, categoryResults]) => {
            const categoryTotal = categoryResults.reduce((sum, result) => sum + result.count, 0);
            
            return (
              <div key={categoryName} className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  {categoryName} ({categoryTotal} 票)
                </h3>
                
                <div className="space-y-2">
                  {categoryResults.map((result) => {
                    const percentage = calculatePercentage(result.count, totalVotes);
                    
                    return (
                      <div key={result.subcategory_id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {result.tag_subcategories.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {result.count} 票 ({percentage}%)
                          </span>
                        </div>
                        
                        {/* 进度条 */}
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        
                        {result.tag_subcategories.description && (
                          <p className="text-xs text-gray-500">
                            {result.tag_subcategories.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        {totalVotes > 0 && (
          <div className="mt-6 pt-4 border-t text-xs text-gray-500">
            数据更新时间: {new Date().toLocaleString('zh-CN')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}