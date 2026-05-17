import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin/auth";
import { getDraft } from "@/lib/services/blob-store";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const draft = await getDraft(slug);

  return (
    <>
      <AdminNav />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">Editor</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{draft ? "编辑草稿" : "草稿不存在"}</h1>
        <p className="mt-2 text-muted">
          {draft ? "发布后会写入 GitHub 并触发 Vercel 构建。" : "这个草稿可能已被删除，或导入尚未成功落库。"}
        </p>

        <div className="mt-8">
          {draft ? (
            <PostEditor initialDraft={draft} />
          ) : (
            <section className="soft-panel max-w-2xl space-y-4 p-6">
              <p className="text-sm leading-7 text-muted">
                没有找到 slug 为 <span className="font-mono text-foreground">{slug}</span> 的草稿。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link className="btn-primary" href="/admin/posts">
                  返回文章管理
                </Link>
                <Link className="btn-secondary" href="/admin/import">
                  重新导入
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
