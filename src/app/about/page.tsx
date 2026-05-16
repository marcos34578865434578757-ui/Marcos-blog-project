import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "关于",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-5 py-12">
        <section className="soft-panel p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.18em] text-accent">About</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight">关于这个站点</h1>
          <div className="prose-blog mt-8 max-w-3xl">
            <p>
              这是一个面向长期写作的个人博客和轻量 CMS。公开站点保持清爽，后台优先服务导入、编辑、预览和发布。
            </p>
            <p>
              V1 的技术选择是 Vercel + GitHub + Vercel Blob：草稿留在 Blob，发布时写入 GitHub，随后由 Vercel 自动构建。
            </p>
            <p>
              后续可以继续增强飞书导入保真度、文章版本历史、图片清理、白名单 MDX 组件和更多内容归档方式。
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
