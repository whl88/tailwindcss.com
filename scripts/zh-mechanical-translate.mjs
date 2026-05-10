#!/usr/bin/env node
// 机械化批量替换 src/docs/zh/*.mdx 中“100% 确定性”的英文短语。
// 严格规则：只做整段/整句替换，绝不在结果里残留英文捕获组。
// 运行：node scripts/zh-mechanical-translate.mjs

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ZH_DIR = join(__dirname, "..", "src", "docs", "zh");

// 已经手工完整翻译过、本脚本应跳过的文件
const SKIP = new Set([
  "styling-with-utility-classes.mdx",
  "responsive-design.mdx",
  "adding-custom-styles.mdx",
  "colors.mdx",
  "theme.mdx",
  "functions-and-directives.mdx",
  "detecting-classes-in-source-files.mdx",
  "preflight.mdx",
  "compatibility.mdx",
  "dark-mode.mdx",
  "editor-setup.mdx",
  "accent-color.mdx",
]);

// 顺序很重要：长串先替换，避免被短串提前替换破坏。
const REPLACEMENTS = [
  // —— 顶级标题 ——
  ["## Examples", "## 示例"],
  ["## Customizing your theme", "## 自定义主题"],

  // —— 二级（### Basic / Custom value / Responsive design）——
  ["### Basic example", "### 基本用法"],
  ["### Using a custom value", "### 使用自定义值"],
  ["### Responsive design", "### 响应式设计"],

  // —— 二级（### Applying on hover/focus/...）——
  ["### Applying on hover", "### 应用于 hover 状态"],
  ["### Applying on focus", "### 应用于 focus 状态"],
  ["### Applying on focus-within", "### 应用于 focus-within 状态"],
  ["### Applying on focus-visible", "### 应用于 focus-visible 状态"],
  ["### Applying on active", "### 应用于 active 状态"],
  ["### Applying on visited", "### 应用于 visited 状态"],
  ["### Applying on target", "### 应用于 target 状态"],
  ["### Applying on first-child", "### 应用于第一个子元素"],
  ["### Applying on last-child", "### 应用于最后一个子元素"],
  ["### Applying on only-child", "### 应用于唯一子元素"],
  ["### Applying on odd children", "### 应用于奇数子元素"],
  ["### Applying on even children", "### 应用于偶数子元素"],
  ["### Applying on first-of-type", "### 应用于同类型第一个元素"],
  ["### Applying on last-of-type", "### 应用于同类型最后一个元素"],
  ["### Applying on empty elements", "### 应用于空元素"],
  ["### Applying on disabled state", "### 应用于禁用状态"],
  ["### Applying on enabled state", "### 应用于启用状态"],
  ["### Applying on checked state", "### 应用于选中状态"],
  ["### Applying on indeterminate state", "### 应用于不定状态"],
  ["### Applying on default state", "### 应用于默认状态"],
  ["### Applying on optional fields", "### 应用于可选字段"],
  ["### Applying on required fields", "### 应用于必填字段"],
  ["### Applying on valid fields", "### 应用于校验通过字段"],
  ["### Applying on invalid fields", "### 应用于校验失败字段"],
  ["### Applying on placeholder", "### 应用于 placeholder"],
  ["### Applying on read-only state", "### 应用于只读状态"],
  ["### Applying in dark mode", "### 应用于深色模式"],
  ["### Applying conditionally", "### 条件应用"],

  // —— 内容样式相关二级 ——
  ["### Setting the accent color", "### 设置强调色（accent color）"],
  ["### Removing the accent color", "### 移除强调色"],
  ["### Removing the background", "### 移除背景"],
  ["### Setting the opacity", "### 设置不透明度"],
  ["### Changing the opacity", "### 修改不透明度"],

  // —— 间距相关常用二级 ——
  ["### Adding horizontal padding", "### 设置水平 padding"],
  ["### Adding vertical padding", "### 设置垂直 padding"],
  ["### Adding padding to one side", "### 设置某一侧的 padding"],
  ["### Adding margin to one side", "### 设置某一侧的 margin"],
  ["### Adding horizontal margin", "### 设置水平 margin"],
  ["### Adding vertical margin", "### 设置垂直 margin"],
  ["### Using negative values", "### 使用负值"],
  ["### Using logical properties", "### 使用逻辑属性"],
  ["### Centering elements", "### 居中元素"],
  ["### Using fractions", "### 使用分数值"],
  ["### Using a percentage", "### 使用百分比"],
  ["### Using auto", "### 使用 auto"],
  ["### Setting a fixed width", "### 设置固定宽度"],
  ["### Setting a fixed height", "### 设置固定高度"],
  ["### Removing space between children", "### 取消子元素之间的间距"],

  // —— 提示框常见整句 ——
  ["Don't use props to build class names dynamically", "不要用 props 动态拼接类名"],
  ["Always map props to static class names", "始终把 props 映射到静态类名"],
  ["Don't construct class names dynamically", "不要动态拼接类名"],
  ["Always use complete class names", "始终使用完整的类名"],

  // —— 通用动作类 H3 ——
  ["### Removing a border", "### 移除边框"],
  ["### Setting the divider style", "### 设置分隔线样式"],
  ["### Removing a perspective", "### 移除 perspective"],
  ["### Removing filters", "### 移除滤镜"],
  ["### Removing a text shadow", "### 移除文字阴影"],
  ["### Customizing text shadows", "### 自定义文字阴影"],
  ["### Customizing shadow colors", "### 自定义阴影颜色"],
  ["### Setting the shadow color", "### 设置阴影颜色"],
  ["### Supporting reduced motion", "### 适配减少动效偏好"],
  ["### Using the current color", "### 使用当前颜色"],
  ["### Using the spacing scale", "### 使用 spacing 比例尺"],
  ["### Using the container scale", "### 使用 container 比例尺"],
  ["### Using the default size", "### 使用默认尺寸"],
  ["### Using the original size", "### 使用原始尺寸"],
  ["### Using fixed column widths", "### 使用固定列宽"],
  ["### Using arbitrary variants", "### 使用任意变体"],
  ["### Registering a custom variant", "### 注册自定义变体"],
  ["### Quick reference", "### 快速参考"],
  ["### Pseudo-class reference", "### 伪类参考"],
  ["### Responsive breakpoints", "### 响应式断点"],
  ["### Data attributes", "### data 属性"],
  ["### Open/closed state", "### 打开/关闭状态"],
  ["### Styling inert elements", "### 设置 inert 元素的样式"],
  ["### Styling direct children", "### 设置直接子元素的样式"],
  ["### Styling all descendants", "### 设置所有后代的样式"],
  ["### Styling based on parent state", "### 根据父元素状态设置样式"],
  ["### Styling based on sibling state", "### 根据兄弟元素状态设置样式"],

  // —— place-self / justify-self / 等通用值 H3 ——
  ["### Auto", "### Auto 自动"],
  ["### Start", "### Start 起始端"],
  ["### Center", "### Center 居中"],
  ["### End", "### End 末端"],
  ["### Stretch", "### Stretch 拉伸"],
  ["### Normal", "### Normal 常规"],
  ["### Break All", "### Break All 任意位置断开"],
  ["### Break Keep", "### Break Keep 保持不断开"],
  ["### Don't wrap", "### 不换行"],
  ["### Wrap normally", "### 常规换行"],
  ["### Wrap reversed", "### 反向换行"],

  // —— display.mdx 各类 ——
  ["### Block and Inline", "### 块级与内联"],
  ["### Flow Root", "### 创建块级格式化上下文"],
  ["### Flex", "### Flex 容器"],
  ["### Inline Flex", "### 内联 Flex 容器"],
  ["### Grid", "### Grid 容器"],
  ["### Inline Grid", "### 内联 Grid 容器"],
  ["### Contents", "### 透传容器"],
  ["### Table", "### 表格"],
  ["### Hidden", "### 隐藏元素"],
  ["### Screen-reader only", "### 仅屏幕阅读器可见"],

  // —— overflow / scrolling H3 ——
  ["### Showing content that overflows", "### 显示溢出的内容"],
  ["### Hiding content that overflows", "### 隐藏溢出的内容"],
  ["### Scrolling if needed", "### 必要时滚动"],
  ["### Scrolling horizontally if needed", "### 必要时水平滚动"],
  ["### Scrolling vertically if needed", "### 必要时垂直滚动"],
  ["### Scrolling horizontally always", "### 始终允许水平滚动"],
  ["### Scrolling vertically always", "### 始终允许垂直滚动"],
  ["### Scrolling in all directions", "### 在所有方向上滚动"],

  // —— overscroll-behavior H3 ——
  ["### Preventing parent overscrolling", "### 阻止父级 overscroll"],
  ["### Preventing overscroll bouncing", "### 阻止 overscroll 回弹"],
  ["### Using the default overscroll behavior", "### 使用默认 overscroll 行为"],

  // —— object-fit / mask-size / background-size H3 ——
  ["### Resizing to cover", "### 缩放到覆盖容器"],
  ["### Containing within", "### 完整放入容器"],
  ["### Stretching to fit", "### 拉伸填满"],
  ["### Scaling down", "### 必要时按比例缩小"],
  ["### Filling the container", "### 填满容器"],
  ["### Filling without cropping", "### 填满但不裁剪"],

  // —— border-width H3 ——
  ["### Individual sides", "### 单独的一侧"],
  ["### Horizontal and vertical sides", "### 水平和垂直方向的边"],
  ["### Between children", "### 子元素之间"],

  // —— background-repeat / mask-repeat H3 ——
  ["### Repeating horizontally", "### 沿水平方向平铺"],
  ["### Repeating vertically", "### 沿垂直方向平铺"],
  ["### Preventing clipping", "### 避免被裁剪"],
  ["### Preventing clipping and gaps", "### 避免被裁剪并消除缝隙"],
  ["### Disabling repeating", "### 禁用平铺"],

  // —— rotate H3 ——
  ["### Rotating in 3D space", "### 在 3D 空间中旋转"],

  // —— scroll-snap-align H3 ——
  ["### Snapping to the center", "### 吸附到中心"],
  ["### Snapping to the start", "### 吸附到起始端"],
  ["### Snapping to the end", "### 吸附到末端"],

  // —— scroll-snap-type H3 ——
  ["### Horizontal scroll snapping", "### 水平方向滚动吸附"],
  ["### Mandatory scroll snapping", "### 强制吸附"],
  ["### Proximity scroll snapping", "### 就近吸附"],

  // —— scroll-snap-stop H3 ——
  ["### Forcing snap position stops", "### 强制必须停在吸附点"],
  ["### Skipping snap position stops", "### 允许跳过吸附点"],

  // —— text-align H3 ——
  ["### Left aligning text", "### 文本左对齐"],
  ["### Right aligning text", "### 文本右对齐"],
  ["### Centering text", "### 文本居中对齐"],
  ["### Justifying text", "### 文本两端对齐"],

  // —— text-transform H3 ——
  ["### Uppercasing text", "### 转换为大写"],
  ["### Lowercasing text", "### 转换为小写"],
  ["### Capitalizing text", "### 首字母大写"],
  ["### Resetting text casing", "### 重置文本大小写"],

  // —— text-wrap H3 ——
  ["### Allowing text to wrap", "### 允许文本换行"],
  ["### Preventing text from wrapping", "### 禁止文本换行"],
  ["### Balanced text wrapping", "### 均衡换行（balance）"],
  ["### Pretty text wrapping", "### 优化换行（pretty）"],

  // —— user-select H3 ——
  ["### Disabling text selection", "### 禁用文本选择"],
  ["### Allowing text selection", "### 允许选择文本"],
  ["### Selecting all text in one click", "### 一键选中全部文本"],

  // —— vertical-align H3 ——
  ["### Aligning to baseline", "### 对齐到基线"],
  ["### Aligning to top", "### 对齐到顶部"],
  ["### Aligning to middle", "### 对齐到中线"],
  ["### Aligning to bottom", "### 对齐到底部"],
  ["### Aligning to parent top", "### 对齐到父字体顶部"],
  ["### Aligning to parent bottom", "### 对齐到父字体底部"],

  // —— animation H3 ——
  ["### Adding a spin animation", "### 添加旋转动画"],
  ["### Adding a ping animation", "### 添加 ping 动画"],
  ["### Adding a pulse animation", "### 添加脉冲动画"],
  ["### Adding a bounce animation", "### 添加弹跳动画"],

  // —— overflow-wrap / word-break H3 ——
  ["### Wrapping mid-word", "### 在单词中部换行"],
  ["### Wrapping anywhere", "### 在任意位置换行"],
  ["### Wrapping normally", "### 常规换行"],

  // —— translate H3 ——
  ["### Translating on the x-axis", "### 沿 x 轴位移"],
  ["### Translating on the y-axis", "### 沿 y 轴位移"],
  ["### Translating on the z-axis", "### 沿 z 轴位移"],

  // —— text-decoration H3 ——
  ["### Underling text", "### 添加下划线"],

  // —— stroke H3 ——
  // 已包含在通用 H3 中

  // —— position H3 ——
  ["### Statically positioning elements", "### 静态定位元素"],
  ["### Relatively positioning elements", "### 相对定位元素"],
  ["### Absolutely positioning elements", "### 绝对定位元素"],
  ["### Fixed positioning elements", "### 固定定位元素"],
  ["### Sticky positioning elements", "### 粘性定位元素"],

  // —— box-sizing H3 ——
  ["### Including borders and padding", "### 包含边框和内边距"],
  ["### Excluding borders and padding", "### 不包含边框和内边距"],

  // —— columns H3 ——
  ["### Setting by number", "### 按列数设置"],
  ["### Setting by width", "### 按宽度设置"],
  ["### Setting the column gap", "### 设置列间距"],

  // —— margin H3 ——
  ["### Adding margin to a single side", "### 设置某一侧的 margin"],
  ["### Adding space between children", "### 在子元素之间添加间距"],

  // —— flex-shrink H3 ——
  ["### Allowing flex items to shrink", "### 允许 flex 子项收缩"],
  ["### Preventing items from shrinking", "### 禁止 flex 子项收缩"],

  // —— table-layout H3 ——
  ["### Sizing columns automatically", "### 自动确定列宽"],

  // —— width / height / inline-size / block-size H3 ——
  ["### Matching the viewport", "### 匹配视口"],
  ["### Matching viewport", "### 匹配视口"],
  ["### Matching dynamic viewport", "### 匹配动态视口"],
  ["### Matching large viewport", "### 匹配 large 视口"],
  ["### Matching small viewport", "### 匹配 small 视口"],
  ["### Resetting the width", "### 重置宽度"],
  ["### Resetting the inline size", "### 重置 inline size"],
  ["### Setting both width and height", "### 同时设置宽度和高度"],

  // —— white-space H3 ——
  ["### No Wrap", "### No Wrap 不换行"],
  ["### Pre Line", "### Pre Line 保留换行"],
  ["### Pre Wrap", "### Pre Wrap 保留换行和空格"],
  ["### Pre", "### Pre 保留全部空白"],
  ["### Break Spaces", "### Break Spaces 行尾空白也换行"],

  // —— text-decoration-line H3 ——
  ["### Adding an overline to text", "### 添加上划线"],
  ["### Adding a line through text", "### 添加删除线"],
  ["### Removing a line from text", "### 移除装饰线"],

  // —— max-width H3 ——
  ["### Using breakpoints container", "### 使用断点 container"],

  // —— flex.mdx 特殊 H3 ——
  ["### Initial", "### Initial 初始值"],
  ["### None", "### None 不参与 flex"],

  // —— flex-basis H3 ——
  ["### Using percentages", "### 使用百分比值"],

  // —— flex-direction H3 ——
  ["### Row", "### 横向（Row）"],
  ["### Row reversed", "### 横向反向（Row reversed）"],
  ["### Column", "### 纵向（Column）"],
  ["### Column reversed", "### 纵向反向（Column reversed）"],

  // —— flex-grow H3 ——
  ["### Allowing items to grow", "### 允许子项放大"],
  ["### Growing items based on factor", "### 按因子设定放大比例"],
  ["### Preventing items from growing", "### 禁止子项放大"],

  // —— grid-template-columns / grid-template-rows H3 ——
  ["### Specifying the grid columns", "### 指定网格列"],
  ["### Specifying the grid rows", "### 指定网格行"],
  ["### Implementing a subgrid", "### 实现 subgrid"],

  // —— grid-column / grid-row H3 ——
  ["### Spanning columns", "### 跨越多列"],
  ["### Spanning rows", "### 跨越多行"],

  // —— gap H3 ——
  ["### Changing row and column gaps independently", "### 分别设置行间距和列间距"],

  // —— order H3 ——
  ["### Explicitly setting a sort order", "### 显式设置排序顺序"],
  ["### Ordering items first or last", "### 把子项放到最前或最后"],

  // —— font-stretch H3 ——
  // 已在 flex-basis 中处理 ### Using percentages

  // —— font-size H3 ——
  ["### Setting the line-height", "### 设置 line-height"],

  // —— font-variant-numeric H3 ——
  ["### Using ordinal glyphs", "### 使用序数标记字形"],
  ["### Using slashed zeroes", "### 使用斜杠零"],
  ["### Using lining figures", "### 使用 lining 数字"],
  ["### Using oldstyle figures", "### 使用 oldstyle 数字"],
  ["### Using proportional figures", "### 使用比例数字"],
  ["### Using tabular figures", "### 使用等宽表格数字"],
  ["### Using diagonal fractions", "### 使用对角分数"],
  ["### Using stacked fractions", "### 使用堆叠分数"],
  ["### Stacking multiple utilities", "### 同时叠加多个工具类"],
  ["### Resetting numeric font variants", "### 重置数字字体变体"],

  // —— filter-drop-shadow H3 ——
  ["### Removing a drop shadow", "### 移除 drop shadow"],
  ["### Customizing drop shadows", "### 自定义 drop shadow"],

  // —— box-shadow H3 ——
  ["### Adding an inset shadow", "### 添加内阴影"],
  ["### Setting the inset shadow color", "### 设置内阴影颜色"],
  ["### Adding a ring", "### 添加 ring"],
  ["### Setting the ring color", "### 设置 ring 颜色"],
  ["### Adding an inset ring", "### 添加 inset ring"],
  ["### Setting the inset ring color", "### 设置 inset ring 颜色"],
  ["### Removing a box shadow", "### 移除阴影"],
  ["### Customizing shadows", "### 自定义阴影"],
  ["### Customizing inset shadows", "### 自定义内阴影"],

  // —— border-color H3 ——
  ["### Divider between children", "### 子元素之间的分隔线颜色"],

  // —— align-self / align-items extras H3 ——
  ["### Baseline", "### Baseline 基线"],
  ["### Last baseline", "### Last baseline 末基线"],
  ["### Space between", "### Space between 等距分布"],
  ["### Space around", "### Space around 周围等距"],
  ["### Space evenly", "### Space evenly 均匀分布"],

  // —— resize H3 ——
  ["### Resizing in all directions", "### 在所有方向上调整大小"],
  ["### Resizing vertically", "### 仅垂直方向调整大小"],
  ["### Resizing horizontally", "### 仅水平方向调整大小"],
  ["### Prevent resizing", "### 禁止调整大小"],

  // —— mix-blend-mode H3 ——
  ["### Isolating blending", "### 隔离混合"],

  // —— scale H3 ——
  ["### Scaling on the x-axis", "### 沿 x 轴缩放"],
  ["### Scaling on the y-axis", "### 沿 y 轴缩放"],

  // —— pointer-events H3 ——
  ["### Ignoring pointer events", "### 忽略指针事件"],
  ["### Restoring pointer events", "### 恢复指针事件"],

  // —— border-radius H3 ——
  ["### Rounding sides separately", "### 单独设置某一侧的圆角"],
  ["### Rounding corners separately", "### 单独设置某一个角的圆角"],
  ["### Creating pill buttons", "### 制作胶囊按钮"],
  ["### Removing the border radius", "### 移除圆角"],

  // —— background-image H3 ——
  ["### Adding a linear gradient", "### 添加线性渐变"],
  ["### Adding a radial gradient", "### 添加径向渐变"],
  ["### Adding a conic gradient", "### 添加锥形渐变"],
  ["### Setting gradient color stops", "### 设置渐变颜色停靠点"],
  ["### Setting gradient stop positions", "### 设置渐变停靠点位置"],
  ["### Changing interpolation mode", "### 修改插值模式"],
  ["### Removing background images", "### 移除背景图"],

  // —— text-overflow H3 ——
  ["### Truncating text", "### 截断文本"],
  ["### Adding an ellipsis", "### 添加省略号"],
  ["### Clipping text", "### 直接裁掉文本"],

  // —— skew H3 ——
  ["### Skewing on the x-axis", "### 沿 x 轴倾斜"],
  ["### Skewing on the y-axis", "### 沿 y 轴倾斜"],

  // —— mask-image H3 ——
  ["### Using an image mask", "### 使用图像蒙版"],
  ["### Masking edges", "### 对边缘做遮罩"],
  ["### Adding an angled linear mask", "### 添加带角度的线性蒙版"],
  ["### Adding a radial mask", "### 添加径向蒙版"],
  ["### Adding a conic mask", "### 添加锥形蒙版"],
  ["### Combining masks", "### 组合多个蒙版"],
  ["### Removing mask images", "### 移除蒙版图像"],

  // —— outline-style H3 ——
  ["### Hiding an outline", "### 隐藏 outline"],
  ["### Removing outlines", "### 移除 outline"],

  // —— visibility H3 ——
  ["### Making elements invisible", "### 让元素隐藏但占位"],
  ["### Collapsing elements", "### 折叠表格行/列"],
  ["### Making elements visible", "### 让元素可见"],

  // —— content H3 ——
  ["### Referencing an attribute value", "### 引用属性值"],
  ["### Using spaces and underscores", "### 使用空格与下划线"],
  ["### Using a CSS variable", "### 使用 CSS 变量"],

  // —— float H3 ——
  ["### Floating elements to the right", "### 元素右浮动"],
  ["### Floating elements to the left", "### 元素左浮动"],
  ["### Disabling a float", "### 取消浮动"],

  // —— caption-side H3 ——
  ["### Placing at top of table", "### 放在表格顶部"],
  ["### Placing at bottom of table", "### 放在表格底部"],

  // —— appearance H3 ——
  ["### Removing default appearance", "### 移除默认外观"],
  ["### Restoring default appearance", "### 恢复默认外观"],

  // —— border-collapse H3 ——
  ["### Collapsing table borders", "### 合并表格边框"],
  ["### Separating table borders", "### 分离表格边框"],

  // —— line-clamp H3 ——
  ["### Undoing line clamping", "### 取消行数限制"],

  // —— line-height H3 ——
  ["### Setting independently", "### 单独设置 line-height"],
  ["### Removing the leading", "### 去掉行距"],

  // —— forced-color-adjust H3 ——
  ["### Opting out of forced colors", "### 退出强制配色"],
  ["### Restoring forced colors", "### 恢复强制配色"],

  // —— clear H3 ——
  ["### Clearing left", "### 清除左浮动"],
  ["### Clearing right", "### 清除右浮动"],
  ["### Clearing all", "### 清除所有浮动"],
  ["### Disabling clears", "### 取消 clear"],

  // —— background-attachment H3 ——
  ["### Fixing the background image", "### 固定背景图"],
  ["### Scrolling with the container", "### 跟随容器滚动"],
  ["### Scrolling with the viewport", "### 跟随视口滚动"],

  // —— aspect-ratio H3 ——
  ["### Using a video aspect ratio", "### 使用视频宽高比"],

  // —— hyphens H3 ——
  ["### Preventing hyphenation", "### 禁止使用连字符断词"],
  ["### Manual hyphenation", "### 手动连字符断词"],

  // —— upgrade-guide H3 (大量) ——
  ["### Using PostCSS", "### 使用 PostCSS"],
  ["### Using Vite", "### 使用 Vite"],
  ["### Using Tailwind CLI", "### 使用 Tailwind CLI"],
  ["### Browser requirements", "### 浏览器要求"],
  ["### Removed @tailwind directives", "### 移除的 @tailwind 指令"],
  ["### Removed deprecated utilities", "### 移除的已弃用工具类"],
  ["### Renamed utilities", "### 重命名的工具类"],
  ["### Space-between selector", "### space-between 选择器"],
  ["### Divide selector", "### divide 选择器"],
  ["### Using variants with gradients", "### 在渐变上使用变体"],
  ["### Container configuration", "### container 配置"],
  ["### Default border color", "### 默认边框颜色"],
  ["### Default ring width and color", "### 默认 ring 宽度和颜色"],
  ["### Preflight changes", "### Preflight 变化"],
  ["### Using a prefix", "### 使用前缀"],
  ["### The important modifier", "### important 修饰符"],
  ["### Adding custom utilities", "### 添加自定义工具类"],
  ["### Variant stacking order", "### 变体堆叠顺序"],
  ["### Variables in arbitrary values", "### 任意值中的 CSS 变量"],
  ["### Arbitrary values in grid and object-position utilities", "### grid 与 object-position 工具类中的任意值"],
  ["### Hover styles on mobile", "### 移动端的 hover 样式"],
  ["### Transitioning outline-color", "### 过渡 outline-color"],
  ["### Individual transform properties", "### 单独的 transform 属性"],
  ["### Disabling core plugins", "### 禁用核心插件"],
  ["### Using the theme() function", "### 使用 theme() 函数"],
  ["### Using a JavaScript config file", "### 使用 JavaScript 配置文件"],
  ["### Theme values in JavaScript", "### 在 JavaScript 中读取主题值"],
  ["### Using @apply with Vue, Svelte, or CSS modules", "### 在 Vue、Svelte 或 CSS modules 中使用 @apply"],
  ["### Using Sass, Less, and Stylus", "### 使用 Sass、Less 和 Stylus"],

  // —— functions-and-directives H3 ——
  ["### Subpath imports", "### 子路径导入"],
];

function processFile(file) {
  const path = join(ZH_DIR, file);
  let content = readFileSync(path, "utf8");
  const original = content;
  for (const [from, to] of REPLACEMENTS) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
    }
  }
  if (content !== original) {
    writeFileSync(path, content, "utf8");
    return true;
  }
  return false;
}

const files = readdirSync(ZH_DIR).filter(
  (f) => f.endsWith(".mdx") && !SKIP.has(f) && statSync(join(ZH_DIR, f)).isFile(),
);
let changed = 0;
for (const f of files) {
  if (processFile(f)) changed++;
}
console.log(`processed ${files.length} files; updated ${changed}.`);
