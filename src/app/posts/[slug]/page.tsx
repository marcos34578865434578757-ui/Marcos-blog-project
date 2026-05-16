import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarkdownBody } from "@/components/markdown/MarkdownBody";
import { SiteHeader } from "@/components/SiteHeader";
import { extractHeadings } from "@/lib/content/markdown";
import { getPublishedPost, getPublishedPosts } from "@/lib/content/posts";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.cover ? [post.cover] : undefined,
      type: "article",
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  const headings = extractHeadings(post.content);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_250px]">
        <article>
          <Link className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent" href="/posts">
            <ArrowLeft size={16} />
            返回文章列表
          </Link>
          <header className="mt-6 border-b border-line pb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-strong">{post.category}</span>
              <time dateTime={post.date}>{post.date}</time>
              <span>{post.readingTime} min read</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{post.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{post.description}</p>
            {post.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="mt-8 aspect-[16/9] w-full rounded-md border border-line object-cover" src={post.cover} alt="" />
            ) : null}
          </header>
          <div className="prose-blog mt-8 max-w-3xl rounded-md bg-surface/60">
            <MarkdownBody content={post.content} />
          </div>
        </article>

        {headings.length > 0 ? (
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-md border border-line bg-surface p-5 text-sm">
              <p className="mb-3 font-semibold">目录</p>
              <nav className="space-y-2 text-muted">
                {headings.map((heading) => (
                  <a
                    key={`${heading.id}-${heading.text}`}
                    className={`block hover:text-accent ${heading.level === 3 ? "pl-4" : ""}`}
                    href={`#${heading.id}`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        ) : null}
      </main>
    </>
  );
}
