import { beforeEach, describe, expect, it, vi } from "vitest";
import { deletePublishedPostFromGithub, publishDraftToGithub } from "./github";

describe("deletePublishedPostFromGithub", () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = "token";
    process.env.GITHUB_OWNER = "owner";
    process.env.GITHUB_REPO = "repo";
    process.env.GITHUB_BRANCH = "master";
    vi.restoreAllMocks();
  });

  it("deletes a published file after resolving its sha", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);

      if (!init?.method) {
        return new Response(JSON.stringify({ sha: "abc123" }), { status: 200 });
      }

      expect(init.method).toBe("DELETE");
      expect(url).toContain("/repos/owner/repo/contents/src/content/posts/hello.mdx");
      expect(init.body).toBe(
        JSON.stringify({
          message: "Delete post: hello",
          sha: "abc123",
          branch: "master",
        }),
      );

      return new Response(JSON.stringify({ commit: { html_url: "https://github.com/commit/1" } }), { status: 200 });
    });

    const result = await deletePublishedPostFromGithub("hello");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result?.commit.html_url).toBe("https://github.com/commit/1");
  });

  it("returns null when no matching published file exists", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response("not found", { status: 404 }));

    await expect(deletePublishedPostFromGithub("missing")).resolves.toBeNull();
  });

  it("reuses an existing .md file path when publishing a copied draft", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);

      if (!init?.method && url.includes("/hello.mdx")) {
        return new Response("not found", { status: 404 });
      }

      if (!init?.method && url.includes("/hello.md")) {
        return new Response(JSON.stringify({ sha: "md-sha" }), { status: 200 });
      }

      expect(init?.method).toBe("PUT");
      expect(url).toContain("/repos/owner/repo/contents/src/content/posts/hello.md");
      expect(init?.body).toContain("\"sha\":\"md-sha\"");

      return new Response(
        JSON.stringify({
          content: { path: "src/content/posts/hello.md", sha: "new-sha" },
          commit: { html_url: "https://github.com/commit/2" },
        }),
        { status: 200 },
      );
    });

    const result = await publishDraftToGithub({
      title: "Hello",
      slug: "hello",
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
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result.content.path).toBe("src/content/posts/hello.md");
  });
});
