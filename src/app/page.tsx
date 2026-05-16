import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, Boxes, Leaf, Route, Sparkles } from "lucide-react";
import { AnimatedHeroSubtitle } from "@/components/AnimatedHeroSubtitle";
import { AnimatedHeroTitle } from "@/components/AnimatedHeroTitle";
import { PostCard } from "@/components/PostCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getCategories, getPublishedPosts } from "@/lib/content/posts";

export default async function HomePage() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const latest = posts.slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10 md:py-14">
        <section className="grid min-h-[520px] items-center gap-10 border-b border-line pb-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm text-accent-strong">
              <Leaf size={15} />
              淡绿色个人写作空间
            </p>
            <AnimatedHeroTitle text="Marcos Notes" />
            <AnimatedHeroSubtitle />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" href="/posts">
                阅读文章
                <ArrowRight size={16} />
              </Link>
              <Link className="btn-secondary" href="/admin">
                进入后台
              </Link>
            </div>
          </div>

          <aside className="soft-panel p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Feature
                icon={<BookOpen size={18} />}
                title="最新文章"
                body="阅读最近发布的笔记、文章和构建记录。"
                href="/posts"
                delay={0}
              />
              <Feature
                icon={<Boxes size={18} />}
                title="项目展示"
                body="整理正在做和已经完成的产品、网站与实验。"
                href="/projects"
                delay={80}
              />
              <Feature
                icon={<Route size={18} />}
                title="学习路线"
                body="记录技术、产品和写作方向的阶段性路线。"
                href="/learning"
                delay={160}
              />
              <Feature
                icon={<Sparkles size={18} />}
                title="AI 工具箱"
                body="沉淀常用 AI 工具、提示词和自动化流程。"
                href="/ai-toolbox"
                delay={240}
              />
            </div>
          </aside>
        </section>

        <section className="grid gap-10 py-12 md:grid-cols-[0.32fr_0.68fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">Latest</p>
            <h2 className="mt-2 text-2xl font-semibold">最新文章</h2>
            <p className="mt-3 text-sm leading-6 text-muted">这里只展示已发布内容，后台草稿不会公开。</p>
          </div>
          <div className="soft-panel p-6">
            {latest.length > 0 ? (
              latest.map((post) => <PostCard key={post.slug} post={post} />)
            ) : (
              <p className="text-muted">还没有发布文章。可以先进入后台导入 Markdown，发布后会出现在这里。</p>
            )}
          </div>
        </section>

        {categories.length > 0 ? (
          <section className="border-t border-line pt-10">
            <p className="text-sm uppercase tracking-[0.18em] text-accent">Topics</p>
            <h2 className="mt-2 text-2xl font-semibold">分类</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link key={category} className="btn-secondary" href={`/posts?category=${encodeURIComponent(category)}`}>
                  {category}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}

function Feature({
  icon,
  title,
  body,
  href,
  delay,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  href: string;
  delay: number;
}) {
  return (
    <Link
      className="stagger-card glass-card rounded-md p-4 hover:border-accent"
      href={href}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-3 flex size-9 items-center justify-center rounded-md bg-accent-soft text-accent-strong">{icon}</div>
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </Link>
  );
}
