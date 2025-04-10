// src/app/search/page.tsx
import React from 'react';
import Header from '@/components/layout/Header'; // 假设 Header 是全局的
import FilterSidebar from '@/search/components/FilterSidebar';
import ResultsArea from '@/search/components/ResultsArea';
import styles from './SearchPage.module.css'; // 页面特定布局样式

/**
 * 搜索结果页面
 * - 使用 'use client' 指令，因为页面包含交互式组件(按钮点击、状态等)
 */
// 'use client'; // 如果组件中有 useState, useEffect 或事件处理，则需要

const SearchPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
       {/* 可以选择是否在此页面包含 Header，或者在全局 layout.tsx 中包含 */}
       {/* <Header /> */}

       {/* 主内容区域，包含侧边栏和结果区 */}
       <div className={styles.mainContainer}>
          {/* 左侧筛选栏 */}
          <FilterSidebar />

          {/* 右侧结果展示区 */}
          <ResultsArea />
       </div>
    </div>
  );
};

export default SearchPage;