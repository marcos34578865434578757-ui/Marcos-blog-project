import { fail, getErrorMessage, ok } from "@/lib/admin/api";
import { requireAdminApi } from "@/lib/admin/auth";
import { draftPostSchema } from "@/lib/content/types";
import { getDraft, saveDraft } from "@/lib/services/blob-store";

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

export async function PUT(request: Request) {
  try {
    await requireAdminApi();
    const input = draftPostSchema.parse(await request.json());
    return ok(await saveDraft(input));
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 400);
  }
}
