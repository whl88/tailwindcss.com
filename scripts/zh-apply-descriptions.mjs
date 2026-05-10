#!/usr/bin/env node
// 把 zh-descriptions.mjs 中的中文 description 写回 src/docs/zh/*.mdx 的 frontmatter。
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DESCRIPTIONS } from "./zh-descriptions.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ZH_DIR = join(__dirname, "..", "src", "docs", "zh");

const files = readdirSync(ZH_DIR).filter(
  (f) => f.endsWith(".mdx") && statSync(join(ZH_DIR, f)).isFile(),
);

let updated = 0;
let missing = [];
for (const f of files) {
  const path = join(ZH_DIR, f);
  let content = readFileSync(path, "utf8");
  const zh = DESCRIPTIONS[f];
  if (!zh) {
    missing.push(f);
    continue;
  }
  // 支持单行和换行后字符串两种 frontmatter 形态。
  const reSingle = /^export const description = "([^"]*)";[ \t]*$/m;
  const reMulti = /^export const description =\n[ \t]*"([^"]*)";[ \t]*$/m;
  const m1 = content.match(reSingle);
  const m2 = m1 ? null : content.match(reMulti);
  if (!m1 && !m2) continue;
  const current = (m1 || m2)[1];
  if (current === zh) continue;
  if (m1) content = content.replace(reSingle, `export const description = "${zh}";`);
  else content = content.replace(reMulti, `export const description = "${zh}";`);
  writeFileSync(path, content, "utf8");
  updated++;
}
console.log(`processed ${files.length} files; updated ${updated}.`);
if (missing.length) console.log(`missing translations for: ${missing.join(", ")}`);
