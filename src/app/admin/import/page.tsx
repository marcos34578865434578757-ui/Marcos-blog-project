import { AdminNav } from "@/components/admin/AdminNav";
import { ImportForm } from "@/components/admin/ImportForm";
import { requireAdmin } from "@/lib/admin/auth";

export default async function ImportPage() {
  await requireAdmin();

  return (
    <>
      <AdminNav />
      <main className="editor-page">
        <div className="mx-auto w-full max-w-7xl px-5 py-8">
          <section className="editor-card max-w-4xl p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-accent">Import</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">导入文章</h1>
            <p className="mt-3 max-w-2xl leading-7 text-muted">
              支持单个 md/mdx 文件，或包含正文与本地图片的 zip 包。导入成功后会自动创建草稿，并进入编辑页。
            </p>
          </section>

          <div className="mt-8">
            <ImportForm />
          </div>
        </div>
      </main>
    </>
  );
}
