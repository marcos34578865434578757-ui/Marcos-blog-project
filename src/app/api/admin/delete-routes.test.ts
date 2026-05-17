import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requireAdminApiMock,
  getDraftMock,
  deleteDraftMock,
  getPublishedPostsMock,
  deletePublishedPostFromGithubMock,
} = vi.hoisted(() => ({
  requireAdminApiMock: vi.fn(),
  getDraftMock: vi.fn(),
  deleteDraftMock: vi.fn(),
  getPublishedPostsMock: vi.fn(),
  deletePublishedPostFromGithubMock: vi.fn(),
}));

vi.mock("@/lib/admin/auth", () => ({
  requireAdminApi: requireAdminApiMock,
}));

vi.mock("@/lib/services/blob-store", () => ({
  getDraft: getDraftMock,
  deleteDraft: deleteDraftMock,
}));

vi.mock("@/lib/content/posts", () => ({
  getPublishedPosts: getPublishedPostsMock,
}));

vi.mock("@/lib/services/github", () => ({
  deletePublishedPostFromGithub: deletePublishedPostFromGithubMock,
}));

import { DELETE as deleteDraftRoute } from "./drafts/[slug]/route";
import { DELETE as deletePublishedRoute } from "./posts/[slug]/route";

describe("admin delete routes", () => {
  beforeEach(() => {
    requireAdminApiMock.mockReset();
    getDraftMock.mockReset();
    deleteDraftMock.mockReset();
    getPublishedPostsMock.mockReset();
    deletePublishedPostFromGithubMock.mockReset();
  });

  it("returns 401 when deleting a draft without an admin session", async () => {
    requireAdminApiMock.mockRejectedValue(new Error("Unauthorized"));

    const response = await deleteDraftRoute(new Request("http://localhost/api/admin/drafts/hello"), {
      params: Promise.resolve({ slug: "hello" }),
    });

    expect(response.status).toBe(401);
  });

  it("deletes an existing draft", async () => {
    requireAdminApiMock.mockResolvedValue(undefined);
    getDraftMock.mockResolvedValue({ slug: "hello" });
    deleteDraftMock.mockResolvedValue(undefined);

    const response = await deleteDraftRoute(new Request("http://localhost/api/admin/drafts/hello"), {
      params: Promise.resolve({ slug: "hello" }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { deleted: true } });
    expect(deleteDraftMock).toHaveBeenCalledWith("hello");
  });

  it("deletes an existing published post", async () => {
    requireAdminApiMock.mockResolvedValue(undefined);
    getPublishedPostsMock.mockResolvedValue([{ slug: "hello" }]);
    deletePublishedPostFromGithubMock.mockResolvedValue({ commit: { html_url: "https://github.com/commit/1" } });

    const response = await deletePublishedRoute(new Request("http://localhost/api/admin/posts/hello"), {
      params: Promise.resolve({ slug: "hello" }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      data: { deleted: true, commitUrl: "https://github.com/commit/1" },
    });
  });

  it("returns 404 when the published post cannot be found", async () => {
    requireAdminApiMock.mockResolvedValue(undefined);
    getPublishedPostsMock.mockResolvedValue([]);

    const response = await deletePublishedRoute(new Request("http://localhost/api/admin/posts/missing"), {
      params: Promise.resolve({ slug: "missing" }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ ok: false, error: "Published post not found" });
  });
});
