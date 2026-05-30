import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, Boxes, Leaf, Route, Sparkles } from "lucide-react";
import { AnimatedHeroSubtitle } from "@/components/AnimatedHeroSubtitle";
import { AnimatedHeroTitle } from "@/components/AnimatedHeroTitle";
import { PostCard } from "@/components/PostCard";
import { SiteHeader } from "@/components/SiteHeader";
import { categoryToQueryValue } from "@/lib/content/categories";
import { getPublicCategories, getPublishedPosts, getTags } from "@/lib/content/posts";

const HOME_CATEGORY_LIMIT = 10;

export default async function HomePage() {
  const [posts, categories, tags] = await Promise.all([
    getPublishedPosts(),
    getPublicCategories(),
    getTags(),
  ]);
  const latest = posts.slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10 md:py-14">
        <section className="grid min-h-[520px] items-center gap-10 border-b border-line pb-12 md:grid-cols-[1fr_1.05fr]">
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
            </div>
          </div>

          <aside className="soft-panel self-start p-6 md:-mt-8 md:ml-5 md:min-h-[29rem]">
            <div className="grid gap-4 sm:grid-cols-2">
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

        {(categories.length > 0 || tags.length > 0) ? (
          <section className="border-b border-line py-10 md:py-12">
            <div className="grid gap-8 md:grid-cols-[240px_1fr]">
              {/* 分类子版块 */}
              {categories.length > 0 ? (
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-accent">Topics</p>
                  <h2 className="mt-2 text-2xl font-semibold">分类</h2>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        className="btn-secondary w-full justify-start text-left"
                        href={`/posts?category=${encodeURIComponent(categoryToQueryValue(category))}`}
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* 标签子版块 */}
              {tags.length > 0 ? (
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-accent">Tags</p>
                  <h2 className="mt-2 text-2xl font-semibold">标签</h2>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {tags.map((tag) => (
                      <Link
                        key={tag}
                        className="status-pill text-sm py-1.5 px-3.5 hover:border-accent hover:text-accent-strong"
                        href={`/posts?tag=${encodeURIComponent(tag)}`}
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="py-12">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.18em] text-accent">Latest</p>
            <h2 className="mt-2 text-2xl font-semibold">最新文章</h2>
          </div>
          {latest.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {latest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="soft-panel p-6">
              <p className="text-muted">还没有发布文章。先去后台创建或导入内容，发布后就会出现在这里。</p>
            </div>
          )}
        </section>
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
      className="stagger-card glass-card min-h-[12rem] rounded-md p-5 hover:border-accent"
      href={href}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-accent-soft text-accent-strong">{icon}</div>
      <h2 className="text-[1.05rem] font-semibold">{title}</h2>
      <p className="mt-3 text-[0.95rem] leading-7 text-muted">{body}</p>
    </Link>
  );
}
