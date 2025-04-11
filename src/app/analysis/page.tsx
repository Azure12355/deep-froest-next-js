// src/app/analysis/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Script from 'next/script'; // 引入 Next.js Script 组件来加载外部 JS
import DashboardHeader from '@/analysis/components/DashboardHeader';
import MetricCard from '@/analysis/components/MetricCard';
import ChartCard from '@/analysis/components/ChartCard';
import type { MetricData, ChartCardData, NameValueData, TimeSeriesData, GeoDistributionData, TopHostData, EChartOption } from '@/analysis/types';
import Icon from '@/analysis/components/common/Icon';
import { checkMapRegistered, echarts } from '@/lib/echartsSetup'; // 引入地图检查函数
import '../globals.css';
import '@/analysis/styles.css';

// --- 模拟数据获取函数 (保持不变) ---
const getMockData = () => ({
    // ... (与之前相同的模拟数据) ...
    metrics: [
        { id: 'species', icon: 'leaf', label: '物种总数', value: 1853, gradientClass: 'gradient-green', periodLabel: '已收录' },
        { id: 'refs', icon: 'book-open', label: '参考文献总数', value: 12450, gradientClass: 'gradient-blue', periodLabel: '本周新增', periodValue: 150 },
        { id: 'qa', icon: 'comments', label: '今日问答量', value: 215, gradientClass: 'gradient-purple', periodLabel: '近7日', periodValue: 1488 },
        { id: 'storage', icon: 'database', label: '文件总大小', value: 88.5, unit: 'GB', gradientClass: 'gradient-orange', periodLabel: '文件数', periodValue: 4320 },
    ] as MetricData[],
    speciesTaxonomy: [
        { value: 980, name: '昆虫纲 (Insecta)' }, { value: 350, name: '蛛形纲 (Arachnida)' },
        { value: 180, name: '线虫门 (Nematoda)' }, { value: 150, name: '真菌界 (Fungi)' },
        { value: 93, name: '其他' },
    ] as NameValueData[],
    speciesStatus: [
        { value: 1500, name: '已确认' }, { value: 253, name: '待审核' }, { value: 100, name: '有疑问' },
    ] as NameValueData[],
    speciesGrowth: {
        dates: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07'],
        counts: [850, 920, 1100, 1350, 1580, 1750, 1853]
    } as TimeSeriesData,
    geoDistribution: [
        { name: '新疆', value: 85 }, { name: '西藏', value: 30 }, { name: '内蒙古', value: 120 }, { name: '青海', value: 50 },
        { name: '四川', value: 230 }, { name: '黑龙江', value: 160 }, { name: '甘肃', value: 90 }, { name: '云南', value: 280 },
        { name: '广西', value: 190 }, { name: '湖南', value: 210 }, { name: '陕西', value: 110 }, { name: '广东', value: 260 },
        { name: '吉林', value: 140 }, { name: '河北', value: 130 }, { name: '湖北', value: 200 }, { name: '贵州', value: 150 },
        { name: '山东', value: 170 }, { name: '江西', value: 140 }, { name: '河南', value: 150 }, { name: '辽宁', value: 160 },
        { name: '山西', value: 100 }, { name: '安徽', value: 170 }, { name: '福建', value: 220 }, { name: '浙江', value: 230 },
        { name: '江苏', value: 250 }, { name: '重庆', value: 180 }, { name: '宁夏', value: 60 }, { name: '海南', value: 90 },
        { name: '台湾', value: 80 }, { name: '北京', value: 40 }, { name: '天津', value: 30 }, { name: '上海', value: 50 },
        { name: '香港', value: 25 }, { name: '澳门', value: 15 }
    ] as GeoDistributionData[],
    topHosts: {
        names: ['杨树 (Populus)', '松树 (Pinus)', '柳树 (Salix)', '苹果 (Malus)', '玉米 (Zea mays)'],
        counts: [350, 280, 190, 150, 120]
    } as TopHostData,
    referenceGrowth: {
        dates: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07'],
        counts: [8000, 8500, 9200, 10100, 11000, 11800, 12450]
    } as TimeSeriesData,
    referenceTypes: [
        { value: 4500, name: '期刊文章' }, { value: 3200, name: '会议论文' },
        { value: 1800, name: '书籍章节' }, { value: 1500, name: '技术报告' }, { value: 1450, name: '其他' },
    ] as NameValueData[],
    fileTypes: [
        { value: 2800, name: 'PDF' }, { value: 950, name: 'DOC/DOCX' },
        { value: 450, name: 'JPG/PNG' }, { value: 120, name: '其他' },
    ] as NameValueData[],
});


