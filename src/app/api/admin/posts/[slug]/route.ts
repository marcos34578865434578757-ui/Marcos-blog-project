import { fail, getErrorMessage, ok } from "@/lib/admin/api";
import { requireAdminApi } from "@/lib/admin/auth";
import { getPublishedPosts, materializePublishedPostDraft } from "@/lib/content/posts";
import { deleteDraft, getDraft, saveDraft } from "@/lib/services/blob-store";
import { deletePublishedPostFromGithub } from "@/lib/services/github";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdminApi();
    const { slug } = await params;
    const draft = await getDraft(slug);
    if (draft) return ok({ type: "draft", post: draft });

    const published = (await getPublishedPosts()).find((post) => post.slug === slug);
    if (!published) return fail("Post not found", 404);
    return ok({ type: "published", post: published });
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 500);
  }
}

export async function POST(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdminApi();
    const { slug } = await params;
    const existingDraft = await getDraft(slug);
    if (existingDraft) return ok({ draft: existingDraft, existing: true });

    const draft = await materializePublishedPostDraft(slug);
    if (!draft) return fail("Published post not found", 404);

    return ok({ draft: await saveDraft(draft), existing: false });
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 500);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdminApi();
    const { slug } = await params;
    const published = (await getPublishedPosts()).find((post) => post.slug === slug);
    if (!published) return fail("Published post not found", 404);

    const result = await deletePublishedPostFromGithub(slug);
    if (!result) return fail("Published post not found", 404);

    const existingDraft = await getDraft(slug);
    if (existingDraft) {
      await deleteDraft(slug);
    }

    return ok({ deleted: true, commitUrl: result.commit.html_url });
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 500);
  }
}
