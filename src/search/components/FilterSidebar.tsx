// src/search/components/FilterSidebar.tsx
"use client"; // <--- 添加此行，标记为客户端组件

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import styles from './FilterSidebar.module.css';
import SearchBox from './SearchBox';
import FilterGroup from './FilterGroup';
import FilterActions from './FilterActions';
// 导入 FilterGroup 内部使用的样式，以便可以应用
import filterGroupStyles from './FilterGroup.module.css'; // 这个导入可能不再需要，因为样式在 FilterGroup 内部处理


/**
 * 左侧筛选侧边栏组件
 * @description 因为聚合了多个交互式客户端子组件 (SearchBox, FilterActions)
 *              并管理筛选逻辑（虽然目前是静态的），标记为客户端组件更合适。
 */
const FilterSidebar: React.FC = () => {

    // 在这里可以添加处理筛选条件变化的状态和逻辑
    // 例如: const [filters, setFilters] = React.useState({...});
    // 然后将状态和更新函数传递给子组件或 FilterActions

  return (
    <aside className={styles.filterSidebar}>
      {/* 搜索框 */}
      <SearchBox />

      {/* 筛选条件标题 */}
      <h3 className={styles.filterTitle}>
        <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
        筛选条件
      </h3>

      {/* 物种信息筛选组 (默认展开) */}
      <FilterGroup title="物种信息" defaultOpen={true}>
        {/* FilterGroup 的子元素不需要直接访问 filterGroupStyles */}
        <div className={filterGroupStyles.filterItem}> {/* 可以定义一个通用 item 类 */}
          <label htmlFor="classification">分类:</label>
          <select id="classification" className={filterGroupStyles.filterItem}>
            <option value="">所有分类</option>
            <option value="线虫动物门">线虫动物门</option>
            <option value="节肢动物门">节肢动物门</option>
          </select>
        </div>
        <div className={filterGroupStyles.filterItem}>
          <label htmlFor="status">确认状态:</label>
          <select id="status" className={filterGroupStyles.filterItem}>
            <option value="">所有状态</option>
            <option value="已确认">已确认</option>
            <option value="待审核">待审核</option>
          </select>
        </div>
        <div className={filterGroupStyles.filterItem}>
          <label htmlFor="taxonomic_level">分类层级:</label>
          <select id="taxonomic_level" className={filterGroupStyles.filterItem}>
            <option value="">所有层级</option>
            <option value="种">种</option>
            <option value="属">属</option>
            <option value="科">科</option>
          </select>
        </div>
      </FilterGroup>

      {/* 地理分布筛选组 */}
      <FilterGroup title="地理分布">
         <div className={filterGroupStyles.filterItem}>
            <label htmlFor="continent">大洲:</label>
            <input type="text" id="continent" placeholder="如：亚洲" className={filterGroupStyles.filterItem}/>
        </div>
        <div className={filterGroupStyles.filterItem}>
            <label htmlFor="country">国家:</label>
            <input type="text" id="country" placeholder="如：中国" className={filterGroupStyles.filterItem}/>
        </div>
         <div className={filterGroupStyles.filterItem}>
            <label htmlFor="province">省份:</label>
            <input type="text" id="province" placeholder="如：北京" className={filterGroupStyles.filterItem}/>
        </div>
      </FilterGroup>

      {/* 寄主信息筛选组 */}
      <FilterGroup title="寄主信息">
        <div className={filterGroupStyles.filterItem}>
            <label htmlFor="host_name">寄主名称:</label>
            <input type="text" id="host_name" placeholder="输入寄主学名或中文名" className={filterGroupStyles.filterItem}/>
        </div>
         <div className={filterGroupStyles.filterItem}>
            <label htmlFor="host_type">寄主类型:</label>
            <select id="host_type" className={filterGroupStyles.filterItem}>
                <option value="">所有类型</option>
                <option value="primary">主要寄主</option>
                <option value="secondary">次要寄主</option>
                <option value="occasional">偶发寄主</option>
            </select>
        </div>
      </FilterGroup>

      {/* 文献信息筛选组 */}
      <FilterGroup title="文献信息">
         <div className={filterGroupStyles.filterItem}>
            <label htmlFor="ref_type">文献类型:</label>
             <select id="ref_type" className={filterGroupStyles.filterItem}>
                <option value="">所有类型</option>
                <option value="distribution">分布</option>
                <option value="biology">生物学</option>
                <option value="control">防治</option>
            </select>
        </div>
         <div className={filterGroupStyles.filterItem}>
            <label htmlFor="pub_year">发表年份:</label>
            <input type="number" id="pub_year" placeholder="如: 2023" className={filterGroupStyles.filterItem}/>
        </div>
      </FilterGroup>

      {/* 筛选操作按钮 */}
      <FilterActions />
    </aside>
  );
};

export default FilterSidebar;