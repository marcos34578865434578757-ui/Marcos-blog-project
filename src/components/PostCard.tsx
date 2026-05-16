import Link from "next/link";
import type { PublishedPost } from "@/lib/content/types";

export function PostCard({ post }: { post: PublishedPost }) {
  return (
    <article className="group border-b border-line py-7 first:pt-0">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-strong">{post.category}</span>
        <time dateTime={post.date}>{post.date}</time>
        <span>{post.readingTime} min read</span>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">
        <Link className="group-hover:text-accent" href={`/posts/${post.slug}`}>
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-muted">{post.description}</p>
      {post.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="status-pill">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
