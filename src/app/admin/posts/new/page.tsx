import { AdminNav } from "@/components/admin/AdminNav";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin/auth";

export default async function NewPostPage() {
  await requireAdmin();

  return (
    <>
      <AdminNav />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">Editor</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">新建草稿</h1>
        <p className="mt-2 text-muted">保存草稿会写入 Vercel Blob，不会触发部署。</p>
        <div className="mt-8">
          <PostEditor />
        </div>
      </main>
    </>
  );
}
