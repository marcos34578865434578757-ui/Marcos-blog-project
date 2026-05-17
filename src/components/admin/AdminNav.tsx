import Link from "next/link";
import type { ReactNode } from "react";
import { FileText, Home, Import, LogOut, PenLine } from "lucide-react";

export function AdminNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/55 bg-[rgba(248,252,246,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link className="flex items-center gap-3 font-semibold text-foreground" href="/admin">
          <span className="grid size-9 place-items-center rounded-2xl border border-white/70 bg-white/55 text-sm shadow-[0_12px_32px_rgba(71,110,91,0.12)]">
            C
          </span>
          Marcos CMS
        </Link>
        <nav className="flex items-center gap-1 text-sm text-muted">
          <NavLink href="/admin/posts" icon={<FileText size={16} />} label="文章" />
          <NavLink href="/admin/posts/new" icon={<PenLine size={16} />} label="新建" />
          <NavLink href="/admin/import" icon={<Import size={16} />} label="导入" />
          <NavLink href="/" icon={<Home size={16} />} label="站点" />
          <form action="/api/admin/logout" method="post">
            <button className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-white/55 hover:text-foreground" type="submit">
              <LogOut size={16} />
              退出
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-white/55 hover:text-foreground" href={href}>
      {icon}
      {label}
    </Link>
  );
}
