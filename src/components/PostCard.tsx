import Image from "next/image";
import Link from "next/link";
import type { PublishedPost } from "@/lib/content/types";

export function PostCard({ post }: { post: PublishedPost }) {
  return (
    <article className="group relative overflow-hidden rounded-md border border-white/50 bg-surface/50 backdrop-blur-sm shadow-[0_8px_32px_rgba(71,110,91,0.08)] transition hover:border-accent/60 hover:shadow-[0_12px_40px_rgba(71,110,91,0.14)]">
      <div className="absolute inset-0 rounded-md border border-white/40 pointer-events-none" />
      {post.cover ? (
        <div className="relative mx-4 mt-4 aspect-[16/9] overflow-hidden rounded-lg">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : null}
      <div className="p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-strong">{post.category}</span>
          <time dateTime={post.date}>{post.date}</time>
          <span>{post.readingTime} min read</span>
        </div>
        <h2 className="text-xl font-semibold tracking-tight">
          <Link className="group-hover:text-accent" href={`/posts/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">{post.description}</p>
        {post.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="status-pill">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
