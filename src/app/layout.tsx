import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TRPG模组厌女要素标记平台',
  description: '识别和标记TRPG模组中的厌女要素',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen ">
        <header className="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">
                  TRPG模组评价平台
                </h1>
              </div>
              <nav className="flex items-center space-x-4">
                <a href="/" className="text-gray-700 hover:text-gray-900">首页</a>
                <a href="/modules" className="text-gray-700 hover:text-gray-900">模组</a>
                <a href="/profile" className="text-gray-700 hover:text-gray-900">个人中心</a>
                <a href="/admin" className="text-gray-700 hover:text-gray-900">管理</a>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}