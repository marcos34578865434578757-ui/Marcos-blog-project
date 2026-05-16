"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ImportForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsLoading(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/admin/import", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    setIsLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Import failed");
      return;
    }

    const unresolved = result.data.unresolvedAssets?.length
      ? `，但有 ${result.data.unresolvedAssets.length} 个本地图片未匹配`
      : "";
    setMessage(`已创建草稿${unresolved}`);
    router.push(`/admin/posts/${result.data.draft.slug}/edit`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="soft-panel max-w-xl space-y-5 p-6">
      <div>
        <label className="block text-sm font-medium text-muted" htmlFor="file">
          Markdown 或 zip 文件
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".md,.mdx,.zip"
          required
          className="field-control mt-2"
        />
      </div>
      {error ? <p className="text-sm text-warn">{error}</p> : null}
      {message ? <p className="text-sm text-accent">{message}</p> : null}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
      >
        <Upload size={16} />
        {isLoading ? "导入中..." : "导入为草稿"}
      </button>
    </form>
  );
}
