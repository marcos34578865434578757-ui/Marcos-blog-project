import { fail, getErrorMessage, ok } from "@/lib/admin/api";
import { requireAdminApi } from "@/lib/admin/auth";
import { getPublishedPosts } from "@/lib/content/posts";
import { listDrafts } from "@/lib/services/blob-store";

export async function GET() {
  try {
    await requireAdminApi();
    const [published, drafts] = await Promise.all([getPublishedPosts(), listDrafts()]);
    return ok({ published, drafts });
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 500);
  }
}
