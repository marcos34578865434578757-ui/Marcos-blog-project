import { beforeEach, describe, expect, it, vi } from "vitest";
import { deletePublishedPostFromGithub } from "./github";

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
});
