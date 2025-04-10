// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 或其他你选择的字体
import "./globals.css"; // 引入全局样式
import Header from "@/components/layout/Header"; // 引入全局Header

// 配置 Font Awesome 图标库，避免图标闪烁或过大
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false // 阻止 Font Awesome 自动添加 CSS

const inter = Inter({ subsets: ["latin"] }); // 示例字体

export const metadata: Metadata = {
  title: "DeepForest 知识图谱",
  description: "林业病虫害智能问答与知识检索系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang=""> {/* 设置语言为中文 */}
      <body className={inter.className}>
         {/* 在这里渲染全局 Header */}
         <Header />
         {/* 主要页面内容 */}
         {children}
         {/* 可能还有全局 Footer 等 */}
      </body>
    </html>
  );
}