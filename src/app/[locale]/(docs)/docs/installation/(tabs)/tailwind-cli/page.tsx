import dedent from "dedent";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { type Step, Steps } from "@/components/installation-steps";
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
  const docPath = withLocalePrefix(locale, "/docs/installation/tailwind-cli");
  const canonical = `https://tailwindcss.com${docPath}`;

  if (locale === "zh") {
    return {
      title: "Tailwind CLI",
      description:
        "从零开始使用 Tailwind CSS，最简单也最快捷的方式是使用 Tailwind 命令行工具。",
      openGraph: {
        type: "article",
        title: "Tailwind CLI",
        description: "从零开始用 Tailwind CLI 快速上手。",
        images: [`https://tailwindcss.com/api/og?path=${encodeURIComponent(docPath)}`],
        url: canonical,
      },
    };
  }

  return {
    title: "Tailwind CLI",
    description:
      "The simplest and fastest way to get up and running with Tailwind CSS from scratch is with the Tailwind CLI tool.",
    openGraph: {
      type: "article",
      title: "Tailwind CLI",
      description: "The simplest and fastest way to get up and running with Tailwind CSS from scratch.",
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
              使用 npm 安装 <code>tailwindcss</code> 与 <code>@tailwindcss/cli</code>。
            </>
          ) : (
            <>
              Install <code>tailwindcss</code> and <code>@tailwindcss/cli</code> via npm.
            </>
          )}
        </p>
      ),
      code: {
        name: zh ? "终端" : "Terminal",
        lang: "shell",
        code: "npm install tailwindcss @tailwindcss/cli",
      },
    },
    {
      title: zh ? "在 CSS 中导入 Tailwind" : "Import Tailwind in your CSS",
      body: (
        <p>
          {zh ? (
            <>
              在主样式文件中加入 <code>@import &quot;tailwindcss&quot;;</code>。
            </>
          ) : (
            <>
              Add the <code>@import &quot;tailwindcss&quot;;</code> import to your main CSS file.
            </>
          )}
        </p>
      ),
      code: {
        name: "src/input.css",
        lang: "css",
        code: '@import "tailwindcss";',
      },
    },
    {
      title: zh ? "启动 Tailwind CLI 构建" : "Start the Tailwind CLI build process",
      body: <p>{zh ? "运行 CLI，扫描源码中的类名并生成样式文件。" : "Run the CLI tool to scan your source files for classes and build your CSS."}</p>,
      code: {
        name: zh ? "终端" : "Terminal",
        lang: "shell",
        code: "npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch",
      },
    },
    {
      title: zh ? "在 HTML 中使用 Tailwind" : "Start using Tailwind in your HTML",
      body: (
        <p>
          {zh ? (
            <>
              在 <code>{"<head>"}</code> 中引入编译得到的 CSS，即可用 Tailwind 的工具类编写样式。
            </>
          ) : (
            <>
              Add your compiled CSS file to the <code>{"<head>"}</code> and start using Tailwind’s utility classes to
              style your content.
            </>
          )}
        </p>
      ),
      code: {
        name: "src/index.html",
        lang: "html",
        code: dedent`
          <!doctype html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!-- [!code highlight:2] -->
            <link href="./output.css" rel="stylesheet">
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
        <h3 className="sr-only" data-title="true">
          {zh ? "安装并使用 Tailwind CLI" : "Installing Tailwind CLI"}
        </h3>
        <p>
          {zh ? (
            <>
              从零开始使用 Tailwind CSS，最简单也最快捷的方式是使用 Tailwind 命令行工具。CLI 也提供{" "}
              <Link href="https://github.com/tailwindlabs/tailwindcss/releases/latest">独立可执行文件</Link>
              ，无需安装 Node.js 即可使用。
            </>
          ) : (
            <>
              The simplest and fastest way to get up and running with Tailwind CSS from scratch is with the Tailwind CLI
              tool. The CLI is also available as a{" "}
              <Link href="https://github.com/tailwindlabs/tailwindcss/releases/latest">standalone executable</Link> if
              you want to use it without installing Node.js.
            </>
          )}
        </p>
      </div>
      <Steps steps={steps} />
    </>
  );
}
