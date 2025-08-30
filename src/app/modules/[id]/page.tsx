import { VoteResults } from '@/components/voting/VoteResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface ModuleDetailPageProps {
  params: { id: string };
}

async function getModule(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/modules/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取模组数据失败:', error);
    return null;
  }
}

export default async function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  const moduleData = await getModule(params.id);

  if (!moduleData) {
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 面包屑导航 */}
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-900">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/modules" className="hover:text-gray-900">模组</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{moduleData.name}</span>
      </nav>

      {/* 模组信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{moduleData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">作者:</span>
                <span className="ml-2">
                  {Array.isArray(moduleData.author) ? moduleData.author.join(', ') : moduleData.author}
                </span>
              </div>
              
              {moduleData.system && (
                <div>
                  <span className="font-medium text-gray-700">游戏系统:</span>
                  <span className="ml-2">{moduleData.system}</span>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-700">发布时间:</span>
                <span className="ml-2">{formatDate(moduleData.created_at)}</span>
              </div>

              {moduleData.purchase_url && (
                <div>
                  <span className="font-medium text-gray-700">购买链接:</span>
                  <a 
                    href={moduleData.purchase_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    点击购买
                  </a>
                </div>
              )}
            </div>
            
            {moduleData.description && (
              <div>
                <span className="font-medium text-gray-700">描述:</span>
                <p className="mt-2 text-gray-600">{moduleData.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 投票入口 */}
        <Card>
          <CardHeader>
            <CardTitle>参与投票</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              为该模组标记厌女要素标签，帮助社区识别相关内容。
            </p>
            <Link href={`/vote/${moduleData.id}`}>
              <Button className="w-full bg-yellow-900 hover:bg-amber-50 dark:bg-yellow-500 dark:hover:bg-yellow-900 text-white dark:text-green-800">开始投票</Button>
            </Link>
          </CardContent>
        </Card>

        {/* 投票结果 */}
        <div>
          <h2 className="text-2xl font-bold mb-4">投票结果</h2>
          <VoteResults moduleId={moduleData.id} />
        </div>
      </div>
    </div>
  );
}