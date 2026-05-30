"use client";

import { useState } from "react";
import { Tag, X, Plus, Check } from "lucide-react";
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
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");

  function handleConfirmNewCategory() {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryError("分类名称不能为空");
      return;
    }
    const isDuplicate = props.categoryOptions.some(
      (opt) => opt.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setCategoryError("分类名称已存在");
      return;
    }

    props.onCategoryChange(trimmed);
    setIsCreatingCategory(false);
    setNewCategoryName("");
    setCategoryError("");
  }

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

        {!isCreatingCategory ? (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-white/80 bg-white/35 px-3 py-1.5 text-sm text-muted transition hover:border-accent/60 hover:bg-white/45 hover:text-accent-strong"
            onClick={() => {
              setIsCreatingCategory(true);
              setNewCategoryName("");
              setCategoryError("");
            }}
          >
            <Plus size={14} />
            新建分类
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                className={`editor-input flex-1 ${categoryError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
                value={newCategoryName}
                onChange={(event) => {
                  setNewCategoryName(event.target.value);
                  if (categoryError) setCategoryError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleConfirmNewCategory();
                  } else if (event.key === "Escape") {
                    event.preventDefault();
                    setIsCreatingCategory(false);
                  }
                }}
                placeholder="输入新分类名"
                autoFocus
              />
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full border border-emerald-200/80 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100/80 transition shrink-0"
                onClick={handleConfirmNewCategory}
                title="确定"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full border border-orange-200/80 bg-orange-50/80 text-orange-700 hover:bg-orange-100/80 transition shrink-0"
                onClick={() => setIsCreatingCategory(false)}
                title="取消"
              >
                <X size={16} />
              </button>
            </div>
            {categoryError ? (
              <p className="text-xs text-red-500 font-medium pl-1">{categoryError}</p>
            ) : null}
          </div>
        )}
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
