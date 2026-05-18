import { AdminNav } from "@/components/admin/AdminNav";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminCapabilities } from "@/lib/admin/health";
import { getAdminCategories } from "@/lib/content/posts";

export default async function NewPostPage() {
  await requireAdmin();
  const categories = await getAdminCategories();

  return (
    <>
      <AdminNav />
      <main className="editor-page">
        <div className="mx-auto w-full max-w-7xl px-5 py-8">
          <PostEditor initialCapabilities={getAdminCapabilities()} initialCategories={categories} mode="new" />
        </div>
      </main>
    </>
  );
}
