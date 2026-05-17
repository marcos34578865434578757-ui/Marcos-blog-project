import { fail, getErrorMessage, ok } from "@/lib/admin/api";
import { requireAdminApi } from "@/lib/admin/auth";
import { draftAssetSourceSchema } from "@/lib/content/types";
import { uploadPostAsset } from "@/lib/services/blob-store";

export async function POST(request: Request) {
  try {
    await requireAdminApi();
    const formData = await request.formData();
    const file = formData.get("file");
    const slug = String(formData.get("slug") ?? "draft");
    const source = draftAssetSourceSchema.parse(formData.get("source") ?? "content");

    if (!(file instanceof File)) {
      return fail("Image file is required");
    }

    if (!file.type.startsWith("image/")) {
      return fail("Only image uploads are supported");
    }

    return ok(
      await uploadPostAsset({
        slug,
        file,
        filename: file.name,
        source,
      }),
    );
  } catch (error) {
    return fail(getErrorMessage(error), error instanceof Error && error.message === "Unauthorized" ? 401 : 400);
  }
}
