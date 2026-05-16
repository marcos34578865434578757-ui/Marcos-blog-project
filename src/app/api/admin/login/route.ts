import { fail, getErrorMessage, ok } from "@/lib/admin/api";
import { setSessionCookie, verifyPassword } from "@/lib/admin/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    if (!body.password || !verifyPassword(body.password)) {
      return fail("Password is incorrect", 401);
    }

    await setSessionCookie();
    return ok({ authenticated: true });
  } catch (error) {
    return fail(getErrorMessage(error), 500);
  }
}
