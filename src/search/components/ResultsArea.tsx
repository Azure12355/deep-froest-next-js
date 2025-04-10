// src/search/components/ResultsArea.tsx
"use client"; // <--- 添加此行，标记为客户端组件

import React from 'react'; // useState 需要 React
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faLeaf, faBug, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import styles from './ResultsArea.module.css';
import ResultCard from './ResultCard';
import Pagination from './Pagination';

// 模拟的搜索结果数据 (实际应用中应从API获取)
// 注意：如果这些数据是从服务器获取的，可以将此数组的获取逻辑移到父级服务器组件中，
// 然后作为 prop 传递给 ResultsArea。但 ResultsArea 自身仍需是客户端组件，因为要用 useState。
const mockResults = [
    {
        id: 'result-1', // 添加唯一 key
        type: 'species',
        icon: faLeaf,
        title: '松材线虫',
        scientificName: 'Bursaphelenchus xylophilus',
        classification: '线虫动物门',
        status: '已确认',
        statusType: 'confirmed',
        description: '一种毁灭性森林病害，主要危害松树，可导致松树迅速枯萎死亡...',
        tags: ['寄主: 松属', '分布: 亚洲、北美、欧洲'],
        buttonText: '查看详情',
        detailLink: '/search/detail/1' // 示例链接
    },
    {
        id: 'result-2',
        type: 'species',
        icon: faBug,
        title: '美国白蛾',
        scientificName: 'Hyphantria cunea',
        classification: '节肢动物门',
        status: '待审核',
        statusType: 'pending',
        description: '一种重要的国际检疫性害虫，食性杂，繁殖量大，危害多种林木、果树和农作物...',
        tags: ['寄主: 杨树, 柳树, 榆树', '分布: 北美、欧洲、亚洲'],
        buttonText: '查看详情',
        detailLink: '/search/detail/2'
    },
    {
        id: 'result-3',
        type: 'document',
        icon: faBookOpen,
        title: '松材线虫病研究进展 (2023)',
        author: '张三, 李四 等',
        description: '本文综述了近年来松材线虫病的发生规律、传播途径、致病机理及综合防治技术的最新研究进展...',
        tags: ['关键词: 松材线虫', '综述', '防治'],
        buttonText: '查看文献',
        detailLink: '/literature/3' // 示例文献链接
    },
    {
        id: 'result-4',
        type: 'species',
        title: '光肩星天牛',
        scientificName: 'Anoplophora glabripennis',
        classification: '节肢动物门',
        status: '已确认',
        statusType: 'confirmed',
        description: '危害多种阔叶树，特别是杨、柳、榆、槭等，是重要的国际检疫对象...',
        tags: ['寄主: 杨属, 槭属', '分布: 亚洲, 北美'],
        buttonText: '查看详情',
        detailLink: '/search/detail/4'
    },
    {
        id: 'result-1', // 添加唯一 key
        type: 'species',
        icon: faLeaf,
        title: '松材线虫',
        scientificName: 'Bursaphelenchus xylophilus',
        classification: '线虫动物门',
        status: '已确认',
        statusType: 'confirmed',
        description: '一种毁灭性森林病害，主要危害松树，可导致松树迅速枯萎死亡...',
        tags: ['寄主: 松属', '分布: 亚洲、北美、欧洲'],
        buttonText: '查看详情',
        detailLink: '/search/detail/1' // 示例链接
    },
    {
        id: 'result-2',
        type: 'species',
        icon: faBug,
        title: '美国白蛾',
        scientificName: 'Hyphantria cunea',
        classification: '节肢动物门',
        status: '待审核',
        statusType: 'pending',
        description: '一种重要的国际检疫性害虫，食性杂，繁殖量大，危害多种林木、果树和农作物...',
        tags: ['寄主: 杨树, 柳树, 榆树', '分布: 北美、欧洲、亚洲'],
        buttonText: '查看详情',
        detailLink: '/search/detail/2'
    },
    {
        id: 'result-3',
        type: 'document',
        icon: faBookOpen,
        title: '松材线虫病研究进展 (2023)',
        author: '张三, 李四 等',
        description: '本文综述了近年来松材线虫病的发生规律、传播途径、致病机理及综合防治技术的最新研究进展...',
        tags: ['关键词: 松材线虫', '综述', '防治'],
        buttonText: '查看文献',
        detailLink: '/literature/3' // 示例文献链接
    },
    {
        id: 'result-4',
        type: 'species',
        title: '光肩星天牛',
        scientificName: 'Anoplophora glabripennis',
        classification: '节肢动物门',
        status: '已确认',
        statusType: 'confirmed',
        description: '危害多种阔叶树，特别是杨、柳、榆、槭等，是重要的国际检疫对象...',
        tags: ['寄主: 杨属, 槭属', '分布: 亚洲, 北美'],
        buttonText: '查看详情',
        detailLink: '/search/detail/4'
    },
    
];


/**
 * 右侧搜索结果展示区域组件
 * @description 因为使用了 useState Hook 来管理分页状态，需要标记为客户端组件。
 */
const ResultsArea: React.FC = () => {
   // 分页状态现在可以在客户端组件中正常使用
   // 初始页码通常从 URL 参数或父组件获取，这里简单设为 1
   const [currentPage, setCurrentPage] = React.useState(1);
   // 总页数通常从 API 响应中获取，这里模拟为 10
   const totalPages = 10;

   const handlePageChange = (page: number) => {
       console.log(`切换到页面: ${page}`);
       setCurrentPage(page);
       // TODO: 在此触发重新获取数据的逻辑，例如调用 API 并传入新的页码 `page`
       // fetch(`/api/search?page=${page}&query=...`)
       window.scrollTo(0, 0); // 切换页面后滚动到顶部
   };


  return (
    <main className={styles.resultsArea}>
      {/* 结果区域标题 */}
      <h2 className={styles.resultsTitle}>
        <FontAwesomeIcon icon={faListUl} className={styles.resultsIcon} />
        搜索结果
        {/* 可以考虑显示结果数量和当前页信息 */}
        <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: 'auto'}}>
            第 {currentPage} / {totalPages} 页
        </span>
      </h2>

      {/* 结果卡片网格 */}
      <div className={styles.resultsGrid}>
        {/* 确保为列表项提供稳定的 key */}
        {mockResults.map((result) => (
          <ResultCard
            key={result.id} // 使用唯一标识符作为 key
            type={result.type as 'species' | 'document'}
            icon={result.icon}
            title={result.title}
            scientificName={result.scientificName}
            classification={result.classification}
            status={result.status}
            statusType={result.statusType as 'confirmed' | 'pending' | 'default'}
            author={result.author}
            description={result.description}
            tags={result.tags}
            buttonText={result.buttonText}
            detailLink={result.detailLink}
          />
        ))}
      </div>

      {/* 分页控件 */}
      { totalPages > 1 && ( // 只有多于一页时才显示分页
           <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
           />
       ) }
    </main>
  );
};

export default ResultsArea;