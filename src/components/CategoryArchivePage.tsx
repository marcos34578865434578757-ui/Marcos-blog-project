import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { SiteHeader } from "@/components/SiteHeader";
import { categoryToQueryValue } from "@/lib/content/categories";
import type { PublishedPost } from "@/lib/content/types";

export function CategoryArchivePage(props: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  posts: PublishedPost[];
  emptyTitle: string;
  emptyBody: string;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-12">
        <section className="soft-panel p-8">
          <div className="mb-5 flex size-11 items-center justify-center rounded-md bg-accent-soft text-accent-strong">
            {props.icon}
          </div>
          <p className="text-sm uppercase tracking-[0.18em] text-accent">{props.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{props.title}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">{props.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn-secondary" href="/">
              <ArrowLeft size={16} />
              返回首页
            </Link>
            <Link className="btn-primary" href={`/posts?category=${encodeURIComponent(categoryToQueryValue(props.title))}`}>
              查看全部相关文章
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section className="mt-8 soft-panel p-6">
          {props.posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {props.posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="space-y-3 py-4">
              <h2 className="text-xl font-semibold">{props.emptyTitle}</h2>
              <p className="max-w-2xl leading-7 text-muted">{props.emptyBody}</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
