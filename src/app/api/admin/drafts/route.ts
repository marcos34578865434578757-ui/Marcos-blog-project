import { fail, getErrorMessage, ok } from "@/lib/admin/api";
import { requireAdminApi } from "@/lib/admin/auth";
import { draftPostSchema } from "@/lib/content/types";
import { DraftSlugConflictError, listDrafts, saveDraft } from "@/lib/services/blob-store";

function getStatusCode(error: unknown) {
  if (error instanceof Error && error.message === "Unauthorized") return 401;
  if (error instanceof DraftSlugConflictError) return 409;
  return 400;
}

export async function GET() {
  try {
    await requireAdminApi();
    return ok(await listDrafts());
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminApi();
    const input = draftPostSchema.parse(await request.json());
    return ok(await saveDraft(input));
  } catch (error) {
    return fail(getErrorMessage(error), getStatusCode(error));
  }
}
