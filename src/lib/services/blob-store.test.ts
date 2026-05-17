import { beforeEach, describe, expect, it, vi } from "vitest";

const { headMock, listMock, putMock, delMock, MockBlobNotFoundError } = vi.hoisted(() => {
  class BlobNotFoundError extends Error {}

  return {
    headMock: vi.fn(),
    listMock: vi.fn(),
    putMock: vi.fn(),
    delMock: vi.fn(),
    MockBlobNotFoundError: BlobNotFoundError,
  };
});

vi.mock("@vercel/blob", () => ({
  BlobNotFoundError: MockBlobNotFoundError,
  head: headMock,
  list: listMock,
  put: putMock,
  del: delMock,
}));

import { deleteDraft, draftPath, DraftSlugConflictError, getDraft, saveDraft } from "./blob-store";

describe("blob-store draft access", () => {
  beforeEach(() => {
    process.env.BLOB_READ_WRITE_TOKEN = "blob-token";
    headMock.mockReset();
    listMock.mockReset();
    putMock.mockReset();
    delMock.mockReset();
    vi.restoreAllMocks();
  });

  it("reads a draft directly from its blob pathname", async () => {
    headMock.mockResolvedValue({ url: "https://blob.example/drafts/hello.json" });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          title: "Hello",
          slug: "hello",
          date: "2026-05-17",
          description: "",
          tags: [],
          category: "Notes",
          cover: "",
          status: "draft",
          redirectFrom: [],
          updatedAt: "2026-05-17T00:00:00.000Z",
          source: "admin",
          content: "Test",
          assets: [],
        }),
      ),
    );

    const draft = await getDraft("hello");

    expect(headMock).toHaveBeenCalledWith(draftPath("hello"));
    expect(listMock).not.toHaveBeenCalled();
    expect(draft?.slug).toBe("hello");
    expect(draft?.category).toBe("未分类");
  });

  it("returns null when the draft blob does not exist", async () => {
    headMock.mockRejectedValue(new MockBlobNotFoundError("not found"));

    await expect(getDraft("missing")).resolves.toBeNull();
  });

  it("migrates draft files when the slug changes", async () => {
    headMock.mockRejectedValue(new MockBlobNotFoundError("not found"));

    const result = await saveDraft(
      {
        title: "Hello",
        slug: "hello-updated",
        date: "2026-05-17",
        description: "",
        tags: [],
        category: "Notes",
        cover: "",
        status: "draft",
        redirectFrom: [],
        updatedAt: "2026-05-17T00:00:00.000Z",
        source: "admin",
        content: "Test",
        assets: [],
      },
      { previousSlug: "hello" },
    );

    expect(putMock).toHaveBeenCalledWith(
      "drafts/hello-updated.json",
      expect.any(String),
      expect.objectContaining({ access: "public", allowOverwrite: true }),
    );
    expect(delMock).toHaveBeenCalledWith("drafts/hello.json");
    expect(result.slug).toBe("hello-updated");
    expect(result.category).toBe("未分类");
  });

  it("prevents overwriting a different draft when the slug changes", async () => {
    headMock.mockResolvedValue({ url: "https://blob.example/drafts/existing.json" });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ slug: "existing", title: "Existing", date: "2026-05-17", description: "", tags: [], category: "未分类", cover: "", status: "draft", redirectFrom: [], updatedAt: "2026-05-17T00:00:00.000Z", source: "admin", content: "Test", assets: [] })));

    await expect(
      saveDraft(
        {
          title: "Hello",
          slug: "existing",
          date: "2026-05-17",
          description: "",
          tags: [],
          category: "未分类",
          cover: "",
          status: "draft",
          redirectFrom: [],
          updatedAt: "2026-05-17T00:00:00.000Z",
          source: "admin",
          content: "Test",
          assets: [],
        },
        { previousSlug: "hello" },
      ),
    ).rejects.toBeInstanceOf(DraftSlugConflictError);
  });

  it("deletes drafts by canonical pathname", async () => {
    await deleteDraft("hello");

    expect(delMock).toHaveBeenCalledWith("drafts/hello.json");
  });
});