/**
 * 数据分析仪表盘主页面组件。
 */
export default function AnalysisPage() {
    const [dashboardData, setDashboardData] = useState(getMockData());
    const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false); // 标记 china.js 脚本是否已加载
    const [isMapRegistered, setIsMapRegistered] = useState(false); // 标记 ECharts 地图是否已注册
    const [isLoading, setIsLoading] = useState(true);

    // Effect Hook: 用于获取仪表盘数据
    useEffect(() => {
        setIsLoading(true);
        console.log("正在获取仪表盘数据...");
        // 实际应用中替换为 API 调用
        const data = getMockData();
        setDashboardData(data);
        console.log("仪表盘数据已获取。");
        // 注意：数据获取完成后，不直接设置 isLoading=false，等待地图脚本加载
        // setIsLoading(false); // 移动到地图检查逻辑之后
    }, []); // 仅在挂载时获取数据

    // --- Effect Hook: 检查地图注册状态 ---
    // 这个 effect 会在 isMapScriptLoaded 变为 true 后运行，
    // 或者在组件挂载后定期检查（如果脚本加载非常快）
    useEffect(() => {
        if (!isMapScriptLoaded) return; // 如果脚本还没加载，则不检查

        let checkInterval: NodeJS.Timeout | null = null;
        let attempts = 0;
        const maxAttempts = 10; // 最多尝试 10 次

        const checkRegistration = () => {
            console.log(`检查地图注册状态 (尝试 ${attempts + 1})...`);
            if (checkMapRegistered('china')) {
                console.log("地图 'china' 已成功注册到 ECharts。");
                setIsMapRegistered(true);
                setIsLoading(false); // 地图也好了，结束加载状态
                if (checkInterval) clearInterval(checkInterval); // 清除定时器
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    console.error(`地图 'china' 在 ${maxAttempts} 次尝试后仍未注册，请检查 china.js 文件和加载顺序。`);
                    setIsLoading(false); // 即使地图失败，也结束加载状态，避免一直 loading
                    if (checkInterval) clearInterval(checkInterval);
                }
            }
        };

        // 首次检查（可能脚本已同步加载并注册）
        checkRegistration();

        // 如果首次未成功，设置定时器轮询检查
        if (!isMapRegistered && attempts < maxAttempts) {
            checkInterval = setInterval(checkRegistration, 500); // 每 500ms 检查一次
        }

        // 清理函数：组件卸载时清除定时器
        return () => {
            if (checkInterval) clearInterval(checkInterval);
        };

    }, [isMapScriptLoaded, isMapRegistered]); // 依赖脚本加载状态和地图注册状态

    // --- 定义 ECharts 配置项 (与之前相同，确保使用 dashboardData) ---
    // 1. 物种分类层级分布 (饼图)
    const speciesTaxonomyOption: EChartOption = { /* ... 同上一个回答 ... */
        tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)' },
        legend: { top: 'bottom', left: 'center', itemWidth: 14, itemHeight: 14, textStyle: { fontSize: 11 } },
        series: [{
            name: '分类层级', type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: false,
            itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
            label: { show: false, position: 'center' },
            emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
            labelLine: { show: false },
            data: dashboardData.speciesTaxonomy,
            color: ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272']
        }]};
    // 2. 物种确认状态 (玫瑰图)
    const speciesStatusOption: EChartOption = { /* ... 同上一个回答 ... */
        tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)' },
        legend: { top: 'bottom', left: 'center', itemWidth: 14, itemHeight: 14, textStyle: { fontSize: 11 } },
        series: [{
            name: '确认状态', type: 'pie', radius: '65%', center: ['50%', '50%'],
            data: dashboardData.speciesStatus.sort((a, b) => a.value - b.value),
            roseType: 'radius',
            label: { color: '#333', formatter: '{d}%', fontSize: 10 },
            labelLine: { length: 4, length2: 8 },
            itemStyle: { borderRadius: 5 },
            color: ['#91CC75', '#FAC858', '#EE6666']
        }]};
    // 3. 物种收录增长趋势 (面积折线图)
    const speciesGrowthOption: EChartOption = { /* ... 同上一个回答 ... */
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', boundaryGap: false, data: dashboardData.speciesGrowth.dates, axisLabel: { fontSize: 10 } },
        yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
        grid: { left: '3%', right: '5%', bottom: '3%', containLabel: true },
        series: [{
            name: '物种数量', type: 'line', smooth: true,
            areaStyle: {
                opacity: 0.3,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(131, 191, 246, 0.8)' }, { offset: 1, color: 'rgba(24, 141, 240, 0.1)' }])
            },
            data: dashboardData.speciesGrowth.counts,
            lineStyle: { color: '#5470C6', width: 2 }, itemStyle: { color: '#5470C6' }
        }]};
    // 4. 物种地理分布 (地图) - 确保 map: 'china'
    const geoDistributionOption: EChartOption = { /* ... 同上一个回答 ... */
        tooltip: { trigger: 'item', formatter: '{b}: {c} 种' },
        visualMap: {
            left: '5%', bottom: '5%', min: 0, max: 300, // Adjust max based on data
            inRange: { color: ['#E0F3F8', '#ABD9E9', '#74ADD1', '#4575B4', '#313695'].reverse() },
            text: ['高', '低'], calculable: true, textStyle: { fontSize: 10, color: '#555' }
        },
        toolbox: { show: true, orient: 'vertical', left: 'right', top: 'center', feature: { restore: {}, saveAsImage: {} }, iconStyle: { borderColor: '#666' } },
        series: [{
            name: '物种分布', type: 'map', map: 'china', // **确保这里是 'china'**
            roam: true, label: { show: false },
            emphasis: { label: { show: true, color: '#000', fontSize: 10 }, itemStyle: { areaColor: '#fdd835' } },
            data: dashboardData.geoDistribution, aspectScale: 0.9
        }]};
    // 5. Top 5 寄主植物 (条形图)
    const topHostsOption: EChartOption = { /* ... 同上一个回答 ... */
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '10%', bottom: '3%', containLabel: true },
        xAxis: { type: 'value', boundaryGap: [0, 0.01], axisLabel: { fontSize: 10 } },
        yAxis: {
            type: 'category', data: [...dashboardData.topHosts.names].reverse(),
            axisLabel: { fontSize: 10, interval: 0, formatter: (value: string) => value.length > 12 ? value.substring(0, 12) + '...' : value }
        },
        series: [{
            name: '关联物种数', type: 'bar', data: [...dashboardData.topHosts.counts].reverse(),
            itemStyle: { color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ offset: 0, color: 'rgba(131, 191, 246, 0.7)' }, { offset: 1, color: 'rgba(24, 141, 240, 1)' }]), borderRadius: [0, 5, 5, 0] },
            label: { show: true, position: 'right', color: '#333', fontSize: 10 }
        }]};
    // 6. 参考文献增长趋势 (面积折线图)
    const referenceGrowthOption: EChartOption = { /* ... 同上一个回答 ... */
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', boundaryGap: false, data: dashboardData.referenceGrowth.dates, axisLabel: { fontSize: 10 } },
        yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
        grid: { left: '3%', right: '5%', bottom: '3%', containLabel: true },
        series: [{
            name: '文献数量', type: 'line', smooth: true,
            areaStyle: { opacity: 0.3, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(159, 236, 162, 0.8)' }, { offset: 1, color: 'rgba(72, 198, 141, 0.1)' }]) },
            data: dashboardData.referenceGrowth.counts,
            lineStyle: { color: '#50E3C2', width: 2 }, itemStyle: { color: '#50E3C2' }
        }]};
    // 7. 参考文献类型 (环形图)
    const referenceTypeOption: EChartOption = { /* ... 同上一个回答 ... */
        tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)' },
        legend: { orient: 'vertical', left: 'left', top: 'center', itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 10 } },
        series: [{
            name: '文献类型', type: 'pie', radius: ['45%', '70%'], center: ['65%', '50%'],
            avoidLabelOverlap: true, label: { show: false, position: 'center' },
            emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
            labelLine: { show: false }, data: dashboardData.referenceTypes,
            color: ['#4fc3f7', '#ffb74d', '#aed581', '#ba68c8', '#dce775', '#ff8a65']
        }]};
    // 8. 关联文件类型 (环形图)
    const fileTypeOption: EChartOption = { /* ... 同上一个回答 ... */
        tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)' },
        legend: { top: 'bottom', left: 'center', itemWidth: 14, itemHeight: 14, textStyle: { fontSize: 11 } },
        series: [{
            name: '文件类型', type: 'pie', radius: ['40%', '65%'],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 1 },
            label: { show: true, position: 'inside', formatter: '{d}%', color: '#fff', fontSize: 10, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' },
            emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' }, itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.3)' } },
            data: dashboardData.fileTypes,
            color: ['#f06292', '#7986cb', '#ffee58', '#bdbdbd']
        }]};

    // --- 整合图表数据 ---
    const chartCards: ChartCardData[] = [
        { id: 'taxonomy', icon: 'sitemap', title: '物种分类层级分布', chartOption: speciesTaxonomyOption },
        { id: 'status', icon: 'check-circle', title: '物种确认状态', chartOption: speciesStatusOption },
        { id: 'species-growth', icon: 'chart-line', title: '物种收录增长趋势', chartOption: speciesGrowthOption },
        { id: 'hosts', icon: 'bug', title: 'Top 5 寄主植物', chartOption: topHostsOption },
        { id: 'ref-growth', icon: 'chart-area', title: '参考文献增长趋势', chartOption: referenceGrowthOption },
        { id: 'ref-type', icon: 'tags', title: '参考文献类型', chartOption: referenceTypeOption },
        { id: 'file-type', icon: 'file-alt', title: '关联文件类型', chartOption: fileTypeOption },
    ];

    // --- 渲染页面 ---
    return (
        <> {/* 使用 Fragment 包裹 Script 和页面内容 */}
            {/*
              使用 Next.js 的 Script 组件加载外部 china.js。
              - strategy="lazyOnload": 在浏览器空闲时加载。
              - onReady: 脚本加载并执行完毕后调用，我们在这里标记脚本已加载。
              - onError: 脚本加载失败时调用。
            */}
            <Script
                src="/china.js" // 相对于 public 目录的路径
                strategy="lazyOnload"
                onReady={() => {
                    console.log("地图脚本 china.js 已加载并执行。");
                    setIsMapScriptLoaded(true);
                }}
                onError={(e) => {
                    console.error("加载地图脚本 china.js 失败:", e);
                    setIsMapScriptLoaded(false); // 标记加载失败
                    setIsLoading(false); // 即使脚本失败，也结束加载状态
                }}
            />

            <div className="dashboard-container">
                <main className="dashboard-content">
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#888' }}>
                            正在加载仪表盘...
                        </div>
                    ) : (
                        <>
                            {/* 第一行：指标卡片 */}
                            <section className="metrics-row">
                                {dashboardData.metrics.map(metric => (
                                    <MetricCard key={metric.id} metric={metric} />
                                ))}
                            </section>

                            {/* 第二行：物种分析图表 */}
                            <section className="charts-row-triple">
                                <ChartCard chartData={chartCards[0]} />
                                <ChartCard chartData={chartCards[1]} />
                                <ChartCard chartData={chartCards[2]} />
                            </section>

                            {/* 第三行：地理分布和宿主分析 */}
                            <section className="charts-row-double">
                                {/* 地理分布地图 - 条件渲染：需要脚本加载且地图注册成功 */}
                                {isMapRegistered ? (
                                    <ChartCard chartData={{
                                        id: 'geo',
                                        icon: 'globe-asia',
                                        title: '物种地理分布热力 (中国)',
                                        chartOption: geoDistributionOption,
                                        className: 'large-card',
                                        // chartHeight: '420px' // CSS 中已设置 min-height
                                    }} />
                                ) : (
                                    // 地图未准备好时的占位符
                                    <div className="card chart-card large-card">
                                        <div className="card-header">
                                            <Icon iconName="globe-asia" className="icon" />
                                            <span>物种地理分布热力 (地图加载失败或未就绪)</span>
                                        </div>
                                        <div className="chart-container tall-chart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', border: '1px dashed #ccc' }}>
                                            无法加载地图数据或 ECharts 地图组件未就绪。
                                            { !isMapScriptLoaded && <span> (脚本未加载)</span> }
                                        </div>
                                    </div>
                                )}
                                {/* Top 5 宿主 */}
                                <ChartCard chartData={chartCards[3]} />
                            </section>

                            {/* 第四行：文献和内容分析 */}
                            <section className="charts-row-triple">
                                <ChartCard chartData={chartCards[4]} />
                                <ChartCard chartData={chartCards[5]} />
                                <ChartCard chartData={chartCards[6]} />
                            </section>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}