import Link from "next/link";
import type { ReactNode } from "react";
import { FileText, Home, Import, LogOut, PenLine } from "lucide-react";

export function AdminNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link className="flex items-center gap-3 font-semibold" href="/admin">
          <span className="grid size-8 place-items-center rounded-md bg-accent text-sm text-white">C</span>
          Marcos CMS
        </Link>
        <nav className="flex items-center gap-1 text-sm text-muted">
          <NavLink href="/admin/posts" icon={<FileText size={16} />} label="文章" />
          <NavLink href="/admin/posts/new" icon={<PenLine size={16} />} label="新建" />
          <NavLink href="/admin/import" icon={<Import size={16} />} label="导入" />
          <NavLink href="/" icon={<Home size={16} />} label="站点" />
          <form action="/api/admin/logout" method="post">
            <button className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent-soft hover:text-foreground" type="submit">
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
    <Link className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent-soft hover:text-foreground" href={href}>
      {icon}
      {label}
    </Link>
  );
}
