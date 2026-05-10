import * as fs from "node:fs/promises";
import * as path from "node:path";
import TableOfContents from "@/components/table-of-contents";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { generateTableOfContentsFromMarkdown } from "../docs/api";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Brand",
  description: "Tailwind CSS brand assets and usage guidelines.",
  openGraph: {
    type: "article",
    title: "Brand",
    description: "Tailwind CSS brand assets and usage guidelines.",
    images: "https://tailwindcss.com/api/og?path=/brand",
    url: "https://tailwindcss.com/brand",
  },
};

export default async function DocPage({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const post = (await import("./page.mdx")) as unknown as {
    title: string;
    description: string;
  };

  const markdown = await fs.readFile(
    path.join(process.cwd(), "./src/app/[locale]/(docs)/brand/page.mdx"),
    "utf8",
  );

  const tableOfContents = await generateTableOfContentsFromMarkdown(markdown, locale);

  return (
    <>
      {/* Add a placeholder div so the Next.js router can find the scrollable element. */}
      <div hidden />

      <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]">
        <div className="px-4 pt-10 pb-24 sm:px-6 xl:pr-0">
          <h1 data-title="true" className="mt-2 text-3xl font-medium tracking-tight text-gray-950 dark:text-white">
            {post.title}
          </h1>
          <p data-description="true" className="mt-6 text-base/7 text-gray-700 dark:text-gray-400">
            {post.description}
          </p>

          <div className="prose mt-10" data-content="true">
            {children}
          </div>
        </div>
        <div className="max-xl:hidden">
          <div className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-x-hidden px-6 pt-10 pb-24">
            <TableOfContents tableOfContents={tableOfContents} />
          </div>
        </div>
      </div>
    </>
  );
}
