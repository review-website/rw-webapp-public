'use client';

import { useState, useEffect } from 'react';
import { TagSelector } from '@/components/voting/TagSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface VotePageProps {
  params: { moduleId: string };
}

export default function VotePage({ params }: VotePageProps) {
  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await fetch(`/api/modules/${params.moduleId}`, {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const moduleData = await response.json();
          setModule(moduleData);
        }
      } catch (error) {
        console.error('获取模组数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModule();
  }, [params.moduleId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-600">正在加载模组信息...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">模组不存在</h1>
            <p className="text-gray-600 mb-6">抱歉，您查找的模组不存在或已被删除。</p>
            <Link href="/modules">
              <Button>返回模组列表</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 面包屑导航 */}
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/modules" className="hover:text-gray-900">模组</Link>
        <span className="mx-2">/</span>
        <Link href={`/modules/${module.id}`} className="hover:text-gray-900">{module.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">投票</span>
      </nav>

      {/* 模组信息简要 */}
      <Card>
        <CardHeader>
          <CardTitle>为 &ldquo;{module.name}&rdquo; 投票</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-600">
                <span className="font-medium">作者:</span> {module.author}
                {module.system && (
                  <>
                    <span className="mx-2">|</span>
                    <span className="font-medium">系统:</span> {module.system}
                  </>
                )}
              </p>
            </div>
            <Link href={`/modules/${module.id}`}>
              <Button variant="outline" size="sm">
                查看详情
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 投票界面 */}
      <TagSelector 
        moduleId={module.id} 
        moduleName={module.name}
        onVoteSubmitted={() => {
          // 投票成功后跳转到模组详情页
          window.location.href = `/modules/${module.id}`;
        }}
      />

      {/* 投票说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">投票说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• 您的投票完全匿名，其他用户无法看到您的身份</p>
            <p>• 每个模组只能投票一次，但可以选择多个标签</p>
            <p>• 投票记录会保存在您的浏览器本地，便于查看历史</p>
            <p>• 如需修改投票，可以重新投票覆盖之前的选择</p>
            <p>• 请根据模组实际内容进行客观投票</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}