// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, // 建议保持开启严格模式

  // output: 'export', // 保持注释或删除，以启用动态路由和服务器端功能

  // ESLint 配置 (保持不变)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 实验性功能配置 (保持不变，除非你需要添加其他功能)
  experimental: {
    // Add experimental features here if needed
  },

  // --- 图像优化配置 ---
  // 添加此 'images' 配置块来允许加载外部图片
  images: {
    // 使用 remotePatterns (推荐方式) 来配置允许的外部图片域名
    remotePatterns: [
      {
        protocol: 'https',           // 允许的协议 (https)
        hostname: 'placehold.co',    // 允许的主机名 (占位图服务)
        port: '',                   // 端口号 (通常为空)
        pathname: '/**',            // 允许该主机名下的所有路径 (/**)
      },
      // 如果你的应用还需要从其他外部域加载图片，可以在这里继续添加对象
      // 例如，如果你之前的 mock 数据或真实数据使用了 pestchina.com 的图片:
      // {
      //   protocol: 'http', // 注意协议可能是 http
      //   hostname: 'www.pestchina.com',
      //   port: '',
      //   pathname: '/webapi/nb/SpeciesCode/image/info/**', // 可以指定更具体的路径
      // },
    ],
    // --- 或者，如果你不想使用 remotePatterns，可以使用 domains (旧方式) ---
    // domains: ['placehold.co', 'www.pestchina.com'],
  },
};

export default nextConfig;