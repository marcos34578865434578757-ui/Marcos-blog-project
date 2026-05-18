import { z } from "zod";
import { DEFAULT_CATEGORY, normalizeCategory } from "./categories";

export { DEFAULT_CATEGORY, normalizeCategory } from "./categories";

export const postStatusSchema = z.enum(["draft", "published"]);

export const postMetaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().default(""),
  tags: z.array(z.string()).default([]),
  category: z.string().default(DEFAULT_CATEGORY).transform((value) => normalizeCategory(value)),
  cover: z.string().default(""),
  status: postStatusSchema.default("draft"),
  redirectFrom: z.array(z.string()).default([]),
  updatedAt: z.string().optional(),
  source: z.string().optional(),
});

export const draftAssetSourceSchema = z.enum(["cover", "content", "import"]);

export const draftAssetSchema = z.object({
  url: z.string(),
  source: draftAssetSourceSchema.default("content"),
  originalPath: z.string().optional(),
});

export const draftPostSchema = postMetaSchema.extend({
  status: z.literal("draft").default("draft"),
  content: z.string().default(""),
  assets: z.array(draftAssetSchema).default([]),
});

export type PostMeta = z.infer<typeof postMetaSchema>;
export type DraftAsset = z.infer<typeof draftAssetSchema>;
export type DraftAssetSource = z.infer<typeof draftAssetSourceSchema>;
export type DraftPost = z.infer<typeof draftPostSchema>;

export type PublishedPost = PostMeta & {
  status: "published";
  content: string;
  readingTime: number;
};

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };
