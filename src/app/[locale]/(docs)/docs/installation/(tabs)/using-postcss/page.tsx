import { Cta } from "@/components/cta";
import { type Step, Steps } from "@/components/installation-steps";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { withLocalePrefix } from "@/lib/docs-url";
import dedent from "dedent";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
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
  const docPath = withLocalePrefix(locale, "/docs/installation/using-postcss");
  const canonical = `https://tailwindcss.com${docPath}`;

  if (locale === "zh") {
    return {
      title: "使用 PostCSS 安装 Tailwind CSS",
      description:
        "将 Tailwind CSS 作为 PostCSS 插件接入，是与 Next.js、Angular 等框架配合最顺畅的方式。",
      openGraph: {
        type: "article",
        title: "使用 PostCSS 安装",
        description: "将 Tailwind CSS 与 Next.js、Angular 等框架集成。",
        images: [`https://tailwindcss.com/api/og?path=${encodeURIComponent(docPath)}`],
        url: canonical,
      },
    };
  }

  return {
    title: "Installing Tailwind CSS with PostCSS",
    description:
      "Installing Tailwind CSS as a PostCSS plugin is the most seamless way to integrate it with frameworks like Next.js and Angular.",
    openGraph: {
      type: "article",
      title: "Installing with PostCSS",
      description: "Integrate Tailwind CSS with frameworks like Next.js and Angular.",
      images: [`https://tailwindcss.com/api/og?path=${encodeURIComponent(docPath)}`],
      url: canonical,
    },
  };
}

function getSteps(locale: AppLocale): Step[] {
  const zh = locale === "zh";

  return [
    {
      title: zh ? "安装 Tailwind CSS" : "Install Tailwind CSS",
      body: (
        <p>
          {zh ? (
            <>
              使用 npm 安装 <code>tailwindcss</code>、<code>@tailwindcss/postcss</code> 与 <code>postcss</code>。
            </>
          ) : (
            <>
              Install <code>tailwindcss</code>, <code>@tailwindcss/postcss</code>, and <code>postcss</code> via npm.
            </>
          )}
        </p>
      ),
      code: {
        name: zh ? "终端" : "Terminal",
        lang: "shell",
        code: dedent`
          npm install tailwindcss @tailwindcss/postcss postcss
        `,
      },
    },
    {
      title: zh ? "写入 PostCSS 配置" : "Add Tailwind to your PostCSS configuration",
      body: (
        <p>
          {zh ? (
            <>
              在项目的 <code>postcss.config.mjs</code>（或任意 PostCSS 配置文件）中加入插件{" "}
              <code>@tailwindcss/postcss</code>。
            </>
          ) : (
            <>
              Add <code>@tailwindcss/postcss</code> to your <code>postcss.config.mjs</code> file, or wherever PostCSS
              is configured in your project.
            </>
          )}
        </p>
      ),
      code: {
        name: "postcss.config.mjs",
        lang: "js",
        code: dedent`
          export default {
            plugins: {
              // [!code highlight:2]
              "@tailwindcss/postcss": {},
            }
          }
        `,
      },
    },
    {
      title: zh ? "导入 Tailwind CSS" : "Import Tailwind CSS",
      body: (
        <p>
          {zh ? (
            <>
              在样式文件中添加 <code>@import</code>，引入 Tailwind CSS。
            </>
          ) : (
            <>
              Add an <code>@import</code> to your CSS file that imports Tailwind CSS.
            </>
          )}
        </p>
      ),
      code: {
        name: "CSS",
        lang: "css",
        code: dedent`
          @import "tailwindcss";
        `,
      },
    },
    {
      title: zh ? "启动构建流程" : "Start your build process",
      body: (
        <p>
          {zh ? (
            <>
              运行 <code>npm run dev</code>，或执行你在 <code>package.json</code> 里配置的其它开发命令。
            </>
          ) : (
            <>
              Run your build process with <code>npm run dev</code> or whatever command is configured in your{" "}
              <code>package.json</code> file.
            </>
          )}
        </p>
      ),
      code: {
        name: zh ? "终端" : "Terminal",
        lang: "shell",
        code: dedent`
          npm run dev
        `,
      },
    },
    {
      title: zh ? "在 HTML 中使用 Tailwind" : "Start using Tailwind in your HTML",
      body: (
        <p>
          {zh ? (
            <>
              确保编译后的 CSS 已包含在 <code>{"<head>"}</code> 中
              <em>（框架可能会替你处理）</em>
              ，然后就可以用 Tailwind 的工具类来编写样式。
            </>
          ) : (
            <>
              Make sure your compiled CSS is included in the <code>{"<head>"}</code>{" "}
              <em>(your framework might handle this for you)</em>, then start using Tailwind’s utility classes to style
              your content.
            </>
          )}
        </p>
      ),
      code: {
        name: "HTML",
        lang: "html",
        code: dedent`
          <!doctype html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!-- [!code highlight:2] -->
            <link href="/dist/styles.css" rel="stylesheet">
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
        <h3 data-title="true" className="sr-only">
          {zh ? "以 PostCSS 插件方式安装 Tailwind CSS" : "Installing Tailwind CSS as a PostCSS plugin"}
        </h3>
        <p>
          {zh ? (
            <>
              将 Tailwind CSS 作为 PostCSS 插件安装，是与 Next.js、Angular 等框架配合最顺畅的集成方式。
            </>
          ) : (
            <>
              Installing Tailwind CSS as a PostCSS plugin is the most seamless way to integrate it with frameworks like
              Next.js and Angular.
            </>
          )}
        </p>
      </div>
      <Steps steps={steps} />
      <div className="my-4 md:my-16">
        <Cta
          label={zh ? "查看框架指南" : "Explore our framework guides"}
          href={withLocalePrefix(locale, "/docs/installation/framework-guides")}
        >
          <strong className="font-semibold text-gray-950 dark:text-white">
            {zh ? "卡住了？" : "Are you stuck?"}
          </strong>{" "}
          {zh ? (
            <>
              用 PostCSS 接入 Tailwind 的具体步骤会因工具链组合而不同。请查看框架指南，看是否有与您环境匹配的安装说明。
            </>
          ) : (
            <>
              Setting up Tailwind with PostCSS can be a bit different across different build tools. Check our framework
              guides to see if we have more specific instructions for your particular setup.
            </>
          )}
        </Cta>
      </div>
    </>
  );
}
