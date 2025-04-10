// src/graph/utils/echartsOptions.ts
import * as echarts from 'echarts/core'; // 引入 echarts 核心
import { GraphData, GraphNode, GraphLink, GraphCategory, SpeciesStatus } from '../types';

// --- 主图谱选项 (保持不变) ---
export function getGraphOption(graphData: GraphData, showLabels: boolean, layout: 'force' | 'circular') {
    if (!graphData) return {}; // 防止数据未加载时出错

    return {
        tooltip: { /* ...保持不变... */
            formatter: (params: any) => {
                if (params.dataType === 'node') {
                    const node = params.data as GraphNode;
                    let detailsHtml = `<b>${node.name.replace('\n', ' ')}</b><br/>类型: ${node.details?.type || graphData.categories[node.category]?.name || '未知'}`;
                    if (node.details) {
                        for (const key in node.details) {
                            if (!['type', 'name', 'guid', 'desc', 'biological_properties', 'morphological_characteristics', 'management_info'].includes(key) && node.details[key]) {
                                let value = node.details[key];
                                if (typeof value === 'string' && value.length > 50) value = value.substring(0, 47) + '...';
                                detailsHtml += `<br/>${key}: ${value}`;
                            }
                        }
                    }
                    return detailsHtml;
                } else if (params.dataType === 'edge') {
                    const edge = params.data as GraphLink;
                    const type = edge.details?.type || '未知关系';
                    const sourceNode = graphData.nodes.find(n => n.id === edge.source);
                    const targetNode = graphData.nodes.find(n => n.id === edge.target);
                    const sourceName = sourceNode ? sourceNode.name.split('\n')[0] : edge.source;
                    const targetName = targetNode ? targetNode.name.split('\n')[0] : edge.target;
                    return `关系: ${type}<br/>${sourceName} → ${targetName}`;
                }
                return '';
            },
            confine: true
        },
        legend: [{ /* ...保持不变... */
            data: graphData.categories.map(a => a.name),
            orient: 'horizontal', bottom: 10, left: 'center', itemWidth: 12, itemHeight: 12,
            textStyle: { fontSize: 10, color: '#666' }, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 5, borderRadius: 4
        }],
        series: [{ /* ...保持不变... */
            type: 'graph', layout: layout, categories: graphData.categories,
            data: graphData.nodes.map(node => ({
                ...node, symbolSize: node.value * 1.2 + 15,
                label: { show: showLabels, position: 'right', formatter: '{b}', fontSize: 9, color: '#333', overflow: 'truncate', width: 80 },
                itemStyle: { shadowBlur: 5, shadowColor: 'rgba(0, 0, 0, 0.15)' },
            })),
            links: graphData.links.map(link => ({
                ...link, label: { show: false },
                lineStyle: { opacity: 0.6, width: link.lineStyle?.width || 1, color: link.lineStyle?.color || '#adb5bd', curveness: layout === 'force' ? 0.1 : 0 },
            })),
            roam: true, label: { show: showLabels, position: 'right', formatter: '{b}', fontSize: 9 },
            force: { repulsion: 90, gravity: 0.04, edgeLength: [70, 130], layoutAnimation: true },
            circular: { rotateLabel: true }, lineStyle: { opacity: 0.6, width: 1, curveness: 0.1 },
            emphasis: { focus: 'adjacency', label: { show: true, fontSize: 11, fontWeight: 'bold' }, lineStyle: { width: 2, opacity: 1 },
                itemStyle: { borderColor: 'rgba(74, 144, 226, 0.8)', borderWidth: 2.5, shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.2)' }
            }
        }]
    };
}

