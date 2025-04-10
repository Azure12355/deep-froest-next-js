// src/components/layout/Header.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTree, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css'; // 引入 CSS Module

/**
 * 全局页头组件
 */
const Header: React.FC = () => {
  return (
    <header className={styles.appHeader}>
      {/* Logo区域 */}
      <div className={styles.logo}>
        <FontAwesomeIcon icon={faTree} className={styles.logoIcon} />
        DeepForest 知识图谱
      </div>

      {/* 用户操作区域 */}
      <div className={styles.userActions}>
        {/* 通知图标 */}
        <FontAwesomeIcon icon={faBell} className={styles.actionIcon} />
        {/* 用户名 */}
        <span className={styles.username}>管理员</span>
        {/* 用户头像图标 */}
        <FontAwesomeIcon icon={faUserCircle} className={styles.actionIcon} />
      </div>
    </header>
  );
};

export default Header;