import { Breadcrumb } from "@/components/breadcrumb";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getDocPageSlugs, getSectionAndTitleBySlug } from "../../../docs/api";

type Params = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getDocPageSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export default async function DocsTitle(props: Params) {
  const params = await props.params;
  if (!hasLocale(routing.locales, params.locale)) {
    notFound();
  }
  const locale = params.locale as AppLocale;
  setRequestLocale(locale);
  const sectionAndTitle = getSectionAndTitleBySlug(params.slug, locale);
  if (!sectionAndTitle) return null;

  return <Breadcrumb section={sectionAndTitle.section} title={sectionAndTitle.title} />;
}
