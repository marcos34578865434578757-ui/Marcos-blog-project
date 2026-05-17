"use client";

import { ImagePlus, Loader2 } from "lucide-react";

export function CoverUploader(props: {
  cover: string;
  disabled?: boolean;
  isUploading?: boolean;
  onOpenPicker: () => void;
  onChangeUrl: (value: string) => void;
}) {
  return (
    <section className="editor-card space-y-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">封面</h2>
          <p className="mt-1 text-sm text-muted">上传封面后会写入文章的 `cover` 字段。</p>
        </div>
      </div>

      <button
        type="button"
        className="group flex min-h-64 w-full items-center justify-center overflow-hidden rounded-[24px] border border-white/70 bg-white/40 text-muted shadow-[0_18px_56px_rgba(71,110,91,0.12)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/55 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={props.onOpenPicker}
        disabled={props.disabled || props.isUploading}
      >
        {props.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={props.cover} alt="封面预览" className="h-full min-h-64 w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-3">
            {props.isUploading ? <Loader2 className="animate-spin" size={26} /> : <ImagePlus size={30} />}
            <span className="text-sm font-medium">{props.isUploading ? "上传中..." : "点击上传封面"}</span>
          </div>
        )}
      </button>

      <label className="block space-y-2 text-sm">
        <span className="font-medium text-muted">封面 URL</span>
        <input
          className="editor-input"
          value={props.cover}
          onChange={(event) => props.onChangeUrl(event.target.value)}
          placeholder="https://example.com/cover.png"
        />
      </label>
    </section>
  );
}
