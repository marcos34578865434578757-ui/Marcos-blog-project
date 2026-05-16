import { fail, getErrorMessage, ok } from "@/lib/admin/api";
import { requireAdminApi } from "@/lib/admin/auth";
import { saveDraft } from "@/lib/services/blob-store";
import { importMarkdownFile, importZipBundle } from "@/lib/services/importer";

export async function POST(request: Request) {
  try {
    await requireAdminApi();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return fail("A Markdown or zip file is required");
    }

    const lowerName = file.name.toLowerCase();
    const result = lowerName.endsWith(".zip")
      ? await importZipBundle(file)
      : lowerName.endsWith(".md") || lowerName.endsWith(".mdx")
        ? await importMarkdownFile(file)
        : null;

    if (!result) return fail("Only .md, .mdx, and .zip files are supported");

    const draft = await saveDraft(result.draft);
    return ok({ draft, unresolvedAssets: result.unresolvedAssets });
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 400);
  }
}
