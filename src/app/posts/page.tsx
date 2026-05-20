import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { SiteHeader } from "@/components/SiteHeader";
import { categoryToQueryValue } from "@/lib/content/categories";
import { getPublicCategories, getPublishedPosts, getTags, resolvePostsCategoryFilter } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "文章",
  description: "浏览已发布文章，并按分类或标签筛选。",
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = resolvePostsCategoryFilter(params.category);
  const [allPosts, categories, tags] = await Promise.all([getPublishedPosts(), getPublicCategories(), getTags()]);
  const posts = allPosts.slice(0, 6);
  const filtered = posts.filter((post) => {
    const categoryOk = activeCategory ? post.category === activeCategory : true;
    const tagOk = params.tag ? post.tags.includes(params.tag) : true;
    return categoryOk && tagOk;
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10 md:py-12">
        <header className="soft-panel p-7">
          <p className="text-sm uppercase tracking-[0.18em] text-accent">Archive</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">文章</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">浏览已发布的文章，分类和标签过滤可以一起使用。</p>
        </header>

        <section className="grid gap-8 py-10 md:grid-cols-[260px_1fr]">
          <aside className="space-y-6">
            <FilterGroup title="分类" items={categories} param="category" active={activeCategory} />
            <FilterGroup title="标签" items={tags} param="tag" active={params.tag} />
          </aside>
          <div className="soft-panel p-6">
            {filtered.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filtered.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-muted">没有匹配的已发布文章。</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function FilterGroup({
  title,
  items,
  param,
  active,
}: {
  title: string;
  items: string[];
  param: string;
  active?: string | null;
}) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const value = param === "category" ? categoryToQueryValue(item) : item;
          const isActive = active === item || active === value;

          return (
            <Link
              key={`${param}-${item}`}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                isActive
                  ? "border-accent bg-accent-soft text-accent-strong"
                  : "border-line bg-background text-muted hover:border-accent hover:text-foreground"
              }`}
              href={`/posts?${param}=${encodeURIComponent(value)}`}
            >
              {item}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
