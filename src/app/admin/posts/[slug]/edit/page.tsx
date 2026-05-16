import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin/auth";
import { getDraft } from "@/lib/services/blob-store";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const draft = await getDraft(slug);
  if (!draft) notFound();

  return (
    <>
      <AdminNav />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">Editor</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">编辑草稿</h1>
        <p className="mt-2 text-muted">发布后会写入 GitHub 并触发 Vercel 构建。</p>
        <div className="mt-8">
          <PostEditor initialDraft={draft} />
        </div>
      </main>
    </>
  );
}
