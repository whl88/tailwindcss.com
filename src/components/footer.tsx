import clsx from "clsx";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import ThemeToggle from "./theme-toggle";

export async function FooterSitemap({ className }: { className?: string }) {
  const t = await getTranslations("Footer");
  return (
    <footer className="bg-white text-sm/loose text-gray-950 dark:bg-gray-950 dark:text-white">
      <div className={clsx("flex flex-col gap-10 p-4 md:hidden", className)}>
        <div>
          <TailwindCSS t={t} />
        </div>
        <div>
          <Resources t={t} />
        </div>
      </div>
      <div
        className={clsx(
          "mx-auto hidden w-full grid-cols-2 justify-between gap-y-0 md:grid md:grid-cols-2 md:gap-6 md:gap-x-4 lg:gap-8",
          className,
        )}
      >
        <div className="border-x border-b border-gray-950/5 py-10 pl-2 not-md:border-0 md:border-b-0 dark:border-white/10">
          <TailwindCSS t={t} />
        </div>
        <div className="border-x border-gray-950/5 py-10 pl-2 not-md:border-0 dark:border-white/10">
          <Resources t={t} />
        </div>
      </div>
    </footer>
  );
}

export async function FooterMeta({ className }: { className?: string }) {
  const t = await getTranslations("Footer");
  return (
    <div className="px-2 pt-10 pb-24">
      <div
        className={clsx(
          "mx-auto flex w-full flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8",
          className,
        )}
      >
        <ThemeToggle />
        <div className="flex flex-col gap-4 text-sm/6 text-gray-700 sm:flex-row sm:gap-2 sm:pr-4 dark:text-gray-400">
          <span>{t("copyright", { year: new Date().getFullYear() })}</span>
          <span className="max-sm:hidden">&middot;</span>
          <Link href="/brand" className="hover:underline">
            {t("trademark")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function TailwindCSS({ t }: { t: Awaited<ReturnType<typeof getTranslations>> }) {
  return (
    <>
      <h3 className="font-semibold">{t("sectionTailwind")}</h3>
      <ul className="mt-4 grid gap-4">
        <li>
          <Link href="/docs" className="hover:underline">
            {t("documentation")}
          </Link>
        </li>
        <li>
          <Link href="https://play.tailwindcss.com/" className="hover:underline">
            {t("playground")}
          </Link>
        </li>
        <li>
          <Link href="/sponsor" className="hover:underline">
            {t("sponsor")}
          </Link>
        </li>
      </ul>
    </>
  );
}

function Resources({ t }: { t: Awaited<ReturnType<typeof getTranslations>> }) {
  return (
    <>
      <h3 className="font-semibold">{t("sectionResources")}</h3>
      <ul className="mt-4 grid gap-4">
        <li>
          <Link href="https://www.refactoringui.com" className="hover:underline">
            {t("refactoringUi")}
          </Link>
        </li>
        <li>
          <Link href="https://headlessui.com" className="hover:underline">
            {t("headlessUi")}
          </Link>
        </li>
        <li>
          <Link href="https://heroicons.com" className="hover:underline">
            {t("heroicons")}
          </Link>
        </li>
        <li>
          <Link href="https://heropatterns.com" className="hover:underline">
            {t("heroPatterns")}
          </Link>
        </li>
      </ul>
    </>
  );
}

