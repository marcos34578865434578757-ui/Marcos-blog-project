import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="size-9 rounded-md border border-line object-cover transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            src="/avatar.png"
            alt="Marcos avatar"
          />
          <span className="transition-colors duration-200 group-hover:text-accent-strong">Marcos Notes</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm text-muted">
          <Link className="rounded-md px-3 py-2 transition-all duration-200 hover:bg-accent-soft hover:text-accent-strong hover:scale-105 active:scale-95" href="/posts">
            文章
          </Link>
          <Link className="rounded-md px-3 py-2 transition-all duration-200 hover:bg-accent-soft hover:text-accent-strong hover:scale-105 active:scale-95" href="/about">
            关于
          </Link>
          <Link className="rounded-md px-3 py-2 transition-all duration-200 hover:bg-accent-soft hover:text-accent-strong hover:scale-105 active:scale-95" href="/admin">
            后台
          </Link>
        </nav>
      </div>
    </header>
  );
}
