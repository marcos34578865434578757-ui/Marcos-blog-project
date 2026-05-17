import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, FileText, Import, PenLine } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin/auth";
import { getPublishedPosts } from "@/lib/content/posts";
import { listDrafts } from "@/lib/services/blob-store";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [published, drafts] = await Promise.all([getPublishedPosts(), listDrafts()]);

  return (
    <>
      <AdminNav />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <section className="soft-panel p-7">
          <p className="text-sm uppercase tracking-[0.18em] text-accent">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">内容后台</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted">
            草稿保存到 Vercel Blob，点击发布时才会写入 GitHub，并触发线上部署。
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Stat label="已发布" value={published.length} />
          <Stat label="草稿" value={drafts.length} />
          <Stat label="总文章" value={published.length + drafts.length} />
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <AdminAction href="/admin/posts" icon={<FileText size={20} />} title="管理文章" body="查看 Blob 草稿和仓库中的已发布文章。" />
          <AdminAction href="/admin/posts/new" icon={<PenLine size={20} />} title="新建草稿" body="用 Markdown 开始写一篇新文章。" />
          <AdminAction href="/admin/import" icon={<Import size={20} />} title="导入文章" body="上传 md、mdx 或单篇 zip 包。" />
        </section>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-mono text-4xl font-semibold text-accent-strong">{value}</p>
    </div>
  );
}

function AdminAction({ href, icon, title, body }: { href: string; icon: ReactNode; title: string; body: string }) {
  return (
    <Link className="group rounded-md border border-line bg-surface p-5 hover:border-accent hover:bg-surface-soft" href={href}>
      <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-accent-soft text-accent-strong">{icon}</div>
      <h2 className="flex items-center justify-between font-semibold">
        {title}
        <ArrowRight className="text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" size={16} />
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </Link>
  );
}
