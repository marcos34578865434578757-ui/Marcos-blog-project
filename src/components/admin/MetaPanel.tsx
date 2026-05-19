"use client";

import { Tag, X } from "lucide-react";
import { parseTagInput } from "@/lib/admin/markdown-editor";

export function MetaPanel(props: {
  description: string;
  category: string;
  categoryOptions: string[];
  date: string;
  tags: string[];
  tagInput: string;
  draftOnly: boolean;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string, raw?: boolean) => void;
  onDateChange: (value: string) => void;
  onTagInputChange: (value: string) => void;
  onAddTags: (tags: string[]) => void;
  onRemoveTag: (tag: string) => void;
  onDraftOnlyChange: (next: boolean) => void;
}) {
  function flushTags() {
    const nextTags = parseTagInput(props.tagInput);
    if (nextTags.length > 0) {
      props.onAddTags(nextTags);
    }
    props.onTagInputChange("");
  }

  return (
    <section className="editor-card space-y-5 p-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">元信息</h2>
        <p className="mt-1 text-sm text-muted">补充摘要、标签、分类和时间，帮助文章整理与展示。</p>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium text-muted">摘要</span>
        <textarea
          className="editor-input min-h-28"
          value={props.description}
          onChange={(event) => props.onDescriptionChange(event.target.value)}
          placeholder="为这篇文章写一段简短摘要"
        />
      </label>

      <div className="space-y-2 text-sm">
        <span className="font-medium text-muted">标签</span>
        {props.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {props.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/55 px-3 py-1 text-sm text-foreground"
              >
                <Tag size={12} />
                {tag}
                <button
                  type="button"
                  className="text-muted transition hover:text-foreground"
                  onClick={() => props.onRemoveTag(tag)}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <input
          className="editor-input"
          value={props.tagInput}
          onChange={(event) => props.onTagInputChange(event.target.value)}
          onBlur={flushTags}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === "," || event.key === "，") {
              event.preventDefault();
              flushTags();
            }
          }}
          placeholder="添加标签（按回车）"
        />
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-muted">分类</span>
          <span className="text-xs text-muted">可选已有分类，也可以直接输入新的分类名</span>
        </div>

        {props.categoryOptions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {props.categoryOptions.map((option) => {
              const active = option === props.category;
              return (
                <button
                  key={option}
                  type="button"
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    active
                      ? "border-accent bg-accent-soft text-accent-strong"
                      : "border-white/70 bg-white/55 text-foreground hover:border-accent/60 hover:text-accent-strong"
                  }`}
                  onClick={() => props.onCategoryChange(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : null}

        <input
          className="editor-input"
          list="admin-category-options"
          value={props.category}
          onChange={(event) => props.onCategoryChange(event.target.value, true)}
          placeholder="输入新分类名"
        />
        <datalist id="admin-category-options">
          {props.categoryOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium text-muted">日期</span>
        <input
          className="editor-input"
          type="datetime-local"
          value={props.date}
          onChange={(event) => props.onDateChange(event.target.value)}
        />
      </label>

      <label className="flex items-start gap-3 rounded-[20px] border border-white/70 bg-white/45 px-4 py-4 text-sm text-foreground shadow-[0_14px_44px_rgba(71,110,91,0.08)]">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-[var(--accent)]"
          checked={props.draftOnly}
          onChange={(event) => props.onDraftOnlyChange(event.target.checked)}
        />
        <span>
          <span className="block font-medium">仅保存草稿，不发布</span>
          <span className="mt-1 block text-muted">勾选后仍可保存内容，但发布按钮会被禁用，直到取消勾选。</span>
        </span>
      </label>
    </section>
  );
}
