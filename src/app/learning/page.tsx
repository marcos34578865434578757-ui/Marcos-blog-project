import type { Metadata } from "next";
import { Route } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "学习路线",
};

const tracks = ["Next.js 与部署", "Markdown 内容工程", "AI 辅助写作", "产品与设计审美"];

export default function LearningPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-12">
        <section className="soft-panel p-8">
          <div className="mb-5 flex size-11 items-center justify-center rounded-md bg-accent-soft text-accent-strong">
            <Route size={21} />
          </div>
          <p className="text-sm uppercase tracking-[0.18em] text-accent">Learning</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">学习路线</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">用路线图的方式整理长期学习主题，后续可以和文章、项目互相连接。</p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {tracks.map((track, index) => (
            <article
              key={track}
              className="stagger-card rounded-md border border-line bg-surface p-5 hover:border-accent hover:bg-surface-soft"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="status-pill">Track {index + 1}</span>
              <h2 className="mt-4 text-xl font-semibold">{track}</h2>
              <p className="mt-3 leading-7 text-muted">记录目标、资料、实践任务和阶段复盘。</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
