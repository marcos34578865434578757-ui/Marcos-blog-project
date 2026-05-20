import { BlobNotFoundError, del, head, list, put } from "@vercel/blob";
import { slugify } from "@/lib/content/slug";
import {
  draftPostSchema,
  normalizeCategory,
  type DraftAsset,
  type DraftAssetSource,
  type DraftPost,
} from "@/lib/content/types";

const draftsPrefix = "drafts/";

export class DraftSlugConflictError extends Error {
  constructor(slug: string) {
    super(`Draft with slug "${slug}" already exists`);
  }
}

function requireBlobToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing");
  }
}

function normalizeDraft(draft: unknown) {
  const input = draft as DraftPost & { assets?: Array<DraftAsset & { source?: string }> };
  return draftPostSchema.parse({
    ...input,
    category: normalizeCategory(input.category),
    assets: (input.assets ?? []).map((asset) => ({
      ...asset,
      source: (() => {
        const source = (asset as { source?: string }).source;
        return source === "upload" ? "content" : (source ?? "content");
      })(),
    })),
  });
}

async function readDraftByPath(pathname: string) {
  try {
    const blob = await head(pathname);
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return null;
    return normalizeDraft(await response.json());
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

async function draftExists(slug: string) {
  return (await readDraftByPath(draftPath(slug))) !== null;
}

export function draftPath(slug: string) {
  return `${draftsPrefix}${slugify(slug)}.json`;
}

export async function listDrafts() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  const result = await list({ prefix: draftsPrefix, limit: 1000 });
  const drafts = await Promise.all(
    result.blobs
      .filter((blob) => blob.pathname.endsWith(".json"))
      .map(async (blob) => {
        const response = await fetch(blob.url, { cache: "no-store" });
        if (!response.ok) return null;
        return normalizeDraft(await response.json());
      }),
  );

  return drafts.filter((draft): draft is DraftPost => draft !== null).sort((a, b) => {
    return Date.parse(b.updatedAt ?? b.date) - Date.parse(a.updatedAt ?? a.date);
  });
}

export async function getDraft(slug: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  return readDraftByPath(draftPath(slug));
}

export async function saveDraft(input: DraftPost, options?: { previousSlug?: string }) {
  requireBlobToken();
  const nextSlug = slugify(input.slug || input.title);
  const previousSlug = options?.previousSlug ? slugify(options.previousSlug) : undefined;

  if (previousSlug && previousSlug !== nextSlug && (await draftExists(nextSlug))) {
    throw new DraftSlugConflictError(nextSlug);
  }

  const draft = draftPostSchema.parse({
    ...input,
    slug: nextSlug,
    category: normalizeCategory(input.category),
    status: "draft",
    updatedAt: new Date().toISOString(),
    assets: input.assets ?? [],
  });

  await put(draftPath(draft.slug), JSON.stringify(draft, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });

  if (previousSlug && previousSlug !== draft.slug) {
    await del(draftPath(previousSlug));
  }

  return draft;
}

export async function deleteDraft(slug: string) {
  requireBlobToken();
  await del(draftPath(slug));
}

export async function deleteDraftByPathname(pathname: string) {
  requireBlobToken();
  try {
    await del(pathname);
  } catch {}
}

export async function listDraftsWithPathnames() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  const result = await list({ prefix: draftsPrefix, limit: 1000 });
  const entries = await Promise.all(
    result.blobs
      .filter((blob) => blob.pathname.endsWith(".json"))
      .map(async (blob) => {
        const response = await fetch(blob.url, { cache: "no-store" });
        if (!response.ok) return null;
        const draft = normalizeDraft(await response.json());
        return { ...draft, _pathname: blob.pathname };
      }),
  );

  return entries.filter((entry): entry is DraftPost & { _pathname: string } => entry !== null);
}

export async function uploadPostAsset(params: {
  slug: string;
  file: Blob;
  filename: string;
  source: DraftAssetSource;
  originalPath?: string;
}) {
  requireBlobToken();
  const extension = params.filename.split(".").pop()?.toLowerCase() || "bin";
  const pathname = `posts/${slugify(params.slug)}/${crypto.randomUUID()}.${extension}`;
  const blob = await put(pathname, params.file, {
    access: "public",
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    source: params.source,
    originalPath: params.originalPath,
  } satisfies DraftAsset;
}
