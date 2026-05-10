import docsNavEn from "@/app/[locale]/(docs)/docs/index";
import docsNavZh from "@/app/[locale]/(docs)/docs/index.zh";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

function flatNav(locale: AppLocale) {
  let index = (locale === "zh" ? docsNavZh : docsNavEn) as typeof docsNavEn;
  return Object.values(index).flatMap((e) => e.flatMap((e) => [e, ...(Array.isArray(e[2]) ? e[2] : [])]));
}

export default function Pagination({ slug, locale }: { slug: string; locale: AppLocale }) {
  let flatIndex = flatNav(locale);
  let position = flatIndex.findIndex(([_, path]) => path === `/docs/${slug}`);
  if (position === -1) return null;

  let prev = position > 0 ? flatIndex[position - 1] : null;
  let next = position < flatIndex.length - 1 ? flatIndex[position + 1] : null;

  return (
    <footer className="mt-16 text-sm leading-6">
      <div className="flex items-center justify-between gap-2 text-gray-700 dark:text-gray-200">
        {prev ? (
          <Link className="group flex items-center gap-2 hover:text-gray-900 dark:hover:text-white" href={prev[1]}>
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path
                fillRule="evenodd"
                d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>

            <span>{prev[0]}</span>
          </Link>
        ) : null}

        {next ? (
          <Link className="group flex items-center gap-2 hover:text-gray-900 dark:hover:text-white" href={next[1]}>
            <span>{next[0]}</span>
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path
                fillRule="evenodd"
                d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        ) : null}
      </div>
    </footer>
  );
}
