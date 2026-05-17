"use client";

import {
  Bold,
  Code,
  FileCode2,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListTodo,
  Quote,
  Save,
  Send,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MarkdownBody } from "@/components/markdown/MarkdownBody";
import { applyMarkdownCommand, type MarkdownCommand } from "@/lib/admin/markdown-editor";
import { slugify } from "@/lib/content/slug";
import type { DraftAsset, DraftPost } from "@/lib/content/types";

const emptyDraft: DraftPost = {
  title: "",
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  tags: [],
  category: "Notes",
  cover: "",
  status: "draft",
  redirectFrom: [],
  updatedAt: new Date().toISOString(),
  source: "admin",
  content: "",
  assets: [],
};

const toolbarItems: Array<{
  command: MarkdownCommand;
  label: string;
  icon: ReactNode;
}> = [
  { command: "h2", label: "二级标题", icon: <Heading2 size={16} /> },
  { command: "h3", label: "三级标题", icon: <Heading3 size={16} /> },
  { command: "bold", label: "加粗", icon: <Bold size={16} /> },
  { command: "italic", label: "斜体", icon: <Italic size={16} /> },
  { command: "inline-code", label: "行内代码", icon: <Code size={16} /> },
  { command: "code-block", label: "代码块", icon: <FileCode2 size={16} /> },
  { command: "quote", label: "引用", icon: <Quote size={16} /> },
  { command: "bulleted-list", label: "无序列表", icon: <List size={16} /> },
  { command: "todo-list", label: "待办列表", icon: <ListTodo size={16} /> },
  { command: "link", label: "链接", icon: <Link2 size={16} /> },
  { command: "image", label: "图片语法", icon: <ImagePlus size={16} /> },
];

