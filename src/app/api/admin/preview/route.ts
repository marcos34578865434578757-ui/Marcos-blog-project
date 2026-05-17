import { fail, getErrorMessage, ok } from "@/lib/admin/api";
import { requireAdminApi } from "@/lib/admin/auth";
import { getDirectiveWarnings } from "@/lib/content/directives";
import { extractHeadings } from "@/lib/content/markdown";

export async function POST(request: Request) {
  try {
    await requireAdminApi();
    const body = (await request.json()) as { content?: string };
    const content = body.content ?? "";
    return ok({
      headings: extractHeadings(content),
      warnings: getDirectiveWarnings(content),
    });
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 400);
  }
}
