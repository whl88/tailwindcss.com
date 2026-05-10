import type { TOCEntry } from "@/components/table-of-contents";
import type { AppLocale } from "@/i18n/routing";
import fs from "node:fs/promises";
import path from "node:path";
import React from "react";
import { getDocsNav } from "./docs-nav";

const DOCS_ROOT = path.join(process.cwd(), "src", "docs");

async function resolveDocFileLocale(slug: string, locale: AppLocale): Promise<AppLocale | null> {
  if (await fs.stat(path.join(DOCS_ROOT, locale, `${slug}.mdx`)).catch(() => false)) {
    return locale;
  }
  if (locale !== "en" && (await fs.stat(path.join(DOCS_ROOT, "en", `${slug}.mdx`)).catch(() => false))) {
    return "en";
  }
  return null;
}

export async function getDocPageBySlug(
  slug: string,
  locale: AppLocale,
): Promise<null | { Component: React.FC; title: string; description: string }> {
  try {
    let resolvedLocale = await resolveDocFileLocale(slug, locale);
    if (resolvedLocale === null) {
      return null;
    }

    let module = await import(`../../../../docs/${resolvedLocale}/${slug}.mdx`);
    if (!module.default) {
      return null;
    }

    return {
      Component: module.default,
      title: module.title,
      description: module.description,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getDocPageSlugs() {
  let slugs = [];
  for (let file of await fs.readdir(path.join(DOCS_ROOT, "en"))) {
    if (!file.endsWith(".mdx")) continue;
    slugs.push(path.parse(file).name);
  }
  return slugs;
}

export async function generateTableOfContents(slug: string, locale: AppLocale) {
  let filePath = path.join(DOCS_ROOT, locale, `${slug}.mdx`);
  if (!(await fs.stat(filePath).catch(() => false))) {
    filePath = path.join(DOCS_ROOT, "en", `${slug}.mdx`);
  }
  if (!(await fs.stat(filePath).catch(() => false))) {
    return [];
  }

  let markdown = await fs.readFile(filePath, "utf8");

  return generateTableOfContentsFromMarkdown(markdown, locale);
}

export async function generateTableOfContentsFromMarkdown(markdown: string, locale: AppLocale = "en") {
  let headings = [
    // Match Markdown and HTML headings (e.g., ## Heading, <h2>Heading</h2>)
    ...markdown.matchAll(/^(#+)\s+(.+)$|^<h([1-6])(?:\s+[^>]*\bid=["'](.*?)["'][^>]*)?>(.*?)<\/h\3>/gm),
  ].map((match) => {
    let level;
    let text;
    let slug;

    if (match[1]) {
      // Markdown headings
      level = match[1].length;
      text = match[2].trim().replaceAll("\\", "");
    } else {
      // HTML headings
      level = parseInt(match[3], 10); // Extract level from <hN>
      text = match[5].trim().replaceAll("\\", "");
      if (match[4]) {
        slug = `#${match[4]}`;
      }
    }

    // Generate slug
    slug ??= `#${text
      .replace(/`([^`]+)`/g, "$1") // Remove inline code formatting
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .toLowerCase()}`;

    return { level, text, slug, children: [] };
  });

  let toc: TOCEntry[] = [];
  let stack: TOCEntry[] = [{ level: 0, text: "", slug: "", children: toc }];

  let containsQuickReference = markdown.match(/\<ApiTable\s+rows=\{\[/);
  if (containsQuickReference) {
    toc.push({
      level: 0,
      text: locale === "zh" ? "速查" : "Quick reference",
      slug: "#quick-reference",
      children: [],
    });
  }

  for (let heading of headings) {
    while (stack[stack.length - 1].level >= heading.level) stack.pop();
    stack[stack.length - 1].children.push(heading);
    stack.push(heading);
  }

  return toc;
}

export function getSectionAndTitleBySlug(
  slug: string,
  locale: AppLocale,
): { section: string; title: string } | null {
  let index = getDocsNav(locale);
  let currentPath = `/docs/${slug}`;
  for (let [section, entries] of Object.entries(index)) {
    for (let [title, path, children] of entries) {
      if (path === currentPath) {
        return { section, title };
      }

      if (Array.isArray(children)) {
        for (let [childTitle, childPath] of children) {
          if (childPath === currentPath) {
            return { section, title: childTitle };
          }
        }
      }
    }
  }
  return null;
}
