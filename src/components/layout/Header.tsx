// src/components/layout/Header.tsx
'use client'; // 因为用到了 Ant Design 的交互组件，标记为客户端组件

import React, { useState, useEffect } from 'react'; // 引入 useEffect
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
import { GitHub } from 'react-feather';

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
// **注意:** 如果这个 Dropdown 也需要使用，同样需要将 overlay 改为 menu
const moreMenuItems: MenuProps['items'] = [
  { key: 'help', label: '帮助中心' },
  { key: 'feedback', label: '意见反馈' },
];

// 用户菜单项 (示例 - 结构已符合 menu prop 要求)
const userMenuItems: MenuProps['items'] = [
  { key: 'profile', label: '个人中心' },
  { key: 'settings', label: '账户设置' },
  { type: 'divider' }, // 分隔线
  { key: 'logout', label: '退出登录', danger: true }, // danger 样式
];

/**
 * 全局页头组件 - 微软小清新风格
 */
const Header: React.FC = () => {
  const pathname = usePathname(); // 获取当前路径

  // 使用 useEffect 来在 pathname 变化时更新 current 状态
  // 避免 hydration 错误，因为 pathname 初始在服务器端可能与客户端不同
  const [current, setCurrent] = useState<string>('');
  useEffect(() => {
      const getActiveKey = () => {
          const currentTopLevelPath = '/' + (pathname?.split('/')[1] || '');
          const activeItem = mainNavItems.find(item => item.path === currentTopLevelPath);
          return activeItem ? activeItem.key : '';
      };
      setCurrent(getActiveKey());
  }, [pathname]); // 依赖 pathname

  // 导航菜单点击事件
  const handleNavClick: MenuProps['onClick'] = (e) => {
    console.log('Navigating to:', e.key);
    setCurrent(e.key); // 点击时也更新高亮状态
  };

  // 渲染导航菜单项，包裹在 Link 组件中
  const renderNavItems = () => {
    return mainNavItems.map(item => ({
      key: item.key,
      icon: item.icon,
      // 使用 Link 作为 label，Antd Menu 会处理内部的 a 标签
      label: <Link href={item.path}>{item.label}</Link>,
    }));
  };

  // 用户菜单 - **不需要再额外用 <Menu> 包裹**
  // const userMenu = (
  //   <Menu items={userMenuItems} />
  // ); // 这一步不再需要，直接传递 items 数组

  return (
    <AntHeader className={styles.appHeader}>
      {/* 左侧区域: Logo + 主导航 */}
      <div className={styles.leftSection}>
        {/* 1.1 Logo */}
        <Link href="/" className={styles.logo}>
          {/* 临时使用 next.svg，替换为你自己的 Logo */}
          <Image src="/next.svg" alt="DeepForest Logo" width={32} height={32} className={styles.logoIcon} />
          <span className={styles.logoText}>DeepForest</span>
        </Link>

        {/* 1.2 主导航链接 */}
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[current]}
          onClick={handleNavClick}
          items={renderNavItems()}
          className={styles.mainNav}
          overflowedIndicator={<MoreOutlined />} // 响应式菜单指示器
        />
      </div>

      {/* 右侧区域: 操作按钮 + 通知 + 用户 */}
      <div className={styles.rightSection}>
        <Space size="middle"> {/* 使用 Space 控制间距 */}
          {/* 1.4 会员开通按钮 */}
          <Button type="primary" icon={<GitHub />} className={styles.vipButton}>
            参与贡献 
          </Button>

          {/* 1.5 企业服务按钮 */}
          <Button icon={<AppstoreAddOutlined />} className={styles.actionButton}>
            
          </Button>

          {/* 1.6 通知中心图标 */}
          <Badge count={5} size="small">
            <Avatar shape="circle" icon={<BellOutlined />} className={styles.actionIcon} />
          </Badge>

          {/* 1.7 用户头像/菜单 */}
          {/* **修复：将 overlay={userMenu} 修改为 menu={{ items: userMenuItems }}** */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
             {/* 头像作为触发器 */}
             <Avatar shape="circle" icon={<UserOutlined />} className={styles.userAvatar} style={{ cursor: 'pointer' }}/>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;