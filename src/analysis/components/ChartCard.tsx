// src/analysis/components/ChartCard.tsx
import React from 'react';
import Icon from './common/Icon'; // 引入自定义 Icon 组件
import EChartBase from './common/EChartBase'; // 引入 ECharts 基础封装组件
import type { ChartCardData } from '@/analysis/types'; // 引入图表卡片数据类型定义
import { faSitemap, faLeaf, faBookOpen, faComments, faDatabase, faCheckCircle, faChartLine, faGlobe, faBug, faChartArea, faTags, faFileAlt } from '@fortawesome/free-solid-svg-icons';

// 定义 ChartCard 组件的 Props 接口
interface ChartCardProps {
  chartData: ChartCardData; // 包含该图表卡片所有数据的对象
}

/**
 * 一个可重用的卡片组件，专门用于包裹和显示 ECharts 图表。
 *
 * @param chartData - 一个包含图表信息的对象 (来自 ChartCardData 类型)。
 *                    例如：{ id: 'taxonomy', icon: 'sitemap', title: '物种分类层级分布', chartOption: {...}, chartHeight: '300px' }
 */
const ChartCard: React.FC<ChartCardProps> = ({ chartData }) => {
  // 从 chartData 对象中解构所需属性
  const {
    id,
    icon,
    title,
    chartOption, // ECharts 配置对象
    chartHeight, // 可选的自定义图表高度
    className   // 可选的附加 CSS 类名
  } = chartData;

  // --- 定义图表容器的内联样式 ---
  // 优先使用 chartData 中传入的 chartHeight，否则默认为 '100%' (由 flex 填充)
  // 设置最小高度确保图表在没有足够内容时也能显示
  // 根据图标名称获取对应的FontAwesome图标
const getIconByName = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'sitemap': faSitemap,
    'leaf': faLeaf,
    'book-open': faBookOpen,
    'comments': faComments,
    'database': faDatabase,
    'check-circle': faCheckCircle,
    'chart-line': faChartLine,
    'globe-asia': faGlobe,
    'bug': faBug,
    'chart-area': faChartArea,
    'tags': faTags,
    'file-alt': faFileAlt
  };
  return iconMap[iconName] || faChartLine; // 默认返回chart-line图标
};

const chartContainerStyle: React.CSSProperties = {
    width: '100%', // 宽度始终为 100%
    height: chartHeight || '100%', // 高度优先使用传入值
    minHeight: '250px', // 设置一个合理的最小高度
  };

  return (
    // 最外层 div 应用基础卡片样式、图表卡片特定样式以及可能的附加类名
    // 使用 id 属性，虽然在 React 中不常用作选择器，但保留以对应 HTML 结构
    <div className={`card chart-card ${className || ''}`} id={`card-${id}`}>
      {/* 卡片头部 */}
      <div className="card-header">
        {/* 显示图标 */}
        <Icon icon={getIconByName(icon)} className={`icon icon-${icon}`} />
        {/* 显示图表标题 */}
        <span>{title}</span>
      </div>

      {/* 图表容器 */}
      {/*
        这个 div 用于包裹 EChartBase 组件，并可以通过 CSS 控制其布局。
        它的高度将影响内部 EChartBase 组件的可用空间。
      */}
      <div className="chart-container">
        {/*
          使用 EChartBase 组件来渲染图表。
          - option: 传递 ECharts 配置对象。
          - style: 传递计算好的内联样式，控制 EChartBase 内部 div 的大小。
          - theme: 可以选择性地传递 ECharts 主题名称或对象。
        */}
        <EChartBase
          option={chartOption}
          style={chartContainerStyle}
          // theme="vintage" // 示例：应用一个 ECharts 内置主题
        />
      </div>
    </div>
  );
};

export default ChartCard; // 导出组件