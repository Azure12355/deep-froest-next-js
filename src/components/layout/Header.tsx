// src/components/layout/Header.tsx
'use client'; // 因为用到了 Ant Design 的交互组件，标记为客户端组件

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // 用于 Logo 图片
import { usePathname } from 'next/navigation'; // 用于获取当前路由，高亮导航项
import { Layout, Menu, Button, Avatar, Badge, Dropdown, Space, MenuProps } from 'antd';
import {
  RobotOutlined,         // 智能问答
  AreaChartOutlined,    // 数据分析
  ApartmentOutlined,    // 知识图谱
  SearchOutlined,       // 知识检索
  FormOutlined,         // 数据录入
  MoreOutlined,         // 更多
  CrownOutlined,        // VIP / 会员
  AppstoreAddOutlined,  // 企业服务
  BellOutlined,         // 通知
  UserOutlined,         // 用户头像
} from '@ant-design/icons';
import styles from './Header.module.css'; // 引入 CSS Module

const { Header: AntHeader } = Layout; // 从 Ant Design 引入 Header 组件，避免命名冲突

// 导航项定义
const mainNavItems = [
  { key: '/chat', icon: <RobotOutlined />, label: '智能问答', path: '/chat' },
  { key: '/analysis', icon: <AreaChartOutlined />, label: '数据分析', path: '/analysis' },
  { key: '/graph', icon: <ApartmentOutlined />, label: '知识图谱', path: '/graph' },
  { key: '/search', icon: <SearchOutlined />, label: '知识检索', path: '/search' },
  { key: '/entry', icon: <FormOutlined />, label: '数据录入', path: '/entry' },
];

// 更多选项的下拉菜单项 (示例)
const moreMenuItems: MenuProps['items'] = [
  { key: 'help', label: '帮助中心' },
  { key: 'feedback', label: '意见反馈' },
];

// 用户菜单项 (示例)
const userMenuItems: MenuProps['items'] = [
  { key: 'profile', label: '个人中心' },
  { key: 'settings', label: '账户设置' },
  { type: 'divider' },
  { key: 'logout', label: '退出登录', danger: true },
];

/**
 * 全局页头组件 - 微软小清新风格
 */
const Header: React.FC = () => {
  const pathname = usePathname(); // 获取当前路径

  // 计算当前激活的导航项 key
  // 注意：对于详情页 /search/detail/xxx，我们可能希望高亮 /search
  const getActiveKey = () => {
    const currentTopLevelPath = '/' + (pathname?.split('/')[1] || ''); // 获取顶级路径，如 /search
    const activeItem = mainNavItems.find(item => item.path === currentTopLevelPath);
    return activeItem ? activeItem.key : '';
  };

  const [current, setCurrent] = useState<string>(getActiveKey());

  // 导航菜单点击事件 (如果需要处理点击，虽然 Link 已经处理了跳转)
  const handleNavClick: MenuProps['onClick'] = (e) => {
    console.log('Navigating to:', e.key);
    setCurrent(e.key);
    // Link 组件会自动处理导航，这里可以留空或添加额外逻辑
  };

  // 渲染导航菜单项，包裹在 Link 组件中
  const renderNavItems = () => {
    return mainNavItems.map(item => ({
      key: item.key,
      icon: item.icon,
      label: <Link href={item.path}>{item.label}</Link>,
    }));
  };

  // 更多选项菜单
  const moreMenu = (
    <Menu items={moreMenuItems} />
  );

  // 用户菜单
  const userMenu = (
    <Menu items={userMenuItems} />
  );

  return (
    <AntHeader className={styles.appHeader}>
      {/* 左侧区域: Logo + 主导航 + 更多 */}
      <div className={styles.leftSection}>
        {/* 1.1 Logo */}
        <Link href="/" className={styles.logo}>
          {/* 替换为你自己的 Logo 图片路径 */}
          <Image src="/next.svg" alt="创客贴 Logo" width={64} height={64} className={styles.logoIcon} />
          <span className={styles.logoText}>DeepForest</span> {/* 使用文字作为示例 */}
        </Link>

        {/* 1.2 主导航链接 */}
        <Menu
          theme="light" // 亮色主题
          mode="horizontal"
          selectedKeys={[current]} // 高亮当前选中的菜单项
          onClick={handleNavClick}
          items={renderNavItems()}
          className={styles.mainNav}
          overflowedIndicator={<MoreOutlined />} // 菜单项过多时的指示器
        />

        {/* 1.3 更多选项 (如果主导航放不下，可以考虑这种方式，或者作为独立按钮) */}
        {/*
        <Dropdown overlay={moreMenu} placement="bottomRight">
          <Button type="text" icon={<MoreOutlined />} className={styles.moreButton} />
        </Dropdown>
         */}
      </div>

      {/* 右侧区域: 操作按钮 + 通知 + 用户 */}
      <div className={styles.rightSection}>
        <Space size="middle"> {/* 使用 Ant Design 的 Space 来控制间距 */}
          {/* 1.4 会员开通按钮 */}
          <Button type="primary" icon={<CrownOutlined />} className={styles.vipButton}>
            开通会员
          </Button>

          {/* 1.5 企业服务按钮 */}
          <Button icon={<AppstoreAddOutlined />} className={styles.actionButton}>
            企业服务
          </Button>

          {/* 1.6 通知中心图标 */}
          <Badge count={5} size="small"> {/* count={0} 时不显示 */}
            <Avatar shape="circle" icon={<BellOutlined />} className={styles.actionIcon} />
          </Badge>

          {/* 1.7 用户头像/菜单 */}
          <Dropdown overlay={userMenu} placement="bottomRight" arrow={{ pointAtCenter: true }}>
             {/* 可以替换为用户真实头像 Image */}
             <Avatar shape="circle" icon={<UserOutlined />} className={styles.userAvatar} />
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;