import { fail, getErrorMessage, ok } from "@/lib/admin/api";
import { requireAdminApi } from "@/lib/admin/auth";
import { extractHeadings } from "@/lib/content/markdown";

export async function POST(request: Request) {
  try {
    await requireAdminApi();
    const body = (await request.json()) as { content?: string };
    return ok({ headings: extractHeadings(body.content ?? "") });
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 400);
  }
}
