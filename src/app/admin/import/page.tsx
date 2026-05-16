import { AdminNav } from "@/components/admin/AdminNav";
import { ImportForm } from "@/components/admin/ImportForm";
import { requireAdmin } from "@/lib/admin/auth";

export default async function ImportPage() {
  await requireAdmin();

  return (
    <>
      <AdminNav />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <section className="soft-panel p-7">
          <p className="text-sm uppercase tracking-[0.18em] text-accent">Import</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">导入文章</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted">
            支持单个 md/mdx 文件，或一篇文章一个 zip 包。zip 内的本地图片会上传到 Vercel Blob 并改写引用。
          </p>
        </section>
        <div className="mt-8">
          <ImportForm />
        </div>
      </main>
    </>
  );
}
