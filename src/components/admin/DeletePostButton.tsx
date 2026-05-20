"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeletePostButtonProps = {
  slug: string;
  kind: "draft" | "published";
  pathname?: string;
};

export function DeletePostButton({ slug, kind, pathname }: DeletePostButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function onDelete() {
    const label = kind === "draft" ? "这篇草稿" : "这篇已发布文章";
    if (!window.confirm(`确定要删除${label}吗？此操作不可恢复。`)) return;

    setIsDeleting(true);
    setError("");

    const deleteUrl = kind === "draft"
      ? `/api/admin/drafts/${slug}${pathname ? `?pathname=${encodeURIComponent(pathname)}` : ""}`
      : `/api/admin/posts/${slug}`;
    const response = await fetch(deleteUrl, { method: "DELETE" });
    const result = await response.json();
    setIsDeleting(false);

    if (!result.ok) {
      setError(result.error ?? "Delete failed");
      return;
    }

    router.replace(`/admin/posts?deleted=${kind}-${slug}`);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        className="inline-flex items-center gap-2 text-sm font-medium text-warn transition hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        onClick={() => void onDelete()}
        disabled={isDeleting}
      >
        {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
        删除
      </button>
      {error ? <p className="text-xs text-warn">{error}</p> : null}
    </div>
  );
}
