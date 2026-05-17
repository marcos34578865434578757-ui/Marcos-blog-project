import { draftToMdx } from "@/lib/content/markdown";
import { ensureMdxFilename } from "@/lib/content/slug";
import type { DraftPost } from "@/lib/content/types";

function getGithubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!token || !owner || !repo) {
    throw new Error("GitHub env configuration is missing");
  }

  return { token, owner, repo, branch };
}

async function githubRequest<T>(path: string, init?: RequestInit) {
  const { token } = getGithubConfig();
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API failed: ${response.status} ${text}`);
  }

  return (await response.json()) as T;
}

async function getExistingFileSha(pathname: string) {
  const { owner, repo, branch } = getGithubConfig();
  const encodedPath = pathname
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  try {
    const file = await githubRequest<{ sha: string }>(
      `/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`,
    );
    return file.sha;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) return undefined;
    throw error;
  }
}

async function resolvePublishedPost(pathOrSlug: string) {
  const trimmed = pathOrSlug.trim();
  const candidates = trimmed.includes("/")
    ? [trimmed]
    : [`src/content/posts/${trimmed}.mdx`, `src/content/posts/${trimmed}.md`];

  for (const pathname of candidates) {
    const sha = await getExistingFileSha(pathname);
    if (sha) {
      return { pathname, sha };
    }
  }

  return null;
}

export async function publishDraftToGithub(draft: DraftPost) {
  const { owner, repo, branch } = getGithubConfig();
  const pathname = `src/content/posts/${ensureMdxFilename(draft.slug)}`;
  const sha = await getExistingFileSha(pathname);
  const content = draftToMdx(draft);
  const body: Record<string, unknown> = {
    message: `Publish post: ${draft.title}`,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch,
  };

  if (sha) body.sha = sha;

  return githubRequest<{ content: { path: string; sha: string }; commit: { html_url: string } }>(
    `/repos/${owner}/${repo}/contents/${pathname}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  );
}

export async function deletePublishedPostFromGithub(slug: string) {
  const { owner, repo, branch } = getGithubConfig();
  const resolved = await resolvePublishedPost(slug);
  if (!resolved) return null;

  const encodedPath = resolved.pathname
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return githubRequest<{ commit: { html_url: string } }>(`/repos/${owner}/${repo}/contents/${encodedPath}`, {
    method: "DELETE",
    body: JSON.stringify({
      message: `Delete post: ${slug}`,
      sha: resolved.sha,
      branch,
    }),
  });
}
