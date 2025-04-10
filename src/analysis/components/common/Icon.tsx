// src/analysis/components/common/Icon.tsx
import React from 'react';
// 引入 FontAwesome React 组件和核心类型
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
// 按需引入需要的 solid 图标，减小打包体积
import {
    faTree, faUserCircle, faBell, faLeaf, faBookOpen, faComments,
    faDatabase, faSitemap, faCheckCircle, faChartLine, faGlobeAsia,
    faBug, faChartArea, faTags, faFileAlt, faQuestionCircle // 添加了问号图标作为备用
 } from '@fortawesome/free-solid-svg-icons';

// --- 将引入的图标添加到 FontAwesome 库中 ---
// 这样做的好处是可以使用字符串名称来引用图标，但需要在组件加载前完成添加。
library.add(
    faTree, faUserCircle, faBell, faLeaf, faBookOpen, faComments,
    faDatabase, faSitemap, faCheckCircle, faChartLine, faGlobeAsia,
    faBug, faChartArea, faTags, faFileAlt, faQuestionCircle
);

// --- 定义组件 Props ---
// 扩展 FontAwesomeIconProps，但将 'icon' 属性替换为我们自定义的 'iconName' 字符串
interface IconProps extends Omit<FontAwesomeIconProps, 'icon'> {
  iconName: string; // 使用字符串名称来指定图标
}

/**
 * FontAwesome 图标的封装组件。
 * 允许通过字符串名称 (例如 'tree', 'user-circle') 来使用图标，
 * 前提是这些图标已通过 library.add() 添加到库中。
 *
 * @param iconName - 要显示的图标的字符串名称 (必须已添加到 library)。
 * @param props - 其他可以传递给 FontAwesomeIcon 组件的属性 (例如 size, className, color, onClick 等)。
 */
const Icon: React.FC<IconProps> = ({ iconName, ...props }) => {
  // FontAwesome 要求 'icon' 属性是一个 IconDefinition 对象或特定的数组/字符串格式
  // 因为我们已经通过 library.add 添加了图标，可以直接使用字符串名称作为 'icon' prop 的值
  // 类型 'string' 可以赋值给类型 'IconProp'。

  // 这里不需要 iconMap 了，因为 library.add 允许直接用字符串
  // const selectedIcon = iconMap[iconName];
  // if (!selectedIcon) { ... }

  return (
      <FontAwesomeIcon
          icon={['fas', iconName]} // 使用 FontAwesome 的数组格式 ['fas', 'icon-name'] 来引用 solid 图标
          {...props} // 传递其余的 props
       />
   );

  // 注意：如果图标没有被 library.add 添加，或者名称拼写错误，这里会出错或不显示图标。
  // 可以添加错误处理，但通常建议确保所有使用的图标都已添加。
};

export default Icon;