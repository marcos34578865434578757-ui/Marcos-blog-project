import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import { MaterializeDraftButton } from "@/components/admin/MaterializeDraftButton";
import { requireAdmin } from "@/lib/admin/auth";
import { getPublishedPosts } from "@/lib/content/posts";
import { normalizeCategory } from "@/lib/content/types";
import { listDraftsWithPathnames } from "@/lib/services/blob-store";

function getStatusMessage(deleted?: string | string[]) {
  const value = Array.isArray(deleted) ? deleted[0] : deleted;
  if (!value) return null;
  if (value.startsWith("draft-")) return "草稿已删除。";
  if (value.startsWith("published-")) return "已发布文章已删除，等待 Vercel 同步最新部署。";
  return null;
}

export default async function AdminPostsPage(props: { searchParams: Promise<{ deleted?: string | string[] }> }) {
  await requireAdmin();
  const searchParams = await props.searchParams;
  const [published, drafts] = await Promise.all([getPublishedPosts(), listDraftsWithPathnames()]);
  const statusMessage = getStatusMessage(searchParams.deleted);

  return (
    <>
      <AdminNav />
      <main className="editor-page">
        <div className="mx-auto w-full max-w-7xl px-5 py-8">
          <section className="editor-card p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-accent">Library</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">文章管理</h1>
                <p className="mt-2 text-muted">草稿来自 Vercel Blob，已发布文章来自仓库内容。</p>
              </div>
              <Link className="editor-primary-button" href="/admin/posts/new">
                <Plus size={16} />
                新建草稿
              </Link>
            </div>
            {statusMessage ? <p className="mt-5 text-sm text-accent-strong">{statusMessage}</p> : null}
          </section>

          <section className="editor-card mt-8 overflow-hidden p-0">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-white/45 text-muted">
                <tr>
                  <th className="px-5 py-4">标题</th>
                  <th className="px-5 py-4">状态</th>
                  <th className="px-5 py-4">日期</th>
                  <th className="px-5 py-4">分类</th>
                  <th className="px-5 py-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {drafts.map((post) => (
                  <tr key={`draft-${post.slug}`} className="border-t border-white/55 hover:bg-white/25">
                    <td className="px-5 py-4 font-medium">{post.title}</td>
                    <td className="px-5 py-4">
                      <span className="status-pill">draft</span>
                    </td>
                    <td className="px-5 py-4 text-muted">{new Date(post.date).toLocaleDateString("zh-CN")}</td>
                    <td className="px-5 py-4 text-muted">{normalizeCategory(post.category)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <Link className="font-medium text-accent hover:text-accent-strong" href={`/admin/posts/${post.slug}/edit`}>
                          编辑
                        </Link>
                        <DeletePostButton kind="draft" slug={post.slug} pathname={post._pathname} />
                      </div>
                    </td>
                  </tr>
                ))}
                {published.map((post) => (
                  <tr key={`published-${post.slug}`} className="border-t border-white/55 hover:bg-white/25">
                    <td className="px-5 py-4 font-medium">{post.title}</td>
                    <td className="px-5 py-4">
                      <span className="status-pill">published</span>
                    </td>
                    <td className="px-5 py-4 text-muted">{new Date(post.date).toLocaleDateString("zh-CN")}</td>
                    <td className="px-5 py-4 text-muted">{normalizeCategory(post.category)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <Link className="font-medium text-accent hover:text-accent-strong" href={`/posts/${post.slug}`}>
                          查看
                        </Link>
                        <MaterializeDraftButton slug={post.slug} />
                        <DeletePostButton kind="published" slug={post.slug} />
                      </div>
                    </td>
                  </tr>
                ))}
                {drafts.length + published.length === 0 ? (
                  <tr>
                    <td className="px-5 py-10 text-muted" colSpan={5}>
                      暂无文章。
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </>
  );
}
