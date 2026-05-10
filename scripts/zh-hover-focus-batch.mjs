#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PATH = join(__dirname, "..", "src", "docs", "zh", "hover-focus-and-other-states.mdx");

// 长串优先
const REPLACEMENTS = [
  [
    "This is a comprehensive list of examples for all the pseudo-class variants included in Tailwind to complement the [pseudo-classes documentation](/docs/hover-focus-and-other-states#pseudo-classes) at the beginning of this guide.",
    "以下是 Tailwind 中全部伪类变体的示例汇总，可与本指南开头的[伪类文档](/docs/hover-focus-and-other-states#pseudo-classes)对照阅读。",
  ],
  [
    "Style an element when the user hovers over it with the mouse cursor using the `hover` variant:",
    "使用 `hover` 变体，在鼠标悬停时应用样式：",
  ],
  ["Style an element when it has focus using the `focus` variant:", "使用 `focus` 变体，在元素获得焦点时应用样式："],
  [
    "Style an element when it or one of its descendants has focus using the `focus-within` variant:",
    "使用 `focus-within` 变体，在元素自身或其子元素有焦点时应用样式：",
  ],
  [
    "Style an element when it has been focused using the keyboard using the `focus-visible` variant:",
    "使用 `focus-visible` 变体，在通过键盘获得焦点时应用样式：",
  ],
  ["Style an element when it is being pressed using the `active` variant:", "使用 `active` 变体，在按下（激活）元素时应用样式："],
  ["Style a link when it has already been visited using the `visited` variant:", "使用 `visited` 变体，在链接已访问过时应用样式："],
  [
    "Style an element if its ID matches the current URL fragment using the `target` variant:",
    "使用 `target` 变体，当元素 ID 与当前 URL 片段匹配时应用样式：",
  ],
  ["Style an element if it's the first child using the `first` variant:", "使用 `first` 变体，当元素是第一个子元素时应用样式："],
  ["Style an element if it's the last child using the `last` variant:", "使用 `last` 变体，当元素是最后一个子元素时应用样式："],
  ["Style an element if it's the only child using the `only` variant:", "使用 `only` 变体，当元素是唯一子元素时应用样式："],
  ["Style an element if it's an oddly numbered child using the `odd` variant:", "使用 `odd` 变体，当元素是奇数位子元素时应用样式："],
  ["Style an element if it's an evenly numbered child using the `even` variant:", "使用 `even` 变体，当元素是偶数位子元素时应用样式："],
  [
    "Style an element if it's the first child of its type using the `first-of-type` variant:",
    "使用 `first-of-type` 变体，当元素是同类型中的第一个时应用样式：",
  ],
  [
    "Style an element if it's the last child of its type using the `last-of-type` variant:",
    "使用 `last-of-type` 变体，当元素是同类型中的最后一个时应用样式：",
  ],
  [
    "Style an element if it's the only child of its type using the `only-of-type` variant:",
    "使用 `only-of-type` 变体，当元素是同类型中的唯一一个时应用样式：",
  ],
  [
    "Style an element at a specific position using the `nth` variant:",
    "使用 `nth` 变体，在指定序号位置应用样式：",
  ],
  [
    "Style an element at a specific position from the end using the `nth-last` variant:",
    "使用 `nth-last` 变体，从末尾计数在指定序号位置应用样式：",
  ],
  [
    "Style an element at a specific position, of the same type using the `nth-of-type` variant:",
    "使用 `nth-of-type` 变体，在同类型子元素中的指定序号位置应用样式：",
  ],
  [
    "Style an element at a specific position from the end, of the same type using the `nth-last-of-type` variant:",
    "使用 `nth-last-of-type` 变体，从末尾计数在同类型子元素中指定序号位置应用样式：",
  ],
  ["Style an element if it has no content using the `empty` variant:", "使用 `empty` 变体，当元素为空时应用样式："],
  ["Style an input when it's disabled using the `disabled` variant:", "使用 `disabled` 变体，在输入控件禁用时应用样式："],
  [
    "Style an input when it's enabled using the `enabled` variant, most helpful when you only want to apply another style when an element is not disabled:",
    "使用 `enabled` 变体，在输入控件可用时应用样式；适合只想在「非禁用」时才叠加其它样式的情况：",
  ],
  [
    "Style a checkbox or radio button when it's checked using the `checked` variant:",
    "使用 `checked` 变体，在复选框或单选按钮被选中时应用样式：",
  ],
  [
    "Style a checkbox or radio button in an indeterminate state using the `indeterminate` variant:",
    "使用 `indeterminate` 变体，在复选框或单选按钮处于不定状态时应用样式：",
  ],
  [
    "Style an option, checkbox or radio button that was the default value when the page initially loaded using the `default` variant:",
    "使用 `default` 变体，在页面初始加载时作为默认选中的选项/复选框/单选按钮上应用样式：",
  ],
  ["Style an input when it's optional using the `optional` variant:", "使用 `optional` 变体，在输入为可选时应用样式："],
  ["Style an input when it's required using the `required` variant:", "使用 `required` 变体，在输入为必填时应用样式："],
  ["Style an input when it's valid using the `valid` variant:", "使用 `valid` 变体，在输入校验通过时应用样式："],
  ["Style an input when it's invalid using the `invalid` variant:", "使用 `invalid` 变体，在输入校验失败时应用样式："],
  [
    "Style an input when it's valid and the user has interacted with it, using the `user-valid` variant:",
    "使用 `user-valid` 变体，在输入有效且用户已与之交互时应用样式：",
  ],
  [
    "Style an input when it's invalid and the user has interacted with it, using the `user-invalid` variant:",
    "使用 `user-invalid` 变体，在输入无效且用户已与之交互时应用样式：",
  ],
  [
    "Style an input when its value is within a specified range limit using the `in-range` variant:",
    "使用 `in-range` 变体，在输入值处于指定范围内时应用样式：",
  ],
  [
    "Style an input when its value is outside of a specified range limit using the `out-of-range` variant:",
    "使用 `out-of-range` 变体，在输入值超出指定范围时应用样式：",
  ],
  [
    "Style an input when the placeholder is shown using the `placeholder-shown` variant:",
    "使用 `placeholder-shown` 变体，在显示占位符时应用样式：",
  ],
  [
    "Style the content of a `<details>` element using the `details-content` variant:",
    "使用 `details-content` 变体，为 `<details>` 的内容设置样式：",
  ],
  [
    "Style an input when it has been autofilled by the browser using the `autofill` variant:",
    "使用 `autofill` 变体，在浏览器自动填充时应用样式：",
  ],
  ["Style an input when it is read-only using the `read-only` variant:", "使用 `read-only` 变体，在输入为只读时应用样式："],

  // 正文其它常见句
  [
    "See the [pseudo-class reference](#pseudo-class-reference) for a complete list of available pseudo-class variants.",
    "完整列表见[伪类参考](#pseudo-class-reference)。",
  ],
  [
    "You can also style an element when it's an odd or even child using the `odd` and `even` variants:",
    "使用 `odd` 和 `even` 变体，可以在子元素为奇数位或偶数位时设置样式：",
  ],
  [
    "You can pass any number you want to these by default, and use arbitrary values for more complex expressions like `nth-[2n+1_of_li]`.",
    "默认可向其中传入任意数字，也可使用任意值处理更复杂的表达式，例如 `nth-[2n+1_of_li]`。",
  ],
  [
    "Tailwind also includes variants for other structural pseudo-classes like `:only-child`, `:first-of-type`, `:empty`, and more.",
    "Tailwind 还为 `:only-child`、`:first-of-type`、`:empty` 等其它结构性伪类提供变体。",
  ],
  [
    "Style form elements in different states using variants like `required`, `invalid`, and `disabled`:",
    "使用 `required`、`invalid`、`disabled` 等变体，为表单控件在不同状态下设置样式：",
  ],
  [
    "Tailwind also includes variants for other form states like `:read-only`, `:indeterminate`, `:checked`, and more.",
    "Tailwind 还为 `:read-only`、`:indeterminate`、`:checked` 等其它表单状态提供变体。",
  ],
  [
    "Learn more about adding custom variants in the [adding custom variants documentation](/docs/adding-custom-styles#adding-custom-variants).",
    "更多说明见[添加自定义变体](/docs/adding-custom-styles#adding-custom-variants)文档。",
  ],
];

let s = readFileSync(PATH, "utf8");
let n = 0;
for (const [from, to] of REPLACEMENTS) {
  if (s.includes(from)) {
    s = s.split(from).join(to);
    n++;
  }
}
writeFileSync(PATH, s, "utf8");
console.log(`applied ${n}/${REPLACEMENTS.length} replacement kinds`);
