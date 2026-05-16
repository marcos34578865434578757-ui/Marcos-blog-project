"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = await response.json();
    setIsLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Login failed");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium" htmlFor="password">
        管理员密码
      </label>
      <input
        id="password"
        className="field-control"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
      />
      {error ? <p className="text-sm text-warn">{error}</p> : null}
      <button
        className="btn-primary w-full"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "登录中..." : "登录"}
      </button>
    </form>
  );
}
