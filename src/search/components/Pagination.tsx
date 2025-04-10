// src/search/components/Pagination.tsx
"use client"; // <--- 添加此行，标记为客户端组件

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './Pagination.module.css';

// 定义Props类型
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // 页面改变时的回调函数
}

/**
 * 分页组件
 * @description 因为包含按钮点击事件 (onClick) 来切换页面，需要标记为客户端组件。
 */
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // 页码渲染逻辑 (保持和之前一致，使用硬编码的 1, 2, 3, ..., 10 样式)
  const renderPageNumbers = () => {
     return (
       <>
         {/* 页码按钮现在可以在客户端组件中正常使用 onClick */}
         <button onClick={() => onPageChange(1)} className={currentPage === 1 ? styles.active : ''} disabled={currentPage === 1}>1</button>
         <button onClick={() => onPageChange(2)} className={currentPage === 2 ? styles.active : ''} disabled={totalPages < 2 || currentPage === 2}>2</button>
         <button onClick={() => onPageChange(3)} className={currentPage === 3 ? styles.active : ''} disabled={totalPages < 3 || currentPage === 3}>3</button>
         {totalPages > 4 && currentPage < totalPages - 1 && <span className={styles.ellipsis}>...</span>} {/* 调整省略号显示逻辑 */}
         {totalPages > 3 && <button onClick={() => onPageChange(totalPages)} className={currentPage === totalPages ? styles.active : ''} disabled={currentPage === totalPages}>{totalPages}</button>}
       </>
     );
   };


  return (
    <div className={styles.pagination}>
      {/* 上一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.arrowButton}
        aria-label="上一页" // 添加 aria-label 提高可访问性
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {/* 页码 */}
       {renderPageNumbers()}

      {/* 下一页按钮 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.arrowButton}
        aria-label="下一页" // 添加 aria-label 提高可访问性
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

// 不再需要设置 defaultProps，因为 currentPage 和 onPageChange 应该由父组件控制
// totalPages 可以由父组件传入，或在这里设默认值（但不推荐）
// Pagination.defaultProps = { ... };

export default Pagination;