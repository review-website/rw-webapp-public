'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLocalVoteHistory } from '@/hooks/useLocalVoteHistory';
import { formatTimestamp } from '@/lib/utils';
import Link from 'next/link';

export function VoteHistory() {
  const { voteHistory, groupedByModule, stats, loading, removeVote, cleanupOldData } = useLocalVoteHistory();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">正在加载投票历史...</div>
        </CardContent>
      </Card>
    );
  }

  if (voteHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>投票历史</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-lg mb-2">暂无投票记录</p>
            <p className="text-sm">去为模组投票吧！</p>
            <div className="mt-4">
              <Link href="/modules">
                <Button>浏览模组</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计信息 */}
      <Card>
        <CardHeader>
          <CardTitle>投票统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalVotes}</div>
              <div className="text-sm text-gray-600">总投票数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.uniqueModules}</div>
              <div className="text-sm text-gray-600">投票模组</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.oldestVote ? Math.ceil((Date.now() - stats.oldestVote.getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="text-sm text-gray-600">活跃天数</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 break-all">
                会话ID: {stats.sessionId.slice(0, 8)}...
              </div>
              <div className="text-sm text-gray-600">匿名标识</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => cleanupOldData(30)}
              className="text-xs"
            >
              清理30天前的数据
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 投票历史列表 */}
      <Card>
        <CardHeader>
          <CardTitle>投票记录</CardTitle>
          <p className="text-sm text-gray-600">按时间倒序排列</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {voteHistory.map((vote) => (
              <div 
                key={`${vote.moduleId}-${vote.timestamp}`} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <Link 
                    href={`/modules/${vote.moduleId}`}
                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {vote.moduleName}
                  </Link>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(vote.timestamp)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('确定要删除这条投票记录吗？')) {
                          removeVote(vote.moduleId);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1 h-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">分类: </span>
                    <span className="text-gray-600">{vote.categoryName}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">标签: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {vote.subcategoryNames.map((tagName) => (
                        <span 
                          key={tagName}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tagName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 按模组分组视图 */}
      <Card>
        <CardHeader>
          <CardTitle>按模组分组</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(groupedByModule).map(([moduleId, votes]) => {
              const latestVote = votes[0]; // 最新的投票记录
              
              return (
                <div key={moduleId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Link 
                      href={`/modules/${moduleId}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {latestVote.moduleName}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {votes.length} 次投票
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">最近投票: </span>
                    {latestVote.categoryName} - {latestVote.subcategoryNames.join(', ')}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(latestVote.timestamp)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}