// src/search/components/FilterActions.tsx
"use client"; // <--- 添加此行，标记为客户端组件

import React from 'react';
import styles from './FilterActions.module.css';

/**
 * 筛选操作按钮组件 (清空、应用)
 * @description 因为包含按钮点击事件 (onClick)，需要标记为客户端组件。
 */
const FilterActions: React.FC = () => {
  const handleReset = () => {
    console.log('清空筛选条件...');
    // TODO: 实现清空逻辑
  };

  const handleApply = () => {
    console.log('应用筛选条件...');
    // TODO: 实现应用筛选逻辑
  };

  return (
    <div className={styles.filterActions}>
      {/* onClick 事件处理器现在可以在客户端组件中正常使用 */}
      <button className={styles.resetButton} onClick={handleReset}>
        清空筛选
      </button>
      <button className={styles.applyButton} onClick={handleApply}>
        应用筛选
      </button>
    </div>
  );
};

export default FilterActions;