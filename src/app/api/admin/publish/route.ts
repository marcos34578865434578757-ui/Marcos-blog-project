import { fail, getErrorMessage, ok } from "@/lib/admin/api";
import { requireAdminApi } from "@/lib/admin/auth";
import { getDraft } from "@/lib/services/blob-store";
import { publishDraftToGithub } from "@/lib/services/github";

export async function POST(request: Request) {
  try {
    await requireAdminApi();
    const body = (await request.json()) as { slug?: string };
    if (!body.slug) return fail("Slug is required");

    const draft = await getDraft(body.slug);
    if (!draft) return fail("Draft not found", 404);
    if (!draft.title.trim()) return fail("Title is required");
    if (!draft.content.trim()) return fail("Content is required");

    const result = await publishDraftToGithub(draft);
    return ok({
      path: result.content.path,
      sha: result.content.sha,
      commitUrl: result.commit.html_url,
    });
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 400);
  }
}
