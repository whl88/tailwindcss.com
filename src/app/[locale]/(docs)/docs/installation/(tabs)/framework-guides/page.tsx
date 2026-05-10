import { type Guide, loadGuides } from "@/app/[locale]/(docs)/docs/installation/framework-guides";
import { Cta } from "@/components/cta";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { withLocalePrefix } from "@/lib/docs-url";
import { Link } from "@/i18n/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }
  const locale = localeParam as AppLocale;
  const docPath = withLocalePrefix(locale, "/docs/installation/framework-guides");
  const canonical = `https://tailwindcss.com${docPath}`;

  if (locale === "zh") {
    return {
      title: "框架指南",
      description:
        "面向具体框架的安装指南，涵盖我们在多种常用环境中推荐使用 Tailwind CSS 的方式。",
      openGraph: {
        type: "article",
        title: "框架指南",
        description: "在各主流框架中安装 Tailwind CSS 的推荐做法。",
        images: [`https://tailwindcss.com/api/og?path=${encodeURIComponent(docPath)}`],
        url: canonical,
      },
    };
  }

  return {
    title: "Framework guides",
    description:
      "Framework-specific guides that cover our recommended approach to installing Tailwind CSS in a number of popular environments.",
    openGraph: {
      type: "article",
      title: "Framework guides",
      description: "Our recommended approach to installing Tailwind CSS in popular frameworks.",
      images: [`https://tailwindcss.com/api/og?path=${encodeURIComponent(docPath)}`],
      url: canonical,
    },
  };
}

export default async function FrameworkGuides({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  let guides = await loadGuides();
  const zh = locale === "zh";
  const tFg = zh ? await getTranslations("InstallationFrameworkGuides") : null;

  const hrefCli = withLocalePrefix(locale, "/docs/installation/tailwind-cli");
  const hrefVite = withLocalePrefix(locale, "/docs/installation/using-vite");
  const hrefPostcss = withLocalePrefix(locale, "/docs/installation/using-postcss");

  return (
    <>
      <div id="content-wrapper" className="prose mb-10 max-w-3xl" data-content="true">
        <h3 className="sr-only" data-title="true">
          {zh ? tFg!("srTitle") : "Framework Guides"}
        </h3>
        <p>
          {zh ? (
            tFg!("intro")
          ) : (
            <>
              Framework-specific guides that cover our recommended approach to installing Tailwind CSS in a number of
              popular environments.
            </>
          )}
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {guides.map((guide, idx) => (
          <GuideTile
            key={idx}
            guide={guide}
            locale={locale}
            description={zh ? tFg!(`tiles.${guide.slug}`) : guide.tile.description}
          />
        ))}
      </ul>
      <div className="my-4 md:my-16">
        <Cta>
          {zh ? (
            <>
              没在列表里看到你的框架？可以尝试使用{" "}
              <Link href={hrefCli} className="underline">
                Tailwind CLI
              </Link>
              、
              <Link href={hrefVite} className="underline">
                Vite 插件
              </Link>
              ，或{" "}
              <Link href={hrefPostcss} className="underline">
                PostCSS 插件
              </Link>
              。
            </>
          ) : (
            <>
              Don&apos;t see your framework of choice? Try using the{" "}
              <Link href={hrefCli} className="underline">
                Tailwind CLI
              </Link>
              , the{" "}
              <Link href={hrefVite} className="underline">
                Vite plugin
              </Link>
              , or the{" "}
              <Link href={hrefPostcss} className="underline">
                PostCSS plugin
              </Link>{" "}
              instead.
            </>
          )}
        </Cta>
      </div>
    </>
  );
}

function GuideTile({
  guide,
  locale,
  description,
}: {
  guide: Guide;
  locale: AppLocale;
  description: string;
}) {
  const { Logo, LogoDark } = guide.tile;

  return (
    <li className="relative flex flex-row-reverse">
      <div className="peer group ml-6 flex-auto">
        <h4 className="mb-2 leading-6 font-semibold text-slate-900 dark:text-slate-200">
          <Link
            href={
              guide.tabs
                ? withLocalePrefix(locale, `/docs/installation/framework-guides/${guide.slug}/${guide.tabs[0].slug}`)
                : withLocalePrefix(locale, `/docs/installation/framework-guides/${guide.slug}`)
            }
            className="before:absolute before:-inset-3 before:rounded-2xl"
          >
            {guide.tile.title}
            <svg
              viewBox="0 0 3 6"
              className="-mt-px ml-3 inline h-1.5 w-auto overflow-visible text-slate-400 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
            >
              <path
                d="M0 0L3 3L0 6"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </h4>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-400">{description}</p>
      </div>
      <div className="dark:highlight-white/5 flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-full bg-white shadow ring-1 ring-slate-900/5 dark:bg-slate-800">
        {LogoDark ? (
          <>
            <Logo className="block dark:hidden" />
            <LogoDark className="hidden dark:block" />
          </>
        ) : (
          <Logo className="block" />
        )}
      </div>
      <div className="absolute -inset-3 -z-10 rounded-2xl bg-slate-50 opacity-0 peer-hover:opacity-100 dark:bg-slate-800/50" />
    </li>
  );
}