// --- 分析图表选项 (修改部分) ---
export function getNodeTypeOption(graphData: GraphData) {
    if (!graphData || !graphData.nodes || !graphData.categories) return {};
    const typeCounts = graphData.nodes.reduce((acc, node) => {
        const categoryName = graphData.categories[node.category]?.name || '未知';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const data = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
    return {
        tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)' },
        legend: { show: false }, // 图例可能会占用空间，先隐藏
        series: [{
            name: '节点类型', type: 'pie',
            // 问题一修复：适当减小半径，为标签留出更多空间
            radius: ['45%', '70%'], // 减小半径，为标签留出更多空间
            center: ['50%', '55%'], // 轻微下移中心，给顶部留空间
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 1 },
            label: { show: true, fontSize: 9, formatter:'{b}\n{d}%' }, // 字体已较小
            // 缩短标签引导线，减少标签重叠
            labelLine: { show: true, length: 3, length2: 5 }, // 优化引导线长度
            data: data,
            color: graphData.categories.map(c => c.itemStyle?.color || '#ccc')
        }]
    };
}

export function getEdgeTypeOption(graphData: GraphData) {
    if (!graphData || !graphData.links) return {};
    const typeCounts = graphData.links.reduce((acc, link) => {
        const typeName = link.details?.type || '未知关系';
        acc[typeName] = (acc[typeName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const data = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
    return {
        tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)' },
        legend: { show: false },
        series: [{
            name: '关系类型', type: 'pie',
             // 问题一修复：适当减小半径
            radius: '70%', // 减小半径以适应容器
            center: ['50%', '55%'], // 轻微下移
            avoidLabelOverlap: true, // 防止标签重叠很重要
            data: data,
            label: { show: true, fontSize: 9, formatter:'{b}\n{d}%' }, // 字体已较小
            // 优化标签引导线长度
            labelLine: { show: true, length: 3, length2: 5 }, // 调整引导线长度
            itemStyle: { borderRadius: 5 },
            color: ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC']
        }]
    };
}

export function getNodeDegreeOption(graphData: GraphData) {
    if (!graphData || !graphData.nodes || !graphData.links) return {};
    const degree: Record<string, number> = {};
    graphData.links.forEach(link => {
        degree[link.source] = (degree[link.source] || 0) + 1;
        degree[link.target] = (degree[link.target] || 0) + 1;
    });
    const sortedDegrees = Object.entries(degree).map(([id, count]) => {
        const node = graphData.nodes.find(n => n.id === id);
        // 截断过长的节点名称以适应Y轴
        let name = node ? node.name.replace('\n', ' ') : id;
        if (name.length > 15) { // 根据实际情况调整截断长度
           name = name.substring(0, 13) + '...';
        }
        return { name: name, value: count };
    }).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

    return {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        // 问题一修复：调整 grid 边距，特别是左侧，为 Y 轴标签留足空间
        grid: { left: '5%', right: '12%', bottom: '5%', containLabel: true }, // 增加边距，确保标签完全显示
        xAxis: { type: 'value', boundaryGap: [0, 0.01], axisLabel: { fontSize: 10 } },
        yAxis: { 
            type: 'category', 
            data: sortedDegrees.map(d => d.name).reverse(),
            axisLabel: { 
                fontSize: 9, 
                interval: 0,  // 强制显示所有标签
                width: 80,   // 限制标签宽度
                overflow: 'truncate'  // 超出部分显示省略号
            } 
        },
        series: [{
            name: '连接数', type: 'bar', data: sortedDegrees.map(d => d.value).reverse(),
            itemStyle: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ offset: 0, color: '#83bff6' }, { offset: 1, color: '#188df0' }]),
                borderRadius: [0, 3, 3, 0]
            },
            label: { show: true, position: 'right', color: '#333', fontSize: 9 }
        }]
    };
}

export function getSpeciesStatusDistOption(statusData: SpeciesStatus[]) {
    if (!statusData) return {};
    return {
        tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)' },
        legend: { show: false },
        series: [{
            name: '确认状态', type: 'pie',
            // 问题一修复：适当减小半径
            radius: ['40%', '65%'], // 减小半径，为标签留出更多空间
            center: ['50%', '55%'], // 轻微下移中心
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 1 },
            label: { show: true, fontSize: 9, formatter: '{b}\n{d}%' },
            labelLine: { show: true, length: 2, length2: 4 }, // 缩短引导线长度
            data: statusData,
            color: ['#48c9b0', '#f39c12', '#e74c3c', '#a569bd']
        }]
    };
}