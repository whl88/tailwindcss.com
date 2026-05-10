import Pagination from "@/components/pagination";
import { RandomPromo } from "@/components/promos";
import TableOfContents from "@/components/table-of-contents";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { docsPathForSlug } from "@/lib/docs-url";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";
import { setRequestLocale } from "next-intl/server";
import { generateTableOfContents, getDocPageBySlug, getDocPageSlugs, getSectionAndTitleBySlug } from "../api";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getDocPageSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  if (!hasLocale(routing.locales, params.locale)) {
    return notFound();
  }
  const locale = params.locale as AppLocale;

  const sectionAndTitle = getSectionAndTitleBySlug(params.slug, locale);
  const post = await getDocPageBySlug(params.slug, locale);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} - ${sectionAndTitle?.section ?? ""}`;
  const canonicalPath = docsPathForSlug(locale, params.slug);

  return {
    metadataBase: new URL("https://tailwindcss.com"),
    title,
    description: post.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        zh: docsPathForSlug("zh", params.slug),
        en: docsPathForSlug("en", params.slug),
        "x-default": docsPathForSlug("zh", params.slug),
      },
    },
    openGraph: {
      title,
      description: post.description,
      type: "article",
      url: canonicalPath,
      images: [{ url: `/api/og?path=${encodeURIComponent(canonicalPath)}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
      images: [{ url: `/api/og?path=${encodeURIComponent(canonicalPath)}` }],
      site: "@tailwindcss",
      creator: "@tailwindcss",
    },
  };
}

export default async function DocPage(props: Props) {
  const params = await props.params;
  if (!hasLocale(routing.locales, params.locale)) {
    notFound();
  }
  const locale = params.locale as AppLocale;
  setRequestLocale(locale);

  const sectionAndTitle = getSectionAndTitleBySlug(params.slug, locale);

  const [post, tableOfContents] = await Promise.all([
    getDocPageBySlug(params.slug, locale),
    generateTableOfContents(params.slug, locale),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Add a placeholder div so the Next.js router can find the scrollable element. */}
      <div hidden />

      <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]">
        <div className="px-4 pt-10 pb-24 sm:px-6 xl:pr-0">
          {sectionAndTitle ? (
            <p
              className="flex items-center gap-2 font-mono text-xs/6 font-medium tracking-widest text-gray-600 uppercase dark:text-gray-400"
              data-section="true"
            >
              {sectionAndTitle.section}
            </p>
          ) : null}
          <h1 data-title="true" className="mt-2 text-3xl font-medium tracking-tight text-gray-950 dark:text-white">
            {post.title}
          </h1>
          <p data-description="true" className="mt-6 text-base/7 text-gray-700 dark:text-gray-400">
            {post.description}
          </p>

          <div className="prose mt-10" data-content="true">
            <post.Component />
          </div>
          <Pagination slug={params.slug} locale={locale} />
        </div>
        <div className="max-xl:hidden">
          <div className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-x-hidden px-6 pt-10 pb-24">
            <TableOfContents tableOfContents={tableOfContents} />
            <RandomPromo />
          </div>
        </div>
      </div>
    </>
  );
}
