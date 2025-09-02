'use client';

import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/modules/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="space-y-8">
      {/* 欢迎区域 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-900 dark:text-yellow-600 mb-4">
          TRPG模组厌女要素标记平台
        </h1>
        <p className="text-lg text-gray-600 dark:text-green-800 mb-8">
          通过社区投票识别和标记TRPG模组中的厌女要素
        </p>
      </div>

      {/* 搜索区域 */}
      <div className="max-w-2xl mx-auto">
        <SearchBar 
          placeholder="搜索模组、作者或标签..."
          onSearch={handleSearch}
        />
      </div>

      {/* 快速导航 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-4 border-double border-yellow-900 dark:border-yellow-500 rounded-sm shadow p-6 text-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-yellow-600">浏览模组</h3>
          <p className="text-gray-600 dark:text-green-800 mb-4">
            查看所有模组及其标签投票结果
          </p>
          <Link href="/modules">
            <Button type="button" className="bg-yellow-900 hover:bg-amber-50 dark:bg-yellow-500 dark:hover:bg-yellow-900 text-white dark:text-green-800">查看模组</Button>
          </Link>
        </div>

        <div className="border-4 border-double border-yellow-900 dark:border-yellow-500 rounded-sm shadow p-6 text-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-yellow-600">参与投票</h3>
          <p className="text-gray-600 dark:text-green-800 mb-4">
            为模组标记厌女要素标签
          </p>
          <Link href="/modules">
            <Button variant="outline" className="bg-yellow-900 hover:bg-amber-50 dark:bg-yellow-500 dark:hover:bg-yellow-900 text-white dark:text-green-800">开始投票</Button>
          </Link>
        </div>

        <div className="border-4 border-double border-yellow-900 dark:border-yellow-500 rounded-sm shadow p-6 text-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-yellow-600">了解项目</h3>
          <p className="text-gray-600 dark:text-green-800 mb-4">
            了解项目背景和标签分类
          </p>
          <Button variant="ghost">查看说明</Button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className=" rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-yellow-600">平台统计</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">--</div>
            <div className="text-gray-600">总模组数</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">--</div>
            <div className="text-gray-600">总投票数</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">--</div>
            <div className="text-gray-600">活跃用户</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">--</div>
            <div className="text-gray-600">标签分类</div>
          </div>
        </div>
      </div>
    </div>
  );
}