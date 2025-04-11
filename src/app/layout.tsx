// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 或其他你选择的字体
import Header from "@/components/layout/Header"; // 引入新的或修改后的 Header
import "./globals.css"; // 引入全局样式

// 配置 Font Awesome 图标库 (如果 Header 中仍需使用)
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeepForest 智能系统", // 可以更新标题
  description: "林业病虫害智能问答与知识检索系统",
};

// 假设 Header 的高度在 CSS 中定义为 64px (或使用 CSS 变量 --header-height)
const HEADER_HEIGHT = '64px'; // 定义 Header 高度变量，需要与 CSS 中的值一致

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN"> {/* 设置语言为中文 */}
      <body className={inter.className}>
         {/* 渲染全局 Header */}
         <Header />
         {/* 主要页面内容区域 */}
         <main style={{ paddingTop: HEADER_HEIGHT }}> {/* 添加内边距，防止内容被 Header 遮挡 */}
           {children}
         </main>
         {/* 可能还有全局 Footer 等 */}
      </body>
    </html>
  );
}