import type { AppLocale } from "@/i18n/routing";

/** User-facing path for a docs MDX slug (no trailing slash). */
export function docsPathForSlug(locale: AppLocale, slug: string): string {
  return locale === "zh" ? `/docs/${slug}` : `/en/docs/${slug}`;
}

/** Prefix pathname with `/en` when locale is English (default locale omits prefix). */
export function withLocalePrefix(locale: AppLocale, pathname: string): string {
  if (!pathname.startsWith("/")) {
    return pathname;
  }
  return locale === "zh" ? pathname : `/en${pathname}`;
}
