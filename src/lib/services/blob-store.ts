import { BlobNotFoundError, del, head, list, put } from "@vercel/blob";
import { draftPostSchema, type DraftAsset, type DraftPost } from "@/lib/content/types";
import { slugify } from "@/lib/content/slug";

const draftsPrefix = "drafts/";

function requireBlobToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing");
  }
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
        return draftPostSchema.parse(await response.json());
      }),
  );

  return drafts.filter((draft): draft is DraftPost => draft !== null).sort((a, b) => {
    return Date.parse(b.updatedAt ?? b.date) - Date.parse(a.updatedAt ?? a.date);
  });
}

export async function getDraft(slug: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  try {
    const blob = await head(draftPath(slug));
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return null;
    return draftPostSchema.parse(await response.json());
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

export async function saveDraft(input: DraftPost) {
  requireBlobToken();
  const draft = draftPostSchema.parse({
    ...input,
    slug: slugify(input.slug || input.title),
    status: "draft",
    updatedAt: new Date().toISOString(),
    assets: input.assets ?? [],
  });

  await put(draftPath(draft.slug), JSON.stringify(draft, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });

  return draft;
}

export async function deleteDraft(slug: string) {
  requireBlobToken();
  await del(draftPath(slug));
}

export async function uploadPostAsset(params: {
  slug: string;
  file: Blob;
  filename: string;
  source: DraftAsset["source"];
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
