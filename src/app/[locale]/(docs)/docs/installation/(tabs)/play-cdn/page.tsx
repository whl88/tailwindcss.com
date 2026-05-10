import { Metadata } from "next";
import { notFound } from "next/navigation";
import dedent from "dedent";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Steps, type Step } from "@/components/installation-steps";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { withLocalePrefix } from "@/lib/docs-url";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }
  const locale = localeParam as AppLocale;
  const docPath = withLocalePrefix(locale, "/docs/installation/play-cdn");
  const canonical = `https://tailwindcss.com${docPath}`;

  if (locale === "zh") {
    return {
      title: "Play CDN",
      description: "借助 Play CDN 在浏览器里直接试用 Tailwind，无需任何构建步骤。",
      openGraph: {
        type: "article",
        title: "Play CDN",
        description: "零构建步骤，在浏览器中快速体验 Tailwind CSS。",
        images: [`https://tailwindcss.com/api/og?path=${encodeURIComponent(docPath)}`],
        url: canonical,
      },
    };
  }

  return {
    title: "Play CDN",
    description: "Use the Play CDN to try Tailwind right in the browser without any build step.",
    openGraph: {
      type: "article",
      title: "Play CDN",
      description: "Try Tailwind CSS right in the browser without any build step.",
      images: [`https://tailwindcss.com/api/og?path=${encodeURIComponent(docPath)}`],
      url: canonical,
    },
  };
}

function getSteps(locale: AppLocale): Step[] {
  const zh = locale === "zh";

  return [
    {
      title: zh ? "在 HTML 中加入 Play CDN 脚本" : "Add the Play CDN script to your HTML",
      body: (
        <p>
          {zh ? (
            <>
              在 HTML 的 <code>{"<head>"}</code> 中引入 Play CDN 的 <code>&lt;script&gt;</code>，即可开始使用 Tailwind
              的工具类。
            </>
          ) : (
            <>
              Add the Play CDN script tag to the <code>&lt;head&gt;</code> of your HTML file, and start using Tailwind’s
              utility classes to style your content.
            </>
          )}
        </p>
      ),
      code: {
        name: "index.html",
        lang: "html",
        code: dedent`
          <!doctype html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <!-- [!code highlight:2] -->
              <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            </head>
            <body>
              <!-- [!code highlight:4] -->
              <h1 class="text-3xl font-bold underline">
                Hello world!
              </h1>
            </body>
          </html>
        `,
      },
    },
    {
      title: zh ? "尝试编写自定义 CSS" : "Try adding some custom CSS",
      body: (
        <p>
          {zh ? (
            <>
              使用 <code>type=&quot;text/tailwindcss&quot;</code> 添加自定义 CSS，并可使用 Tailwind 提供的全部 CSS
              能力。
            </>
          ) : (
            <>
              Use <code>type=&quot;text/tailwindcss&quot;</code> to add custom CSS that supports all of Tailwind&apos;s
              CSS features.
            </>
          )}
        </p>
      ),
      code: {
        name: "index.html",
        lang: "html",
        code: dedent`
          <!doctype html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
              <!-- [!code highlight:6] -->
              <style type="text/tailwindcss">
                @theme {
                  --color-clifford: #da373d;
                }
              </style>
            </head>
            <body>
              <!-- [!code word:text-clifford] -->
              <h1 class="text-3xl font-bold underline text-clifford">
                Hello world!
              </h1>
            </body>
          </html>
        `,
      },
    },
  ];
}

export default async function Page({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);
  const zh = locale === "zh";
  const steps = getSteps(locale);

  return (
    <>
      <div id="content-wrapper" className="prose relative z-10 mb-10 max-w-3xl" data-content="true">
        <h3 className="sr-only" data-title="true">
          {zh ? "使用 Play CDN" : "Using Play CDN"}
        </h3>
        <p>
          {zh ? (
            <>
              借助 Play CDN，可以在不写构建步骤的情况下直接在浏览器里试用 Tailwind。Play CDN<strong>仅供开发试用</strong>
              ，不建议用于生产环境。
            </>
          ) : (
            <>
              Use the Play CDN to try Tailwind right in the browser without any build step. The Play CDN is designed for
              development purposes only, and is not intended for production.
            </>
          )}
        </p>
      </div>
      <Steps steps={steps} />
    </>
  );
}
