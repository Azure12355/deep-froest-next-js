// src/graph/KnowledgeGraphPage.tsx
'use client'; // 声明为客户端组件

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import KGHeader from './components/KGHeader';
import QuerySidebar from './components/QuerySidebar';
import AnalysisArea from './components/AnalysisArea';
import GraphVisualization from './components/GraphVisualization';
import InfoPanel from './components/InfoPanel';
import styles from './KnowledgeGraph.module.css'; // 引入页面样式
import { getMockGraphData } from './utils/mockData';
import { getGraphOption } from './utils/echartsOptions';
import { GraphData, EChartClickParams, GraphNode, GraphLink } from './types';

const KnowledgeGraphPage: React.FC = () => {
    // --- 状态管理 ---
    const [isLoading, setIsLoading] = useState<boolean>(true); // 加载状态
    const [fullGraphData, setFullGraphData] = useState<GraphData | null>(null); // 完整的原始数据
    const [displayGraphData, setDisplayGraphData] = useState<GraphData | null>(null); // 当前显示的数据(可能被过滤)
    const [selectedItem, setSelectedItem] = useState<EChartClickParams | null>(null); // 当前选中的节点或边
    const [searchTerm, setSearchTerm] = useState<string>(''); // 搜索词
    const [layoutType, setLayoutType] = useState<'force' | 'circular'>('force'); // 当前布局类型
    const [showLabels, setShowLabels] = useState<boolean>(true); // 是否显示标签

    // --- 数据加载 ---
    useEffect(() => {
        console.log('DeepForest KG 页面初始化 (React版)');
        setIsLoading(true);
        try {
            // 模拟异步加载
            setTimeout(() => {
                const mockData = getMockGraphData();
                setFullGraphData(mockData);
                setDisplayGraphData(mockData); // 初始显示完整数据
                setIsLoading(false);
                console.log(`数据加载完成: ${mockData.nodes.length} 个节点, ${mockData.links.length} 条关系.`);
            }, 500); // 模拟网络延迟
        } catch (error) {
            console.error("[错误] 加载图谱数据时失败:", error);
            setIsLoading(false);
            // 可以在这里设置错误状态并显示错误信息
        }
    }, []); // 空依赖数组，仅在组件挂载时执行一次

    // --- 搜索过滤逻辑 ---
    useEffect(() => {
        if (!fullGraphData) return; // 如果没有完整数据，则不执行过滤

        if (!searchTerm) {
            // 如果搜索词为空，显示完整图谱
            setDisplayGraphData(fullGraphData);
            return;
        }

        // 执行过滤
        const term = searchTerm.toLowerCase();
        const filteredNodes = fullGraphData.nodes.filter(node =>
            node.name.toLowerCase().includes(term) ||
            (node.details && Object.values(node.details).some(val => String(val).toLowerCase().includes(term)))
        );
        const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

        // (可选) 包含一级邻居
        const neighbors = new Set<string>();
        fullGraphData.links.forEach(link => {
            if (filteredNodeIds.has(link.source)) neighbors.add(link.target);
            if (filteredNodeIds.has(link.target)) neighbors.add(link.source);
        });
        neighbors.forEach(id => filteredNodeIds.add(id));

        const finalFilteredNodes = fullGraphData.nodes.filter(node => filteredNodeIds.has(node.id));
        const finalFilteredLinks = fullGraphData.links.filter(link =>
            filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
        );

        console.log(`[调试] 搜索过滤结果: ${finalFilteredNodes.length} 个节点, ${finalFilteredLinks.length} 条关系.`);
        setDisplayGraphData({
            nodes: finalFilteredNodes,
            links: finalFilteredLinks,
            categories: fullGraphData.categories, // 保持原始分类信息
            speciesConfirmationStatus: fullGraphData.speciesConfirmationStatus // 保持状态信息
        });
        // 清除选中项，因为当前显示的图可能不包含它
        setSelectedItem(null);

    }, [searchTerm, fullGraphData]); // 当搜索词或完整数据变化时，重新执行过滤

    // --- 事件处理回调 ---
    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    const handleLayoutChange = useCallback((layout: 'force' | 'circular') => {
        setLayoutType(layout);
    }, []);

    const handleShowLabelsChange = useCallback((show: boolean) => {
        setShowLabels(show);
    }, []);

    const handleChartClick = useCallback((params: EChartClickParams) => {
        console.log('图谱点击:', params);
        setSelectedItem(params); // 更新选中的节点或边
    }, []);

    // --- 计算 ECharts 选项 (使用 useMemo 优化) ---
    const graphChartOption = useMemo(() => {
        if (!displayGraphData) return {}; // 数据未加载则返回空配置
        return getGraphOption(displayGraphData, showLabels, layoutType);
    }, [displayGraphData, showLabels, layoutType]); // 依赖项变化时重新计算

    // --- 渲染 ---
    return (
        <div className={styles.kgContainer}>
            {/* 头部 */}
            {/* <KGHeader /> */}

            {/* 主要内容网格布局 */}
            <main className={styles.kgMainContentGrid}>
                {/* 左侧查询区域 */}
                <QuerySidebar
                    totalNodes={displayGraphData?.nodes.length ?? '---'}
                    totalEdges={displayGraphData?.links.length ?? '---'}
                    onSearch={handleSearch}
                    onLayoutChange={handleLayoutChange}
                    onShowLabelsChange={handleShowLabelsChange}
                    currentLayout={layoutType}
                    showLabels={showLabels}
                />

                {/* 顶部图谱分析区域 */}
                <AnalysisArea
                    graphData={displayGraphData}
                    isLoading={isLoading}
                />

                {/* 中间知识图谱可视化区域 */}
                <GraphVisualization
                    chartOption={graphChartOption}
                    isLoading={isLoading}
                    onChartClick={handleChartClick}
                />

                {/* 右侧详细信息区域 */}
                <InfoPanel
                    selectedItem={selectedItem}
                    graphData={fullGraphData} // 传递完整数据以便查找名称
                />
            </main>
        </div>
    );
};

export default KnowledgeGraphPage;