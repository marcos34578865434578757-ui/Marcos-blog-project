import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="size-9 rounded-md border border-line object-cover"
            src="/avatar.png"
            alt="Marcos avatar"
          />
          <span>Marcos Notes</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm text-muted">
          <Link className="rounded-md px-3 py-2 hover:bg-accent-soft hover:text-foreground" href="/posts">
            文章
          </Link>
          <Link className="rounded-md px-3 py-2 hover:bg-accent-soft hover:text-foreground" href="/about">
            关于
          </Link>
          <Link className="rounded-md px-3 py-2 hover:bg-accent-soft hover:text-foreground" href="/admin">
            后台
          </Link>
        </nav>
      </div>
    </header>
  );
}
