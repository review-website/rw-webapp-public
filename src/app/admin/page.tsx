import { Button } from '@/components/ui/Button';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">管理面板</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">待审核投票</h3>
          <p className="text-gray-600 mb-4">查看和管理待审核的标签投票</p>
          <Button>查看待审核</Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">标签管理</h3>
          <p className="text-gray-600 mb-4">管理标签分类和子标签</p>
          <Button>管理标签</Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">模组管理</h3>
          <p className="text-gray-600 mb-4">添加、编辑和删除模组</p>
          <Button>管理模组</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">系统统计</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-gray-600">待审核投票</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-gray-600">已审核投票</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-gray-600">总模组数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">0</div>
            <div className="text-gray-600">活跃用户</div>
          </div>
        </div>
      </div>
    </div>
  );
}