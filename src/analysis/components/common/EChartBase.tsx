// src/analysis/components/common/EChartBase.tsx
"use client";

import React, { useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { echarts } from '@/lib/echartsSetup';
import type { EChartsOption, ECharts } from 'echarts';

interface EChartBaseProps {
  option: EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  theme?: string | object;
  showLoading?: boolean;
}

const EChartBase: React.FC<EChartBaseProps> = ({
  option,
  style = { width: '100%', height: '100%' }, // 确保默认有尺寸
  className,
  theme,
  showLoading,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<ECharts | null>(null);

  const initChart = useCallback(() => {
    // 确保chartRef.current存在且可见
    if (!chartRef.current) {
      console.warn('Chart container ref is not available during init.');
      return;
    }
    
    // 记录容器尺寸，帮助调试
    const width = chartRef.current.offsetWidth;
    const height = chartRef.current.offsetHeight;
    console.log(`Initializing chart with container dimensions: ${width}x${height}`, chartRef.current.id || '');
    
    // 检查容器尺寸是否有效
    if (width > 0 && height > 0) {
      try {
        // 销毁旧实例（如果存在），避免重复初始化
        if (chartInstanceRef.current) {
          console.log('Disposing existing chart instance before re-init.');
          chartInstanceRef.current.dispose();
          chartInstanceRef.current = null;
        }
        
        // 初始化新的图表实例
        // 添加一个小延迟，确保DOM完全更新
        setTimeout(() => {
          if (chartRef.current) {
            try {
              const chart = echarts.init(chartRef.current, theme);
              chartInstanceRef.current = chart as unknown as ECharts;
              console.log('ECharts instance initialized successfully.', chartRef.current.id || '');
              
              // 立即设置选项，确保图表显示
              if (chart && option) {
                chart.setOption(option, true);
                console.log('Initial options set for chart:', chartRef.current.id || '');
              }
            } catch (innerError) {
              console.error('Error in delayed chart initialization:', innerError);
            }
          }
        }, 0);
      } catch (error) {
        console.error('Error initializing ECharts:', error, chartRef.current.id || '');
        if (chartRef.current) {
          chartRef.current.innerHTML = `<p style="color: red; text-align: center; padding: 10px;">图表初始化失败</p>`;
        }
      }
    } else {
      // 容器尺寸为0，记录警告
      console.warn(`Chart container has zero dimensions (${width}x${height}) during init.`, chartRef.current.id || '');
      
      // 尝试强制设置容器样式以确保可见
      if (chartRef.current) {
        const currentStyle = chartRef.current.style;
        if (!currentStyle.width || currentStyle.width === '0px' || currentStyle.width === '0%') {
          console.log('Setting explicit width on container');
          chartRef.current.style.width = '100%';
        }
        if (!currentStyle.height || currentStyle.height === '0px' || currentStyle.height === '0%') {
          console.log('Setting explicit height on container');
          chartRef.current.style.height = '300px';
        }
      }
    }
  }, [theme, option]);

  const disposeChart = useCallback(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
      chartInstanceRef.current = null;
      // console.log('ECharts instance disposed.');
    }
  }, []);

  useEffect(() => {
    // 使用 requestAnimationFrame 和 setTimeout 组合策略确保容器尺寸已计算
    // 首先尝试使用 requestAnimationFrame，它会在下一次重绘前执行
    const rafId = requestAnimationFrame(() => {
      // 然后添加一个短暂延迟，给浏览器更多时间完成布局计算
      const timerId = setTimeout(() => {
        if (chartRef.current && chartRef.current.offsetWidth > 0 && chartRef.current.offsetHeight > 0) {
          console.log('Initializing chart with dimensions:', chartRef.current.offsetWidth, 'x', chartRef.current.offsetHeight);
          initChart();
        } else {
          // 如果容器尺寸仍然为0，使用更长的延迟再次尝试
          console.warn('Container has zero dimensions, retrying with longer delay...');
          const retryTimerId = setTimeout(() => {
            console.log('Retrying chart initialization...');
            initChart(); // 无论尺寸如何，都尝试初始化
          }, 300); // 更长的延迟
          
          return () => clearTimeout(retryTimerId);
        }
      }, 100); // 增加延迟时间
      
      return () => clearTimeout(timerId);
    });

    return () => {
      cancelAnimationFrame(rafId);
      disposeChart();
    };
  }, [initChart, disposeChart]); // 依赖项包含 initChart

  useLayoutEffect(() => {
    // 如果图表实例存在，设置选项
    if (chartInstanceRef.current) {
      try {
        console.log('Setting option for chart:', chartRef.current?.id || '');
        chartInstanceRef.current.setOption(option, true);
        
        // 处理加载状态
        if (showLoading) {
          chartInstanceRef.current.showLoading();
        } else {
          chartInstanceRef.current.hideLoading();
        }
        
        // 确保图表正确渲染
        chartInstanceRef.current.resize();
      } catch (error) {
        console.error('Error setting ECharts option:', error, chartRef.current?.id || '');
      }
    } else {
      console.warn('Chart instance not available when trying to set option.', chartRef.current?.id || '');
      // 如果图表实例不存在但容器存在且有尺寸，尝试初始化图表
      if (chartRef.current && chartRef.current.offsetWidth > 0 && chartRef.current.offsetHeight > 0) {
        console.log('Attempting to initialize chart during option update...');
        initChart();
      }
    }
  }, [option, showLoading, initChart]); // 依赖项包含option、showLoading和initChart

  useEffect(() => {
    // 如果没有图表实例，不需要设置resize监听
    if (!chartInstanceRef.current) return;

    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (chartInstanceRef.current && chartRef.current && chartRef.current.offsetWidth > 0 && chartRef.current.offsetHeight > 0) { // 检查实例和尺寸
          try {
            console.log('Resizing chart:', chartRef.current?.id || '', chartRef.current.offsetWidth, 'x', chartRef.current.offsetHeight);
            chartInstanceRef.current.resize();
            // 重新应用选项以确保图表正确渲染
            chartInstanceRef.current.setOption(option, true);
          } catch (error) {
            console.error('Error resizing ECharts instance:', error, chartRef.current?.id || '');
          }
        } else {
            console.warn('Skipping resize for chart as instance or container is not ready:', chartRef.current?.id || '');
            // 如果容器尺寸为0，可能需要重新初始化图表
            if (chartRef.current && chartRef.current.offsetWidth === 0 && chartRef.current.offsetHeight === 0) {
              console.log('Container has zero dimensions during resize, attempting to reinitialize...');
              // 尝试重新初始化图表
              setTimeout(initChart, 200);
            }
        }
      }, 250);
    };

    // 添加ResizeObserver监听容器尺寸变化，这比window resize更精确
    let resizeObserver: ResizeObserver | null = null;
    try {
      resizeObserver = new ResizeObserver((entries) => {
        // 当容器尺寸变化时触发resize
        debouncedResize();
      });
      
      if (chartRef.current) {
        resizeObserver.observe(chartRef.current);
      }
    } catch (error) {
      console.warn('ResizeObserver not supported, falling back to window resize event');
    }

    // 同时保留window resize事件监听作为后备
    window.addEventListener('resize', debouncedResize);

    // 首次挂载后调用一次resize，确保初始尺寸正确
    debouncedResize();

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedResize);
      if (resizeObserver) {
        if (chartRef.current) resizeObserver.unobserve(chartRef.current);
        resizeObserver.disconnect();
      }
    };
  }, [option, initChart]); // 添加option和initChart作为依赖项

  // **添加一个唯一的 ID，方便调试**
  const elementId = `echart-${React.useId()}`;

  return (
    <div
      id={elementId} // 添加 ID
      ref={chartRef}
      className={className}
      style={style} // 确保 style 包含有效的 height 和 width
    />
  );
};

export default EChartBase;