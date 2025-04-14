// src/search/components/ResultsArea.tsx
"use client";

import React, { useState, useEffect } from 'react'; // 引入 useEffect
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'; // 引入加载和错误图标
import { Spin, Alert, Empty } from 'antd'; // 引入 Ant Design 组件
import styles from './ResultsArea.module.css';
import ResultCard from './ResultCard';
import Pagination from './Pagination';
// 引入 API 调用函数和类型
import { fetchSearchResults, SearchParams, SearchResultItem, PaginatedResponse } from '@/services/searchApi';

// 定义 Props 类型，接收搜索参数
interface ResultsAreaProps {
  searchParams: Omit<SearchParams, 'page' | 'pageSize'>; // 从父组件接收过滤和查询参数
}

/**
 * 右侧搜索结果展示区域组件
 */
const ResultsArea: React.FC<ResultsAreaProps> = ({ searchParams }) => {
   // --- 状态管理 ---
   const [resultsData, setResultsData] = useState<PaginatedResponse<SearchResultItem> | null>(null); // 存储 API 返回的分页数据
   const [currentPage, setCurrentPage] = useState(1); // 当前页码状态
   const [isLoading, setIsLoading] = useState(true); // 加载状态
   const [error, setError] = useState<string | null>(null); // 错误状态
   const [pageSize, setPageSize] = useState(10); // 每页大小状态 (可以设为常量或从配置读取)

   // --- 数据获取 Effect ---
   useEffect(() => {
       // 定义获取数据的异步函数
       const loadResults = async () => {
           setIsLoading(true); // 开始加载
           setError(null);     // 清除旧错误

           // 组合所有搜索参数
           const currentParams: SearchParams = {
               ...searchParams, // 来自 props 的过滤和查询条件
               page: currentPage,
               pageSize: pageSize,
           };

           try {
               // 调用 API 获取数据
               const data = await fetchSearchResults(currentParams);
               setResultsData(data); // 更新状态
           } catch (err: any) {
               console.error("搜索结果加载失败:", err);
               setError(err.message || "加载搜索结果时发生未知错误");
               setResultsData(null); // 清空旧数据
           } finally {
               setIsLoading(false); // 结束加载
           }
       };

       loadResults(); // 执行加载

       // 当 searchParams (查询和过滤条件) 或 currentPage 变化时，重新获取数据
   }, [searchParams, currentPage, pageSize]); // 依赖项包括 searchParams 和 currentPage

   // 处理分页改变
   const handlePageChange = (page: number) => {
       if (page !== currentPage) {
           console.log(`切换到页面: ${page}`);
           setCurrentPage(page);
           // 滚动到顶部 (可以根据需要保留或移除)
           // window.scrollTo(0, 0);
       }
   };

   // --- 渲染逻辑 ---
   const renderResults = () => {
       // 1. 加载中
       if (isLoading) {
           return (
               <div style={{ textAlign: 'center', padding: '50px' }}>
                   <Spin size="large" tip="正在加载搜索结果..." />
               </div>
           );
       }
       // 2. 加载出错
       if (error) {
           return (
               <Alert
                   message="加载错误"
                   description={error}
                   type="error"
                   showIcon
                   icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
               />
           );
       }
       // 3. 加载成功但无结果
       if (!resultsData || resultsData.records.length === 0) {
           return (
               <Empty description="未找到相关结果，请尝试调整搜索或筛选条件。" />
           );
       }
       // 4. 正常显示结果
       return (
           <>
                {/* 结果卡片网格 */}
                <div className={styles.resultsGrid}>
                    {resultsData.records.map((result) => (
                    <ResultCard
                        key={result.id} // 使用唯一标识符作为 key
                        type={result.type as 'species' | 'document'}
                        // icon={result.icon} // 后端不一定返回图标，让 ResultCard 根据 type 决定
                        title={result.title}
                        scientificName={result.scientificName}
                        classification={result.classification}
                        status={result.status}
                        statusType={result.statusType as 'confirmed' | 'pending' | 'default'}
                        author={result.author}
                        description={result.description}
                        tags={result.tags}
                        buttonText={result.type === 'species' ? '查看详情' : '查看文献'} // 根据类型显示按钮文字
                        detailLink={result.detailLink}
                    />
                    ))}
                </div>

                {/* 分页控件 */}
                { resultsData.totalPages > 1 && ( // 只有多于一页时才显示分页
                    <Pagination
                        currentPage={resultsData.page} // 使用从 API 返回的当前页
                        totalPages={resultsData.totalPages}
                        onPageChange={handlePageChange}
                    />
                 ) }
           </>
       );
   };

  return (
    <main className={styles.resultsArea}>
      {/* 结果区域标题 */}
      <h2 className={styles.resultsTitle}>
        <FontAwesomeIcon icon={faListUl} className={styles.resultsIcon} />
        搜索结果
        {!isLoading && !error && resultsData && (
             <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: 'auto'}}>
                共 {resultsData.total} 条结果，第 {resultsData.page} / {resultsData.totalPages} 页
             </span>
        )}
      </h2>

      {/* 渲染结果区域 */}
      {renderResults()}

    </main>
  );
};

export default ResultsArea;