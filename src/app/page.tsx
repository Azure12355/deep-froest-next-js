// src/app/page.tsx
import { redirect } from 'next/navigation'; // 1. 从 next/navigation 导入 redirect 函数

/**
 * 根路由页面组件
 * 当用户访问网站根目录 (/) 时，此组件会被调用。
 * 我们在这里直接执行重定向到 /chat 页面。
 */
export default function Home() {
  // 2. 在组件加载时立即调用 redirect 函数，指定目标路径
  redirect('/chat');

  // 注意：因为 redirect() 会中断渲染并执行跳转，
  // 所以实际上不需要在此组件中返回任何 JSX 内容。
  // 如果需要返回内容以满足某些工具或规则，可以返回 null，
  // 但在 redirect 生效的情况下，这部分代码不会被执行。
  // return null;
}