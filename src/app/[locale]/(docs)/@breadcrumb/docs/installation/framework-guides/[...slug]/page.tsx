import { loadGuide, loadGuides } from "@/app/[locale]/(docs)/docs/installation/framework-guides";
import { Breadcrumb } from "@/components/breadcrumb";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

type Params = Promise<{
  locale: string;
  slug: string[];
}>;

export async function generateStaticParams() {
  const guides = await loadGuides();
  const slugParams = guides.flatMap(({ slug, tabs = [] }) => [
    { slug: [slug] },
    ...tabs.map((tab) => ({
      slug: [slug, tab.slug],
    })),
  ]);
  return routing.locales.flatMap((locale) => slugParams.map((p) => ({ locale, ...p })));
}

export default async function Page({ params }: { params: Params }) {
  const { locale: localeParam, slug: parts } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  if (!parts) return notFound();

  const [slug] = parts.filter((part) => part.trim() !== "");

  const guide = await loadGuide(slug);
  if (!guide) return notFound();

  return (
    <Breadcrumb section={locale === "zh" ? "安装" : "Installation"} title={guide.page.title} />
  );
}
