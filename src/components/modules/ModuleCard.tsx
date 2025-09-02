'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Module } from '@/lib/types';
import { formatDate, hasVotedForModule } from '@/lib/utils';

interface ModuleCardProps {
  module: Module;
  showVoteButton?: boolean;
  showVoteStatus?: boolean;
}

export function ModuleCard({ 
  module, 
  showVoteButton = true, 
  showVoteStatus = true 
}: ModuleCardProps) {
  const userHasVoted = hasVotedForModule(module.id);

  // 为不同系统添加颜色标识
  const getSystemColor = (system: string | null) => {
    if (!system) return 'bg-gray-100 text-gray-700';
    const systemLower = system.toLowerCase();
    if (systemLower.includes('dnd') || systemLower.includes('d&d')) return 'bg-red-100 text-red-700';
    if (systemLower.includes('coc') || systemLower.includes('克苏鲁')) return 'bg-green-100 text-green-700';
    if (systemLower.includes('pf') || systemLower.includes('pathfinder')) return 'bg-blue-100 text-blue-700';
    if (systemLower.includes('fate')) return 'bg-purple-100 text-purple-700';
    if (systemLower.includes('pbta')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <CardTitle className="line-clamp-2 text-lg">
          <Link 
            href={`/modules/${module.id}`}
            className="hover:text-blue-600 transition-colors font-bold"
          >
            {module.name}
          </Link>
        </CardTitle>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600 font-medium">
            {Array.isArray(module.author) ? module.author.join(', ') : module.author}
          </span>
          {module.system && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSystemColor(module.system)}`}>
              {module.system}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col h-full pt-0">
        <div className="flex-grow space-y-3">
          {module.description && (
            <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
              {module.description}
            </p>
          )}
          
          <div className="text-xs text-gray-500">
            {formatDate(module.created_at)}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            {showVoteStatus && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                userHasVoted 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {userHasVoted ? '已投票' : '未投票'}
              </span>
            )}
            
            <span className="text-xs text-gray-500">
              {module.vote_count || 0} 个标签投票
            </span>
          </div>

          {showVoteButton && (
            <div className="flex space-x-2">
              <Link href={`/modules/${module.id}`}>
                <Button size="sm" variant="outline">
                  查看详情
                </Button>
              </Link>
              
              {module.purchase_url && (
                <a 
                  href={module.purchase_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  购买
                </a>
              )}
              
              {!userHasVoted && (
                <Link href={`/vote/${module.id}`}>
                  <Button size="sm">
                    投票
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}