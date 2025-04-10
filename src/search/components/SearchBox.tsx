// src/search/components/SearchBox.tsx
"use client"; // <--- 添加此行，标记为客户端组件

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './SearchBox.module.css';

/**
 * 搜索框组件
 * @description 因为包含按钮点击事件 (onClick)，需要标记为客户端组件。
 */
const SearchBox: React.FC = () => {
  const handleSearch = () => {
    console.log('执行搜索...');
    // TODO: 实现搜索逻辑
  };

  return (
    <div className={styles.searchBox}>
      <input
        type="text"
        placeholder="搜索物种名、学名、寄主..."
        className={styles.searchInput}
      />
      {/* onClick 事件处理器现在可以在客户端组件中正常使用 */}
      <button className={styles.searchButton} onClick={handleSearch}>
        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
      </button>
    </div>
  );
};

export default SearchBox;