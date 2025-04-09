// src/app/chat/page.tsx
"use client"; // 标记为客户端组件，因为包含状态和交互

import React, { useState, useEffect } from 'react';
import Sidebar from '@/chat/components/Sidebar/Sidebar';
import ChatArea from '@/chat/components/ChatArea/ChatArea';
import type { HistoryGroupData } from '@/chat/types';
import '../globals.css'; // 引入全局样式
import '@/chat/styles.css'; // 引入聊天界面专属样式

/**
 * DeepForest 聊天主页面组件
 */
export default function ChatPage() {
  // --- State ---
  // 当前激活的对话 ID，null 表示新对话或未选择状态
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  // 侧边栏历史记录数据 (实际应用中应从API或状态管理获取)
  const [historyGroups, setHistoryGroups] = useState<HistoryGroupData[]>([]);
  // 可以添加加载状态
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);


  // --- Effects ---
  // 模拟加载历史记录
  useEffect(() => {
    setIsLoadingHistory(true);
    // 模拟 API 调用
    setTimeout(() => {
        // 从 localStorage 或 API 加载历史记录
        // const loadedHistory = loadHistoryFromApi();
        // setHistoryGroups(loadedHistory);

        // --- 模拟数据 ---
        setHistoryGroups([
             {
                 timeframe: '当天',
                 items: [{ id: 'chat1', title: '你好，今天天气怎么样？' }],
             },
             {
                 timeframe: '最近30天',
                 items: [
                     { id: 'chat2', title: '【下图为scrapy爬虫的目录】' },
                     { id: 'chat3', title: '你是什么模型？介绍一下你自己。' },
                 ],
             },
             {
                 timeframe: '最近半年',
                 items: [
                     { id: 'chat4', title: 'Java 如何高效切割字符串' },
                     { id: 'chat5', title: '帮我写一个 React Hook' },
                 ],
             },
         ]);
         // --- 模拟结束 ---

      setIsLoadingHistory(false);
    }, 500); // 模拟延迟
  }, []); // 仅在组件挂载时加载一次

  // --- Handlers ---
  // 处理新建对话
  const handleNewChat = () => {
    console.log("New Chat requested");
    setActiveChatId(null); // 设置 activeChatId 为 null 表示新对话
    // 可能还需要清除 ChatArea 的当前消息等状态，通过 key={activeChatId} 实现
  };

  // 处理选择历史对话
  const handleChatSelect = (id: string) => {
    console.log("Selected chat:", id);
    setActiveChatId(id); // 更新当前激活的对话 ID
  };

  // 处理管理历史记录
  const handleManageHistory = () => {
      console.log("Manage history action");
      // TODO: 实现管理历史记录的逻辑，例如弹出设置窗口
  };

   // 处理用户头像点击
   const handleUserProfileClick = () => {
       console.log("User profile action");
       // TODO: 实现用户中心或设置的逻辑
   };


  return (
    <div className="app-container">
      {/* 左侧边栏 */}
      <Sidebar
        historyGroups={historyGroups}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onManageHistory={handleManageHistory}
        onUserProfileClick={handleUserProfileClick}
      />

      {/* 右侧聊天区域 */}
      {/* 使用 key={activeChatId || 'new'} 可以在切换对话时强制重新渲染 ChatArea 并重置其内部状态 */}
      <ChatArea key={activeChatId || 'new'} chatId={activeChatId} />
    </div>
  );
}