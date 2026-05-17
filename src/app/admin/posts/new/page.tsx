import { AdminNav } from "@/components/admin/AdminNav";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminCapabilities } from "@/lib/admin/health";

export default async function NewPostPage() {
  await requireAdmin();

  return (
    <>
      <AdminNav />
      <main className="editor-page">
        <div className="mx-auto w-full max-w-7xl px-5 py-8">
          <PostEditor initialCapabilities={getAdminCapabilities()} mode="new" />
        </div>
      </main>
    </>
  );
}
