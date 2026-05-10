import type { AppLocale } from "@/i18n/routing";
import docsNavEn from "./index";
import docsNavZh from "./index.zh";

export function getDocsNav(locale: AppLocale) {
  return locale === "zh" ? docsNavZh : docsNavEn;
}

export type DocsNav = ReturnType<typeof getDocsNav>;
