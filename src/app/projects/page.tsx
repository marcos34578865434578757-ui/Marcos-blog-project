import type { Metadata } from "next";
import { Boxes } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "项目展示",
};

const projects = [
  {
    title: "Personal Blog CMS",
    body: "Vercel-first 的个人博客与轻量后台，支持 Markdown 导入、Blob 草稿和 GitHub 发布。",
    status: "Building",
  },
  {
    title: "Writing Workflow",
    body: "围绕 Obsidian、飞书和 Markdown 的长期写作迁移流程。",
    status: "Planning",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-12">
        <section className="soft-panel p-8">
          <div className="mb-5 flex size-11 items-center justify-center rounded-md bg-accent-soft text-accent-strong">
            <Boxes size={21} />
          </div>
          <p className="text-sm uppercase tracking-[0.18em] text-accent">Projects</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">项目展示</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">这里会整理正在推进的产品、网站和自动化实验。</p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="stagger-card rounded-md border border-line bg-surface p-5 hover:border-accent hover:bg-surface-soft"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="status-pill">{project.status}</span>
              <h2 className="mt-4 text-xl font-semibold">{project.title}</h2>
              <p className="mt-3 leading-7 text-muted">{project.body}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
