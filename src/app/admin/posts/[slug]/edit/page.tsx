import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminCapabilities } from "@/lib/admin/health";
import { getAdminCategories } from "@/lib/content/posts";
import { getDraft } from "@/lib/services/blob-store";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const [draft, categories] = await Promise.all([getDraft(slug), getAdminCategories()]);

  return (
    <>
      <AdminNav />
      <main className="editor-page">
        <div className="mx-auto w-full max-w-7xl px-5 py-8">
          {draft ? (
            <PostEditor
              initialCapabilities={getAdminCapabilities()}
              initialCategories={categories}
              initialDraft={draft}
              mode="edit"
            />
          ) : (
            <section className="editor-card mx-auto max-w-3xl space-y-5 p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-accent">Draft missing</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">草稿不存在或暂时不可读</h1>
                <p className="mt-3 max-w-2xl leading-7 text-muted">
                  没有找到 slug 为 <span className="font-mono text-foreground">{slug}</span> 的草稿。它可能已被删除、导入未成功落库，或者已经迁移到新的 slug。
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link className="editor-primary-button" href="/admin/posts">
                  返回文章管理
                </Link>
                <Link className="editor-action-button" href="/admin/posts/new">
                  新建草稿
                </Link>
                <Link className="editor-action-button" href="/admin/import">
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
