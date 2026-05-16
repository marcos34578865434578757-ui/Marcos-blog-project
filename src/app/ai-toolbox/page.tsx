import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "AI 工具箱",
};

const tools = [
  "文章导入与清洗",
  "标题和摘要生成",
  "写作提纲拆解",
  "图片与素材整理",
];

export default function AiToolboxPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-12">
        <section className="soft-panel p-8">
          <div className="mb-5 flex size-11 items-center justify-center rounded-md bg-accent-soft text-accent-strong">
            <Sparkles size={21} />
          </div>
          <p className="text-sm uppercase tracking-[0.18em] text-accent">AI Toolbox</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">AI 工具箱</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">沉淀常用 AI 工具、提示词和自动化流程，让写作与发布更顺手。</p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {tools.map((tool, index) => (
            <article
              key={tool}
              className="stagger-card rounded-md border border-line bg-surface p-5 hover:border-accent hover:bg-surface-soft"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="status-pill">Tool</span>
              <h2 className="mt-4 text-xl font-semibold">{tool}</h2>
              <p className="mt-3 leading-7 text-muted">后续可以补充使用场景、提示词模板和相关自动化脚本。</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
