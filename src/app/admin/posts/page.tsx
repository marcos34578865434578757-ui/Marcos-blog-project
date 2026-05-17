import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import { requireAdmin } from "@/lib/admin/auth";
import { getPublishedPosts } from "@/lib/content/posts";
import { listDrafts } from "@/lib/services/blob-store";

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
  const [published, drafts] = await Promise.all([getPublishedPosts(), listDrafts()]);
  const statusMessage = getStatusMessage(searchParams.deleted);

  return (
    <>
      <AdminNav />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">Library</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">文章管理</h1>
            <p className="mt-2 text-muted">草稿存放在 Vercel Blob，已发布文章来自仓库内容。</p>
          </div>
          <Link className="btn-primary" href="/admin/posts/new">
            <Plus size={16} />
            新建草稿
          </Link>
        </div>

        {statusMessage ? (
          <p className="mt-6 rounded-md border border-accent bg-accent-soft px-4 py-3 text-sm text-accent-strong">
            {statusMessage}
          </p>
        ) : null}

        <section className="mt-8 overflow-hidden rounded-md border border-line bg-surface">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-surface-strong text-muted">
              <tr>
                <th className="px-4 py-3">标题</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3">日期</th>
                <th className="px-4 py-3">分类</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((post) => (
                <tr key={`draft-${post.slug}`} className="border-t border-line hover:bg-surface-soft">
                  <td className="px-4 py-4 font-medium">{post.title}</td>
                  <td className="px-4 py-4">
                    <span className="status-pill">draft</span>
                  </td>
                  <td className="px-4 py-4 text-muted">{post.date}</td>
                  <td className="px-4 py-4 text-muted">{post.category}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <Link className="font-medium text-accent hover:text-accent-strong" href={`/admin/posts/${post.slug}/edit`}>
                        编辑
                      </Link>
                      <DeletePostButton kind="draft" slug={post.slug} />
                    </div>
                  </td>
                </tr>
              ))}
              {published.map((post) => (
                <tr key={`published-${post.slug}`} className="border-t border-line hover:bg-surface-soft">
                  <td className="px-4 py-4 font-medium">{post.title}</td>
                  <td className="px-4 py-4">
                    <span className="status-pill">published</span>
                  </td>
                  <td className="px-4 py-4 text-muted">{post.date}</td>
                  <td className="px-4 py-4 text-muted">{post.category}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <Link className="font-medium text-accent hover:text-accent-strong" href={`/posts/${post.slug}`}>
                        查看
                      </Link>
                      <DeletePostButton kind="published" slug={post.slug} />
                    </div>
                  </td>
                </tr>
              ))}
              {drafts.length + published.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-muted" colSpan={5}>
                    暂无文章。
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
