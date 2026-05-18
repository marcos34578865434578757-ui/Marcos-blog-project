import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { notFound } from "next/navigation";
import { listDrafts } from "@/lib/services/blob-store";
import { estimateReadingTime, parseMarkdownFile } from "./markdown";
import {
  CATEGORY_PAGE_MAP,
  dedupeCategories,
  isCategoryMatch,
  normalizeCategory,
  resolveCategoryQuery,
} from "./categories";
import type { DraftPost, PublishedPost } from "./types";

const postsDir = path.join(process.cwd(), "src", "content", "posts");

async function readPostFiles() {
  try {
    const names = await fs.readdir(postsDir);
    return names.filter((name) => name.endsWith(".md") || name.endsWith(".mdx"));
  } catch {
    return [];
  }
}

async function resolvePublishedPostFile(slug: string) {
  const candidates = [`${slug}.mdx`, `${slug}.md`];

  for (const candidate of candidates) {
    const pathname = path.join(postsDir, candidate);
    try {
      await fs.access(pathname);
      return pathname;
    } catch {
      continue;
    }
  }

  return null;
}

function toPublishedPost(raw: string, fallbackSlug: string) {
  const { meta, content } = parseMarkdownFile(raw, fallbackSlug);
  if (meta.status !== "published") return null;

  return {
    ...meta,
    category: normalizeCategory(meta.category),
    status: "published" as const,
    content,
    readingTime: estimateReadingTime(content),
  };
}

export const getPublishedPosts = cache(async (): Promise<PublishedPost[]> => {
  const files = await readPostFiles();
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(postsDir, file), "utf8");
      return toPublishedPost(raw, file.replace(/\.(mdx?|MDX?)$/, ""));
    }),
  );

  return posts
    .filter((post): post is PublishedPost => post !== null)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
});

export async function getPublishedPost(slug: string) {
  const posts = await getPublishedPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  return post;
}

export async function getPublishedPostsByCategory(category?: string | null) {
  const posts = await getPublishedPosts();
  return posts.filter((post) => isCategoryMatch(post.category, category));
}

export async function getPublishedPostsForSection(section: keyof typeof CATEGORY_PAGE_MAP) {
  return getPublishedPostsByCategory(CATEGORY_PAGE_MAP[section]);
}

export async function materializePublishedPostDraft(slug: string): Promise<DraftPost | null> {
  const pathname = await resolvePublishedPostFile(slug);
  if (!pathname) return null;

  const raw = await fs.readFile(pathname, "utf8");
  const { meta, content } = parseMarkdownFile(raw, slug);

  return {
    ...meta,
    category: normalizeCategory(meta.category),
    status: "draft",
    content,
    assets: [],
    updatedAt: new Date().toISOString(),
    source: "published",
  };
}

export async function getPublicCategories() {
  const posts = await getPublishedPosts();
  return dedupeCategories(posts.map((post) => post.category));
}

export async function getAdminCategories() {
  const [published, drafts] = await Promise.all([getPublishedPosts(), listDrafts()]);
  return dedupeCategories([...published.map((post) => post.category), ...drafts.map((draft) => draft.category)]);
}

export async function getTags() {
  const posts = await getPublishedPosts();
  return [...new Set(posts.flatMap((post) => post.tags))].sort((left, right) => left.localeCompare(right, "zh-CN"));
}

export function resolvePostsCategoryFilter(category?: string | null) {
  return resolveCategoryQuery(category);
}
