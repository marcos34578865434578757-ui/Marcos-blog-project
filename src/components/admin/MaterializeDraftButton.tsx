"use client";

import { Loader2, PenSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MaterializeDraftButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function onClick() {
    setIsLoading(true);
    setError("");

    const response = await fetch(`/api/admin/posts/${slug}`, { method: "POST" });
    const result = await response.json();
    setIsLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Unable to create draft");
      return;
    }

    router.push(`/admin/posts/${result.data.draft.slug}/edit`);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => void onClick()}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" size={15} /> : <PenSquare size={15} />}
        编辑
      </button>
      {error ? <p className="text-xs text-warn">{error}</p> : null}
    </div>
  );
}
