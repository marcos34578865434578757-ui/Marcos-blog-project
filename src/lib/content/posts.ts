import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { notFound } from "next/navigation";
import { estimateReadingTime, parseMarkdownFile } from "./markdown";
import type { PublishedPost } from "./types";

const postsDir = path.join(process.cwd(), "src", "content", "posts");

async function readPostFiles() {
  try {
    const names = await fs.readdir(postsDir);
    return names.filter((name) => name.endsWith(".md") || name.endsWith(".mdx"));
  } catch {
    return [];
  }
}

export const getPublishedPosts = cache(async (): Promise<PublishedPost[]> => {
  const files = await readPostFiles();
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(postsDir, file), "utf8");
      const { meta, content } = parseMarkdownFile(raw, file.replace(/\.(mdx?|MDX?)$/, ""));
      if (meta.status !== "published") return null;

      return {
        ...meta,
        status: "published" as const,
        content,
        readingTime: estimateReadingTime(content),
      };
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

export async function getCategories() {
  const posts = await getPublishedPosts();
  return [...new Set(posts.map((post) => post.category).filter(Boolean))].sort();
}

export async function getTags() {
  const posts = await getPublishedPosts();
  return [...new Set(posts.flatMap((post) => post.tags))].sort();
}
