import { Breadcrumb } from "@/components/breadcrumb";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }
  const locale = localeParam as AppLocale;

  if (locale === "zh") {
    return <Breadcrumb section="安装" title="使用 Vite" />;
  }
  return <Breadcrumb section="Getting Started" title="Using Vite" />;
}
