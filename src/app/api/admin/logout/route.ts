import { redirect } from "next/navigation";
import { clearSessionCookie } from "@/lib/admin/auth";

export async function POST() {
  await clearSessionCookie();
  redirect("/admin/login");
}
