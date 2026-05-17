import matter from "gray-matter";
import { normalizeCategory, postMetaSchema, type DraftPost, type PostMeta } from "./types";
import { slugify } from "./slug";

export function parseMarkdownFile(raw: string, fallbackTitle = "Untitled draft") {
  const parsed = matter(raw);
  const data = parsed.data ?? {};
  const title = String(data.title ?? fallbackTitle);
  const meta = postMetaSchema.parse({
    title,
    slug: data.slug ? String(data.slug) : slugify(title),
    date: data.date ? String(data.date) : new Date().toISOString().slice(0, 10),
    description: data.description ? String(data.description) : "",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    category: normalizeCategory(data.category ? String(data.category) : undefined),
    cover: data.cover ? String(data.cover) : "",
    status: data.status === "published" ? "published" : "draft",
    redirectFrom: Array.isArray(data.redirectFrom) ? data.redirectFrom.map(String) : [],
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    source: data.source ? String(data.source) : undefined,
  });

  return {
    meta,
    content: parsed.content.trim(),
  };
}

export function serializePost(meta: PostMeta, content: string) {
  return matter.stringify(content.trim() + "\n", {
    title: meta.title,
    slug: meta.slug,
    date: meta.date,
    description: meta.description,
    tags: meta.tags,
    category: normalizeCategory(meta.category),
    cover: meta.cover,
    status: meta.status,
    redirectFrom: meta.redirectFrom ?? [],
    updatedAt: meta.updatedAt ?? new Date().toISOString(),
    source: meta.source,
  });
}

export function draftToMdx(draft: DraftPost) {
  return serializePost(
    {
      ...draft,
      category: normalizeCategory(draft.category),
      status: "published",
      updatedAt: new Date().toISOString(),
    },
    draft.content,
  );
}

export function estimateReadingTime(content: string) {
  const englishWords = content.match(/[A-Za-z0-9_]+/g)?.length ?? 0;
  const cjkChars = content.match(/[\u4e00-\u9fa5]/g)?.length ?? 0;
  const units = englishWords + Math.ceil(cjkChars / 2);
  return Math.max(1, Math.ceil(units / 220));
}

export function extractHeadings(content: string) {
  return content
    .split("\n")
    .map((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
      if (!match) return null;
      const text = match[2].replace(/[#`*_]/g, "").trim();
      return {
        level: match[1].length,
        text,
        id: slugify(text),
      };
    })
    .filter(Boolean) as Array<{ level: number; text: string; id: string }>;
}
