import { fail, getErrorMessage, ok } from "@/lib/admin/api";
import { requireAdminApi } from "@/lib/admin/auth";
import { draftPostSchema } from "@/lib/content/types";
import { deleteDraft, DraftSlugConflictError, getDraft, saveDraft } from "@/lib/services/blob-store";

function getStatusCode(error: unknown) {
  if (error instanceof Error && error.message === "Unauthorized") return 401;
  if (error instanceof DraftSlugConflictError) return 409;
  return 400;
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdminApi();
    const { slug } = await params;
    const draft = await getDraft(slug);
    if (!draft) return fail("Draft not found", 404);
    return ok(draft);
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 500);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdminApi();
    const input = draftPostSchema.parse(await request.json());
    const { slug } = await params;
    return ok(await saveDraft(input, { previousSlug: slug }));
  } catch (error) {
    return fail(getErrorMessage(error), getStatusCode(error));
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAdminApi();
    const { slug } = await params;
    const url = new URL(request.url);
    const pathname = url.searchParams.get("pathname");

    const draft = await getDraft(slug);
    if (draft) {
      await deleteDraft(slug);
      return ok({ deleted: true });
    }

    if (pathname) {
      try {
        const { del } = await import("@vercel/blob");
        await del(pathname);
      } catch {}
      return ok({ deleted: true });
    }

    return ok({ deleted: true });
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 500);
  }
}