export function PostEditor({ initialDraft }: { initialDraft?: DraftPost | null }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState<DraftPost>(initialDraft ?? emptyDraft);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [mobilePane, setMobilePane] = useState<"editor" | "preview">("editor");
  const tagsValue = useMemo(() => draft.tags.join(", "), [draft.tags]);

  function patch(update: Partial<DraftPost>) {
    setDraft((current) => ({ ...current, ...update }));
  }

  function applyCommand(command: MarkdownCommand) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const result = applyMarkdownCommand(
      {
        value: draft.content,
        selectionStart: textarea.selectionStart,
        selectionEnd: textarea.selectionEnd,
      },
      command,
    );

    patch({ content: result.value });
    setMobilePane("editor");

    requestAnimationFrame(() => {
      const input = textareaRef.current;
      if (!input) return;
      input.focus();
      input.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  }

  async function saveDraft() {
    setIsSaving(true);
    setError("");
    setMessage("");
    const nextDraft = {
      ...draft,
      slug: slugify(draft.slug || draft.title),
      tags: draft.tags.map((tag) => tag.trim()).filter(Boolean),
    };
    const response = await fetch(initialDraft ? `/api/admin/drafts/${initialDraft.slug}` : "/api/admin/drafts", {
      method: initialDraft ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextDraft),
    });
    const result = await response.json();
    setIsSaving(false);

    if (!result.ok) {
      setError(result.error ?? "Save failed");
      return null;
    }

    setDraft(result.data);
    setMessage("草稿已保存。");
    if (!initialDraft) router.replace(`/admin/posts/${result.data.slug}/edit`);
    router.refresh();
    return result.data as DraftPost;
  }

  async function publish() {
    const saved = await saveDraft();
    if (!saved) return;
    setIsSaving(true);
    setError("");
    setMessage("");
    const response = await fetch("/api/admin/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: saved.slug }),
    });
    const result = await response.json();
    setIsSaving(false);

    if (!result.ok) {
      setError(result.error ?? "Publish failed");
      return;
    }

    setMessage("已发布到 GitHub，Vercel 会开始构建。");
    router.refresh();
  }

  async function uploadImage(file: File) {
    setError("");
    const formData = new FormData();
    formData.set("file", file);
    formData.set("slug", slugify(draft.slug || draft.title || "draft"));
    const response = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
    const result = await response.json();
    if (!result.ok) {
      setError(result.error ?? "Upload failed");
      return;
    }

    const asset = result.data as DraftAsset;
    patch({
      content: `${draft.content}${draft.content.endsWith("\n") || !draft.content ? "" : "\n"}\n![${file.name}](${asset.url})\n`,
      assets: [...draft.assets, asset],
    });

    setMessage("图片已上传并插入正文。");
    setMobilePane("editor");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="soft-panel space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="标题">
            <input
              className="field-control"
              value={draft.title}
              onChange={(event) => patch({ title: event.target.value, slug: draft.slug || slugify(event.target.value) })}
            />
          </Field>
          <Field label="Slug">
            <input
              className="field-control font-mono text-sm"
              value={draft.slug}
              onChange={(event) => patch({ slug: slugify(event.target.value) })}
            />
          </Field>
          <Field label="日期">
            <input className="field-control" type="date" value={draft.date} onChange={(event) => patch({ date: event.target.value })} />
          </Field>
          <Field label="分类">
            <input className="field-control" value={draft.category} onChange={(event) => patch({ category: event.target.value })} />
          </Field>
        </div>

        <Field label="摘要">
          <textarea className="field-control min-h-20" value={draft.description} onChange={(event) => patch({ description: event.target.value })} />
        </Field>

        <Field label="标签">
          <input
            className="field-control"
            value={tagsValue}
            onChange={(event) =>
              patch({
                tags: event.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              })
            }
            placeholder="product, notes"
          />
        </Field>

        <Field label="封面 URL">
          <input className="field-control" value={draft.cover} onChange={(event) => patch({ cover: event.target.value })} />
        </Field>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadImage(file);
            event.currentTarget.value = "";
          }}
        />

        {error ? <p className="rounded-md border border-warn bg-surface p-3 text-sm text-warn">{error}</p> : null}
        {message ? <p className="rounded-md border border-accent bg-accent-soft p-3 text-sm text-accent-strong">{message}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary" type="button" onClick={() => fileRef.current?.click()}>
            <ImagePlus size={16} />
            上传图片
          </button>
          <button className="btn-secondary" type="button" onClick={() => void saveDraft()} disabled={isSaving}>
            <Save size={16} />
            保存草稿
          </button>
          <button className="btn-primary" type="button" onClick={() => void publish()} disabled={isSaving}>
            <Send size={16} />
            发布
          </button>
        </div>
      </section>

      <section className="soft-panel p-5">
        <div className="mb-4 flex flex-col gap-4 border-b border-line pb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-muted">正文</p>
              <p className="mt-1 text-sm text-muted">工具栏会直接在当前光标或选区上插入 Markdown。</p>
            </div>
            <span className="status-pill hidden sm:inline-flex">Markdown</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {toolbarItems.map((item) => (
              <button
                key={item.command}
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm text-muted transition hover:border-accent hover:bg-accent-soft hover:text-foreground"
                onClick={() => applyCommand(item.command)}
                title={item.label}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 md:hidden">
            <button
              type="button"
              className={mobilePane === "editor" ? "btn-primary flex-1" : "btn-secondary flex-1"}
              onClick={() => setMobilePane("editor")}
            >
              编辑
            </button>
            <button
              type="button"
              className={mobilePane === "preview" ? "btn-primary flex-1" : "btn-secondary flex-1"}
              onClick={() => setMobilePane("preview")}
            >
              预览
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className={mobilePane === "preview" ? "hidden md:block" : "block"}>
            <label className="mb-2 block text-sm font-medium text-muted" htmlFor="post-content">
              Markdown
            </label>
            <textarea
              id="post-content"
              ref={textareaRef}
              className="field-control min-h-[520px] resize-y px-4 py-3 font-mono text-sm leading-7"
              value={draft.content}
              onChange={(event) => patch({ content: event.target.value })}
              spellCheck={false}
            />
          </div>

          <div className={mobilePane === "editor" ? "hidden md:block" : "block"}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-muted">预览</p>
              <span className="status-pill md:hidden">Live</span>
            </div>
            <article className="prose-blog min-h-[520px] rounded-md border border-line bg-surface px-4 py-5">
              <h1>{draft.title || "Untitled"}</h1>
              {draft.description ? <p>{draft.description}</p> : null}
              <MarkdownBody content={draft.content || "正文预览会显示在这里。"} />
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
