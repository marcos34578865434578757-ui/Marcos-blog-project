import JSZip from "jszip";
import { parseMarkdownFile } from "@/lib/content/markdown";
import { slugify } from "@/lib/content/slug";
import type { DraftAsset, DraftPost } from "@/lib/content/types";
import { uploadPostAsset } from "./blob-store";

type ImportResult = {
  draft: DraftPost;
  unresolvedAssets: string[];
};

const markdownImagePattern = /!\[([^\]]*)\]\((?!https?:\/\/|data:|#)([^)]+)\)/gi;
const obsidianImagePattern = /!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;

function normalizeAssetPath(input: string) {
  return decodeURIComponent(input.trim().replace(/^\.\/+/, "").replace(/\\/g, "/"));
}

function detectAssetRefs(content: string) {
  const refs = new Set<string>();
  for (const match of content.matchAll(markdownImagePattern)) {
    refs.add(normalizeAssetPath(match[2].replace(/^<|>$/g, "")));
  }
  for (const match of content.matchAll(obsidianImagePattern)) {
    refs.add(normalizeAssetPath(match[1]));
  }
  return [...refs];
}

function rewriteRefs(content: string, replacements: Map<string, string>) {
  return content
    .replace(markdownImagePattern, (full, alt: string, rawPath: string) => {
      const key = normalizeAssetPath(String(rawPath).replace(/^<|>$/g, ""));
      const url = replacements.get(key) ?? replacements.get(key.split("/").pop() ?? "");
      return url ? `![${alt}](${url})` : full;
    })
    .replace(obsidianImagePattern, (full, rawPath: string) => {
      const key = normalizeAssetPath(rawPath);
      const url = replacements.get(key) ?? replacements.get(key.split("/").pop() ?? "");
      return url ? `![](${url})` : full;
    });
}

function fileToDraft(raw: string, filename: string): DraftPost {
  const { meta, content } = parseMarkdownFile(raw, filename.replace(/\.(mdx?|MDX?)$/, ""));
  return {
    ...meta,
    slug: slugify(meta.slug || meta.title),
    status: "draft",
    content,
    source: meta.source ?? "import",
    updatedAt: new Date().toISOString(),
    assets: [],
  };
}

export async function importMarkdownFile(file: File): Promise<ImportResult> {
  const draft = fileToDraft(await file.text(), file.name);
  const unresolvedAssets = detectAssetRefs(draft.content);
  return { draft, unresolvedAssets };
}

export async function importZipBundle(file: File): Promise<ImportResult> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const entries = Object.values(zip.files).filter((entry) => !entry.dir);
  const markdown = entries.find((entry) => /\.(mdx?|MDX?)$/.test(entry.name));

  if (!markdown) {
    throw new Error("Import bundle is missing a Markdown file");
  }

  const raw = await markdown.async("string");
  const draft = fileToDraft(raw, markdown.name.split("/").pop() ?? markdown.name);
  const refs = detectAssetRefs(draft.content);
  const replacements = new Map<string, string>();
  const assets: DraftAsset[] = [];
  const unresolvedAssets: string[] = [];

  for (const ref of refs) {
    const normalized = normalizeAssetPath(ref);
    const filename = normalized.split("/").pop() ?? normalized;
    const entry = entries.find((candidate) => {
      const candidatePath = normalizeAssetPath(candidate.name);
      return candidatePath === normalized || candidatePath.endsWith(`/${normalized}`) || candidatePath.endsWith(`/${filename}`);
    });

    if (!entry) {
      unresolvedAssets.push(ref);
      continue;
    }

    const blob = new Blob([await entry.async("arraybuffer")]);
    const asset = await uploadPostAsset({
      slug: draft.slug,
      file: blob,
      filename,
      source: "import",
      originalPath: ref,
    });
    assets.push(asset);
    replacements.set(normalized, asset.url);
    replacements.set(filename, asset.url);
  }

  return {
    draft: {
      ...draft,
      content: rewriteRefs(draft.content, replacements),
      assets,
    },
    unresolvedAssets,
  };
}
