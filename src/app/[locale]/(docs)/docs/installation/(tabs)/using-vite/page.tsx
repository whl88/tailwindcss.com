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
  const docPath = withLocalePrefix(locale, "/docs/installation/using-vite");
  const canonical = `https://tailwindcss.com${docPath}`;

  if (locale === "zh") {
    return {
      title: "使用 Vite 安装 Tailwind CSS",
      description:
        "将 Tailwind CSS 作为 Vite 插件集成，是与 Laravel、SvelteKit、React Router、Nuxt、SolidJS 等框架配合最顺畅的方式。",
      openGraph: {
        type: "article",
        title: "使用 Vite 安装",
        description: "将 Tailwind CSS 与 Laravel、SvelteKit、React Router、SolidJS 等框架集成。",
        images: [`https://tailwindcss.com/api/og?path=${encodeURIComponent(docPath)}`],
        url: canonical,
      },
    };
  }

  return {
    title: "Installing Tailwind CSS with Vite",
    description:
      "Installing Tailwind CSS as a Vite plugin is the most seamless way to integrate it with frameworks like Laravel, SvelteKit, React Router, Nuxt, and SolidJS.",
    openGraph: {
      type: "article",
      title: "Installing with Vite",
      description: "Integrate Tailwind CSS with frameworks like Laravel, SvelteKit, React Router, and SolidJS.",
      images: [`https://tailwindcss.com/api/og?path=${encodeURIComponent(docPath)}`],
      url: canonical,
    },
  };
}

function getSteps(locale: AppLocale): Step[] {
  const zh = locale === "zh";

  return [
    {
      title: zh ? "创建项目" : "Create your project",
      body: (
        <p>
          {zh ? (
            <>
              如果还没有项目，先创建一个新的 Vite 项目。最常用的方式是使用{" "}
              <a href="https://vite.dev/guide/#scaffolding-your-first-vite-project">Create Vite</a>。
            </>
          ) : (
            <>
              Start by creating a new Vite project if you don’t have one set up already. The most common approach is to
              use{" "}
              <a href="https://vite.dev/guide/#scaffolding-your-first-vite-project">Create Vite</a>.
            </>
          )}
        </p>
      ),
      code: {
        name: zh ? "终端" : "Terminal",
        lang: "shell",
        code: dedent`
          npm create vite@latest my-project
          cd my-project
        `,
      },
    },
    {
      title: zh ? "安装 Tailwind CSS" : "Install Tailwind CSS",
      body: (
        <p>
          {zh ? (
            <>
              通过 npm 安装 <code>tailwindcss</code> 与 <code>@tailwindcss/vite</code>。
            </>
          ) : (
            <>
              Install <code>tailwindcss</code> and <code>@tailwindcss/vite</code> via npm.
            </>
          )}
        </p>
      ),
      code: {
        name: zh ? "终端" : "Terminal",
        lang: "shell",
        code: dedent`
          npm install tailwindcss @tailwindcss/vite
        `,
      },
    },
    {
      title: zh ? "配置 Vite 插件" : "Configure the Vite plugin",
      body: (
        <p>
          {zh ? (
            <>
              将 <code>@tailwindcss/vite</code> 插件加入 Vite 配置。
            </>
          ) : (
            <>
              Add the <code>@tailwindcss/vite</code> plugin to your Vite configuration.
            </>
          )}
        </p>
      ),
      code: {
        name: "vite.config.ts",
        lang: "js",
        code: dedent`
          import { defineConfig } from 'vite'
          // [!code highlight:2]
          import tailwindcss from '@tailwindcss/vite'

          export default defineConfig({
            plugins: [
              // [!code highlight:2]
              tailwindcss(),
            ],
          })
        `,
      },
    },
    {
      title: zh ? "导入 Tailwind CSS" : "Import Tailwind CSS",
      body: (
        <p>
          {zh ? (
            <>
              在 CSS 文件中通过 <code>@import</code> 引入 Tailwind CSS。
            </>
          ) : (
            <>
              Add an <code>@import</code> to your CSS file that imports Tailwind CSS.
            </>
          )}
        </p>
      ),
      code: {
        name: zh ? "CSS" : "CSS",
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
        name: zh ? "HTML" : "HTML",
        lang: "html",
        code: dedent`
          <!doctype html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!-- [!code highlight:2] -->
            <link href="/src/style.css" rel="stylesheet">
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
          {zh ? "以 Vite 插件方式安装 Tailwind CSS" : "Installing Tailwind CSS as a Vite plugin"}
        </h3>
        <p>
          {zh ? (
            <>
              将 Tailwind CSS 作为 Vite 插件安装，是与 Laravel、SvelteKit、React Router、Nuxt、SolidJS
              等框架配合最顺畅的集成方式。
            </>
          ) : (
            <>
              Installing Tailwind CSS as a Vite plugin is the most seamless way to integrate it with frameworks like
              Laravel, SvelteKit, React Router, Nuxt, and SolidJS.
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
              用 Vite 接入 Tailwind 的具体步骤会因工具链组合而不同。请查看我们的框架指南，看是否有与您环境匹配的安装说明。
            </>
          ) : (
            <>
              Setting up Tailwind with Vite can be a bit different across different build tools. Check our framework
              guides to see if we have more specific instructions for your particular setup.
            </>
          )}
        </Cta>
      </div>
    </>
  );
}
