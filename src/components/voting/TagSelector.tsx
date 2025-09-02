'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TagCategory, TagSubcategory } from '@/lib/types';
import { useVotingStore } from '@/stores';

interface TagSelectorProps {
  moduleId: string;
  moduleName: string;
  onVoteSubmitted?: () => void;
}

export function TagSelector({ moduleId, moduleName, onVoteSubmitted }: TagSelectorProps) {
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    selectedSubcategories,
    isSubmitting,
    isLoadingPreviousVote,
    hasVoted,
    existingVote,
    toggleSubcategory,
    submitVote,
    revote,
    loadPreviousVote
  } = useVotingStore();

  // 组件挂载时加载历史投票数据
  useEffect(() => {
    loadPreviousVote(moduleId);
  }, [moduleId, loadPreviousVote]);

  // 获取标签分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/tags/categories');
        if (!response.ok) throw new Error('获取标签分类失败');
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  // 提交投票处理
  const handleSubmit = async () => {
    try {
      // 获取所有选中的子标签数据
      const allSubcategories = categories.flatMap(cat => cat.tag_subcategories || []);
      const selectedSubcategoryData = allSubcategories.filter(sub => 
        selectedSubcategories.includes(sub.id)
      );

      await submitVote(moduleId, moduleName, selectedSubcategoryData);
      onVoteSubmitted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '投票提交失败');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">正在加载标签分类...</div>
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

  // 已投票状态
  if (hasVoted && existingVote) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">✓ 您已为此模组投票</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>投票分类:</strong> {existingVote.categoryName}</p>
            <p><strong>选择的标签:</strong> {existingVote.subcategoryNames.join(', ')}</p>
            <p><strong>投票时间:</strong> {new Date(existingVote.timestamp).toLocaleString('zh-CN')}</p>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={() => revote(moduleId)}>
              重新投票
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 显示所有标签供复选
  return (
    <Card>
      <CardHeader>
        <CardTitle>选择标签</CardTitle>
        <p className="text-gray-600">可以选择多个分类下的标签来标记模组中的厌女要素</p>
        {isLoadingPreviousVote && (
          <p className="text-sm text-blue-600 mt-2">正在加载您之前的投票选择...</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">
                {category.name}
                {category.description && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    - {category.description}
                  </span>
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                {(category.tag_subcategories || []).map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => toggleSubcategory(subcategory.id)}
                    className={`p-3 text-left border rounded-lg transition-colors ${
                      selectedSubcategories.includes(subcategory.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${
                        selectedSubcategories.includes(subcategory.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedSubcategories.includes(subcategory.id) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{subcategory.name}</h4>
                        {subcategory.description && (
                          <p className="text-sm text-gray-600">{subcategory.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end items-center pt-4 border-t">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                已选择 {selectedSubcategories.length} 个标签
              </span>
              <Button 
                onClick={handleSubmit}
                disabled={selectedSubcategories.length === 0 || isSubmitting}
              >
                {isSubmitting ? '提交中...' : '确认提交'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}