import { LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdminSession } from "@/lib/admin/auth";

export default async function LoginPage() {
  if (await isAdminSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <section className="soft-panel w-full max-w-sm p-6">
        <div className="mb-5 flex size-11 items-center justify-center rounded-md bg-accent-soft text-accent-strong">
          <LockKeyhole size={20} />
        </div>
        <p className="text-sm uppercase tracking-[0.18em] text-accent">Admin</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">登录后台</h1>
        <p className="mt-3 text-sm leading-6 text-muted">使用环境变量 ADMIN_PASSWORD 配置的密码登录。</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
