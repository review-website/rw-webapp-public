import { VoteHistory } from '@/components/user/VoteHistory';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">个人中心</h1>
        <p className="text-gray-600">查看您的投票历史和统计信息</p>
      </div>

      <VoteHistory />

      {/* 隐私说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">隐私保护说明</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• 所有投票完全匿名，其他用户无法看到您的投票记录</p>
          <p>• 投票历史仅保存在您的浏览器本地，不会上传到服务器</p>
          <p>• 清除浏览器数据会删除您的投票历史记录</p>
          <p>• 我们不会收集任何可以识别您身份的信息</p>
          <p>• 您可以随时删除本地的投票记录</p>
        </div>
      </div>
    </div>
  );
}