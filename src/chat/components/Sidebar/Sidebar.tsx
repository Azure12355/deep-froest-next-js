// src/chat/components/Sidebar/Sidebar.tsx
import React, { useState } from 'react';
import Icon from '@/chat/components/common/Icon';
import HistoryPreview from './HistoryPreview';
import NavLinks from './NavLinks';
import type { HistoryGroupData } from '@/chat/types'; // 引入类型

// 定义 Sidebar 组件 props 类型
interface SidebarProps {
  historyGroups: HistoryGroupData[]; // 历史记录数据
  activeChatId: string | null; // 当前活动对话 ID
  onNewChat: () => void; // 新建对话处理函数
  onChatSelect: (id: string) => void; // 选择对话处理函数
  onManageHistory: () => void; // 管理历史记录处理函数 (可选)
  onUserProfileClick: () => void; // 用户头像点击处理函数 (可选)
}

/**
 * 应用的左侧导航边栏组件
 * @param historyGroups - 历史对话记录，按时间分组
 * @param activeChatId - 当前正在查看的对话 ID
 * @param onNewChat - 点击“新建对话”按钮时的回调
 * @param onChatSelect - 点击某个历史对话项时的回调
 * @param onManageHistory - 点击“管理对话记录”时的回调
 * @param onUserProfileClick - 点击用户头像时的回调
 */
const Sidebar: React.FC<SidebarProps> = ({
  historyGroups,
  activeChatId,
  onNewChat,
  onChatSelect,
  onManageHistory = () => console.log("Manage History clicked"), // 默认处理
  onUserProfileClick = () => console.log("User Profile clicked"), // 默认处理
}) => {
  return (
    <nav className="sidebar">
      {/* 侧边栏头部 */}
      <div className="sidebar-header">
        {/* <div className="logo">DeepForest</div> 应用 Logo 或名称 */}
        <button className="new-chat-btn" onClick={onNewChat}>
          <Icon name="Plus" size={16} className="feather" /> 新建对话
        </button>
      </div>

      {/* 历史记录预览 */}
      <HistoryPreview
        historyGroups={historyGroups}
        activeChatId={activeChatId}
        onChatSelect={onChatSelect}
      />

      {/* 主要导航链接 */}
      <NavLinks />

      {/* 侧边栏底部 */}
      <div className="sidebar-footer">
        <button className="manage-history" onClick={onManageHistory}>
          <Icon name="Settings" size={16} className="feather" /> 管理对话记录
        </button>
        <button className="user-profile" title="用户" onClick={onUserProfileClick}>
          <Icon name="User" size={18} className="feather" />
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;