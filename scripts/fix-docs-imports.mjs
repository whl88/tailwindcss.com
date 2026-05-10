import fs from "node:fs";
import path from "node:path";

function fixLine(line) {
  let out = line;
  if (out.startsWith("import ") && out.includes(" from ")) {
    out = out.replaceAll('from "../components/', 'from "@/components/');
    out = out.replaceAll("from '../components/", "from '@/components/");
    out = out.replaceAll('from "./utils/', 'from "@/docs/utils/');
    out = out.replaceAll("from './utils/", "from '@/docs/utils/");
    out = out.replaceAll('from "./img/', 'from "../img/');
    out = out.replaceAll("from './img/", "from '../img/");
  }
  out = out.replaceAll('require("./img/', 'require("../img/');
  return out;
}

for (const locale of ["en", "zh"]) {
  let dir = path.join("src", "docs", locale);
  for (let f of fs.readdirSync(dir)) {
    if (!f.endsWith(".mdx")) continue;
    let p = path.join(dir, f);
    let raw = fs.readFileSync(p, "utf8");
    fs.writeFileSync(
      p,
      raw
        .split("\n")
        .map((line) => fixLine(line))
        .join("\n"),
    );
  }
}
