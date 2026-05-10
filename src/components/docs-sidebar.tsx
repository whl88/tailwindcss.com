import { NavList, NavListHeading, NavListItem, NavListItems } from "@/components/nav-list";
import clsx from "clsx";
import docsNavEn from "@/app/[locale]/(docs)/docs/index";
import docsNavZh from "@/app/[locale]/(docs)/docs/index.zh";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { DocsSidebarLink } from "./docs-sidebar-link";

export function TopNavLink(props: { href: string } & React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      className={clsx(
        "group",
        "inline-flex items-center gap-3 text-base/8 text-gray-600 sm:text-sm/7 dark:text-gray-300",
        "**:data-outline:stroke-gray-400 dark:**:data-outline:stroke-gray-500 **:[svg]:first:size-5 **:[svg]:first:sm:size-4",
        "hover:text-gray-950 hover:**:data-highlight:fill-gray-300 hover:**:data-outline:stroke-gray-950",
        "dark:hover:text-white dark:hover:**:data-highlight:fill-gray-600 dark:hover:**:data-outline:stroke-white",
        "aria-[current]:font-semibold aria-[current]:text-gray-950 aria-[current]:**:data-highlight:fill-gray-300 aria-[current]:**:data-outline:stroke-gray-950",
        "dark:aria-[current]:text-white dark:aria-[current]:**:data-highlight:fill-gray-600 dark:aria-[current]:**:data-outline:stroke-white",
      )}
      {...props}
    />
  );
}

function TopNav({
  documentationLabel,
  playgroundLabel,
}: {
  documentationLabel: string;
  playgroundLabel: string;
}) {
  return (
    <ul className="flex flex-col gap-2">
      <li>
        <TopNavLink href="/docs/installation" aria-current="page">
          <svg viewBox="0 0 16 16" fill="none">
            <path
              data-highlight
              d="M3.5 1.5C2.4264 1.5 1.40926 1.74169 0.5 2.17363V13.1736C1.40926 12.7417 2.4264 12.5 3.5 12.5C5.21352 12.5 6.78323 13.1157 8 14.1379V3.13789C6.78323 2.11568 5.21352 1.5 3.5 1.5Z"
            />
            <path
              data-outline
              d="M8 14.1379C9.21677 13.1157 10.7865 12.5 12.5 12.5C13.5736 12.5 14.5907 12.7417 15.5 13.1736V2.17363C14.5907 1.74169 13.5736 1.5 12.5 1.5C10.7865 1.5 9.21677 2.11568 8 3.13789M8 14.1379C6.78323 13.1157 5.21352 12.5 3.5 12.5C2.4264 12.5 1.40926 12.7417 0.5 13.1736V2.17363C1.40926 1.74169 2.4264 1.5 3.5 1.5C5.21352 1.5 6.78323 2.11568 8 3.13789M8 14.1379V3.13789"
            />
          </svg>
          {documentationLabel}
        </TopNavLink>
      </li>
      <li>
        <TopNavLink href="https://play.tailwindcss.com/">
          <svg viewBox="0 0 16 16" fill="none">
            <rect data-highlight x="1.5" y="1.5" width="13" height="13" rx="2" />
            <rect data-outline x="1.5" y="1.5" width="13" height="13" rx="2" />
            <path data-outline d="M6.5 6L4.5 8L6.5 10" strokeLinecap="round" strokeLinejoin="round" />
            <path data-outline d="M9.5 6L11.5 8L9.5 10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {playgroundLabel}
        </TopNavLink>
      </li>
    </ul>
  );
}

export async function DocsSidebar({ locale }: { locale: AppLocale }) {
  const tFooter = await getTranslations("Footer");
  let index = (locale === "zh" ? docsNavZh : docsNavEn) as typeof docsNavEn;
  return (
    <nav className="flex flex-col gap-8">
      <TopNav documentationLabel={tFooter("documentation")} playgroundLabel={tFooter("playground")} />
      {Object.entries(index).map(([category, entries]) => (
        <NavList key={category} data-autoscroll>
          <NavListHeading>{category}</NavListHeading>
          <NavListItems>
            {entries.map(([title, path, children]) => (
              <NavListItem key={path}>
                <DocsSidebarLink title={title} path={path} />

                {Array.isArray(children) && children.length > 0 && (
                  <NavListItems nested>
                    {children.map(([title, path]) => (
                      <NavListItem key={path}>
                        <DocsSidebarLink title={title} path={path} nested />
                      </NavListItem>
                    ))}
                  </NavListItems>
                )}
              </NavListItem>
            ))}
          </NavListItems>
        </NavList>
      ))}
    </nav>
  );
}
