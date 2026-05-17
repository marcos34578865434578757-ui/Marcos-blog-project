"use client";

import { Copy, Images, WandSparkles } from "lucide-react";
import type { DraftAsset } from "@/lib/content/types";

function sourceLabel(source: DraftAsset["source"]) {
  switch (source) {
    case "cover":
      return "封面";
    case "content":
      return "正文";
    case "import":
      return "导入";
  }
}

export function ImageAssetsPanel(props: {
  assets: DraftAsset[];
  onInsert: (asset: DraftAsset) => void;
  onCopy: (asset: DraftAsset) => void;
}) {
  return (
    <section className="editor-card space-y-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">图片管理</h2>
          <p className="mt-1 text-sm text-muted">当前文章共 {props.assets.length} 张图片，可复制链接或插入正文。</p>
        </div>
        <button type="button" className="editor-toolbar-button">
          <WandSparkles size={16} />
          <span>压缩工具</span>
        </button>
      </div>

      {props.assets.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-white/70 bg-white/35 px-4 py-8 text-center text-sm text-muted">
          <Images className="mx-auto mb-3" size={24} />
          还没有上传图片。
        </div>
      ) : (
        <div className="space-y-3">
          {props.assets.map((asset, index) => (
            <div
              key={`${asset.url}-${index}`}
              className="rounded-[20px] border border-white/70 bg-white/45 p-4 shadow-[0_14px_44px_rgba(71,110,91,0.08)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 inline-flex rounded-full border border-white/70 bg-white/60 px-2.5 py-1 text-xs text-muted">
                    {sourceLabel(asset.source)}
                  </div>
                  <p className="truncate text-sm font-medium text-foreground">{asset.url}</p>
                  {asset.originalPath ? <p className="mt-1 text-xs text-muted">来源：{asset.originalPath}</p> : null}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="editor-toolbar-button !h-9 !px-3" onClick={() => props.onCopy(asset)}>
                    <Copy size={14} />
                    <span>复制</span>
                  </button>
                  <button type="button" className="editor-toolbar-button !h-9 !px-3" onClick={() => props.onInsert(asset)}>
                    <Images size={14} />
                    <span>插入</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
