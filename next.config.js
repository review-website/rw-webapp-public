/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  
  // 启用 tree shaking 优化
  swcMinify: true,
  
  // 优化打包配置
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      // 启用 tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // 代码分割优化
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // 第三方库分离
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Supabase 单独分离
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 20,
          },
          // React 相关库分离
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 30,
          },
        },
      };
    }
    
    return config;
  },
  
  // 压缩配置
  compress: true,
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // 标准服务器构建
  // 移除output配置，使用默认的服务器渲染
};

module.exports = nextConfig;