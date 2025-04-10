// src/analysis/types/index.ts

/**
 * 指标卡片的数据结构定义
 */
export interface MetricData {
    id: string; // 唯一标识符
    icon: string; // FontAwesome 图标名称 (对应 Icon 组件的 iconName)
    label: string; // 指标名称
    value: string | number; // 指标值
    periodLabel?: string; // 周期标签 (例如 "本周新增")
    periodValue?: string | number; // 周期值
    unit?: string; // 单位 (例如 "GB")
    gradientClass: string; // 用于背景渐变的 CSS 类名
  }
  
  /**
   * ECharts 配置项的基础类型 (实际项目中可以从 'echarts' 导入更精确的类型)
   */
  export type EChartOption = any; // 简化处理，或者 import { EChartsOption } from 'echarts';
  
  /**
   * 图表卡片的数据结构定义
   */
  export interface ChartCardData {
    id: string; // 唯一标识符
    icon: string; // FontAwesome 图标名称
    title: string; // 图表标题
    chartOption: EChartOption; // ECharts 的配置对象
    chartHeight?: string; // 可选的图表容器高度 (CSS 值，例如 '400px')
    className?: string;   // 可选的附加 CSS 类名，用于特殊布局或样式
  }
  
  /**
   * 名称-值 对的数据结构，常用于饼图、部分柱状图等
   */
  export interface NameValueData {
      name: string;
      value: number;
  }
  
  /**
   * 时间序列数据结构，常用于折线图
   */
  export interface TimeSeriesData {
      dates: string[]; // 日期/时间标签数组
      counts: number[]; // 对应的数值数组
  }
  
  /**
   * 地理分布数据结构，用于地图
   */
  export interface GeoDistributionData {
      name: string; // 地理区域名称 (例如省份)
      value: number; // 对应的数值
  }
  
  /**
   * Top N 宿主数据结构，用于条形图
   */
  export interface TopHostData {
      names: string[]; // 宿主名称数组
      counts: number[]; // 对应的关联物种数数组
  }