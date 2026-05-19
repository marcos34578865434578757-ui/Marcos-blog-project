"use client";

import { AlertTriangle, CheckCircle2, Loader2, Save, Send, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CoverUploader } from "@/components/admin/CoverUploader";
import { ImageAssetsPanel } from "@/components/admin/ImageAssetsPanel";
import { MarkdownToolbar } from "@/components/admin/MarkdownToolbar";
import { MetaPanel } from "@/components/admin/MetaPanel";
import { MarkdownBody } from "@/components/markdown/MarkdownBody";
import type { AdminCapabilities } from "@/lib/admin/health";
import { applyMarkdownCommand, insertTextAtSelection, type MarkdownCommand } from "@/lib/admin/markdown-editor";
import { normalizeCategory } from "@/lib/content/categories";
import { DEFAULT_CATEGORY, type DraftAsset, type DraftPost } from "@/lib/content/types";
import { slugify } from "@/lib/content/slug";

const emptyDraft: DraftPost = {
  title: "",
  slug: "",
  date: new Date().toISOString(),
  description: "",
  tags: [],
  category: DEFAULT_CATEGORY,
  cover: "",
  status: "draft",
  redirectFrom: [],
  updatedAt: new Date().toISOString(),
  source: "admin",
  content: "",
  assets: [],
};

type PreviewData = {
  headings: Array<{ level: number; text: string; id: string }>;
  warnings: Array<{ line: number; message: string }>;
};

function toDateTimeLocalValue(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 16);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T09:00`;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 16);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function toStoredDateValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString();
}

function upsertAsset(assets: DraftAsset[], nextAsset: DraftAsset) {
  const existingIndex = assets.findIndex((asset) => asset.url === nextAsset.url);
  if (existingIndex === -1) return [...assets, nextAsset];

  const copy = [...assets];
  copy[existingIndex] = nextAsset;
  return copy;
}

export function PostEditor(props: {
  initialDraft?: DraftPost | null;
  initialCapabilities: AdminCapabilities;
  initialCategories: string[];
  mode: "new" | "edit";
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSelectionRef = useRef<{ selectionStart: number; selectionEnd: number } | null>(null);

  const initialDraft = props.initialDraft ? { ...props.initialDraft, category: normalizeCategory(props.initialDraft.category) } : emptyDraft;
  const [draft, setDraft] = useState<DraftPost>(initialDraft);
  const [persistedSlug, setPersistedSlug] = useState(props.initialDraft?.slug ?? "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(props.initialDraft?.slug));
  const [draftOnly, setDraftOnly] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingContentImage, setIsUploadingContentImage] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData>({ headings: [], warnings: [] });

  function autoGrowTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  const categoryOptions = useMemo(() => {
    return [...new Set(props.initialCategories.map((item) => normalizeCategory(item)).filter(Boolean))].sort((left, right) =>
      left.localeCompare(right, "zh-CN"),
    );
  }, [props.initialCategories]);

  const blobUnavailable = !props.initialCapabilities.blobConfigured;
  const githubUnavailable = !props.initialCapabilities.githubConfigured;
  const saveDisabled = isSaving || isPublishing || blobUnavailable;
  const publishDisabled = isSaving || isPublishing || draftOnly || githubUnavailable || blobUnavailable;

  const pageStatus = useMemo(() => {
    if (draftOnly) return "仅保存草稿";
    if (hasUnsavedChanges) return "未保存";
    return props.mode === "new" ? "新建草稿" : "编辑草稿";
  }, [draftOnly, hasUnsavedChanges, props.mode]);

  function setDirtyMessage(nextMessage = "", nextError = "") {
    setMessage(nextMessage);
    setError(nextError);
  }

  function patch(update: Partial<DraftPost>, options?: { markDirty?: boolean; raw?: boolean }) {
    setDraft((current) => ({
      ...current,
      ...update,
      category: options?.raw ? (update.category ?? current.category) : normalizeCategory(update.category ?? current.category),
    }));

    if (options?.markDirty !== false) {
      setHasUnsavedChanges(true);
    }
  }

  function rememberSelection() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    lastSelectionRef.current = {
      selectionStart: textarea.selectionStart,
      selectionEnd: textarea.selectionEnd,
    };
  }

  function applyEditorResult(result: { value: string; selectionStart: number; selectionEnd: number }) {
    patch({ content: result.value });

    requestAnimationFrame(() => {
      const input = textareaRef.current;
      if (!input) return;
      input.focus();
      input.setSelectionRange(result.selectionStart, result.selectionEnd);
      lastSelectionRef.current = {
        selectionStart: result.selectionStart,
        selectionEnd: result.selectionEnd,
      };
    });
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

    applyEditorResult(result);
  }

  function insertContentAtLastSelection(text: string) {
    const selection = lastSelectionRef.current ?? {
      selectionStart: draft.content.length,
      selectionEnd: draft.content.length,
    };

    const result = insertTextAtSelection(
      {
        value: draft.content,
        selectionStart: selection.selectionStart,
        selectionEnd: selection.selectionEnd,
      },
      text,
    );

    applyEditorResult(result);
  }

  function addTags(tags: string[]) {
    const merged = [...draft.tags];
    for (const tag of tags.map((item) => item.trim()).filter(Boolean)) {
      if (!merged.includes(tag)) merged.push(tag);
    }

    patch({ tags: merged });
  }

  function validateDraft(requireContent = true) {
    if (!draft.title.trim()) {
      setError("标题不能为空。");
      return false;
    }

    const nextSlug = slugify(draft.slug || draft.title);
    if (!nextSlug) {
      setError("Slug 不能为空。");
      return false;
    }

    if (requireContent && !draft.content.trim()) {
      setError("正文不能为空。");
      return false;
    }

    return true;
  }

  function normalizeDraftForSave() {
    return {
      ...draft,
      slug: slugify(draft.slug || draft.title),
      tags: [...new Set(draft.tags.map((tag) => tag.trim()).filter(Boolean))],
      category: normalizeCategory(draft.category),
      date: toStoredDateValue(draft.date),
      status: "draft" as const,
    };
  }

  async function saveDraft(showSavedMessage = true) {
    if (!validateDraft(true)) return null;

    setIsSaving(true);
    setDirtyMessage();
    const nextDraft = normalizeDraftForSave();
    const endpoint = persistedSlug ? `/api/admin/drafts/${persistedSlug}` : "/api/admin/drafts";
    const method = persistedSlug ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextDraft),
    });
    const result = await response.json();
    setIsSaving(false);

    if (!result.ok) {
      setError(result.error ?? "淇濆瓨澶辫触");
      return null;
    }

    const savedDraft = result.data as DraftPost;
    setDraft({
      ...savedDraft,
      category: normalizeCategory(savedDraft.category),
      date: toDateTimeLocalValue(savedDraft.date),
    });
    setPersistedSlug(savedDraft.slug);
    setSlugManuallyEdited(true);
    setHasUnsavedChanges(false);
    if (showSavedMessage) {
      setMessage("草稿已保存。");
    }

    if (persistedSlug !== savedDraft.slug) {
      router.replace(`/admin/posts/${savedDraft.slug}/edit`);
    } else if (!persistedSlug) {
      router.replace(`/admin/posts/${savedDraft.slug}/edit`);
    }
    router.refresh();
    return savedDraft;
  }

  async function publish() {
    if (draftOnly) {
      setError("当前设置为仅保存草稿，不会发布。");
      return;
    }

    const saved = await saveDraft(false);
    if (!saved) return;

    setIsPublishing(true);
    setDirtyMessage();
    const response = await fetch("/api/admin/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: saved.slug }),
    });
    const result = await response.json();
    setIsPublishing(false);

    if (!result.ok) {
      setError(result.error ?? "鍙戝竷澶辫触");
      return;
    }

    setMessage("文章已发布到 GitHub，Vercel 会自动开始部署。");
    setHasUnsavedChanges(false);
    router.refresh();
  }

  async function uploadImage(file: File, source: DraftAsset["source"]) {
    setDirtyMessage();
    if (source === "cover") {
      setIsUploadingCover(true);
    } else {
      setIsUploadingContentImage(true);
    }

    const formData = new FormData();
    formData.set("file", file);
    formData.set("slug", slugify(draft.slug || draft.title || "draft"));
    formData.set("source", source);

    const response = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
    const result = await response.json();

    if (source === "cover") {
      setIsUploadingCover(false);
    } else {
      setIsUploadingContentImage(false);
    }

    if (!result.ok) {
      setError(result.error ?? "涓婁紶澶辫触");
      return;
    }

    const asset = result.data as DraftAsset;
    const nextAssets = upsertAsset(draft.assets, asset);

    if (source === "cover") {
      patch({ cover: asset.url, assets: nextAssets });
      setMessage("封面已上传。");
      return;
    }

    patch({ assets: nextAssets });
    insertContentAtLastSelection(`![鍥剧墖璇存槑](${asset.url})`);
    setMessage("图片已上传并插入正文。");
  }

  async function fetchPreviewData(content: string) {
    setIsPreviewLoading(true);
    const response = await fetch("/api/admin/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const result = await response.json();
    setIsPreviewLoading(false);

    if (!result.ok) {
      setError(result.error ?? "棰勮淇℃伅鍔犺浇澶辫触");
      return;
    }

    setPreviewData(result.data);
  }

  async function openPreview() {
    setIsPreviewOpen(true);
    setError("");
    await fetchPreviewData(draft.content);
  }

  function onImportClick() {
    if (hasUnsavedChanges && !window.confirm("褰撳墠鏈夋湭淇濆瓨鍐呭锛岀‘瀹氱幇鍦ㄥ幓瀵煎叆椤甸潰鍚楋紵")) {
      return;
    }

    router.push("/admin/import");
  }

  function onCopyAsset(asset: DraftAsset) {
    void navigator.clipboard
      .writeText(asset.url)
      .then(() => setMessage("图片链接已复制。"))
      .catch(() => setError("复制链接失败，请手动复制图片 URL。"));
  }

  function onInsertAsset(asset: DraftAsset) {
    insertContentAtLastSelection(`![鍥剧墖璇存槑](${asset.url})`);
    setMessage("图片链接已插入正文。");
  }

  useEffect(() => {
    if (!isPreviewOpen) return;
    const timer = window.setTimeout(() => {
      void fetchPreviewData(draft.content);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [draft.content, isPreviewOpen]);

  useEffect(() => {
    autoGrowTextarea();
  }, [draft.content]);

  useEffect(() => {
    autoGrowTextarea();
  }, []);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const historyState = { ...(window.history.state ?? {}), editorGuard: true };
    window.history.pushState(historyState, "");

    const onDocumentClick = (event: MouseEvent) => {
      if (!hasUnsavedChanges) return;
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]");
      if (!anchor) return;
      if (anchor.getAttribute("target") === "_blank") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      if (!window.confirm("当前内容尚未保存，确定离开此页面吗？")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const onPopState = () => {
      if (window.confirm("当前内容尚未保存，确定离开此页面吗？")) {
        window.removeEventListener("popstate", onPopState);
        window.history.back();
        return;
      }

      window.history.pushState(historyState, "");
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onDocumentClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [hasUnsavedChanges]);

  return (
    <div className="editor-shell">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadImage(file, "content");
          event.currentTarget.value = "";
        }}
      />
      <input
        ref={coverFileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadImage(file, "cover");
          event.currentTarget.value = "";
        }}
      />

      <header className="editor-topbar">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-[20px] border border-white/75 bg-white/55 text-xl shadow-[0_18px_56px_rgba(71,110,91,0.12)] backdrop-blur-xl">
            ✍
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-accent">Writer Studio</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{draft.title || "新建文章"}</h1>
            <p className="mt-1 text-sm text-muted">{pageStatus}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="editor-action-button" onClick={onImportClick} disabled={isSaving || isPublishing}>
            导入 MD
          </button>
          <button type="button" className="editor-action-button" onClick={() => void openPreview()} disabled={isSaving || isPublishing}>
            预览
          </button>
          <button type="button" className="editor-action-button" onClick={() => void saveDraft()} disabled={saveDisabled}>
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            保存草稿
          </button>
          <button type="button" className="editor-primary-button" onClick={() => void publish()} disabled={publishDisabled}>
            {isPublishing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            发布
          </button>
        </div>
      </header>

      <div className="space-y-4">
        {!props.initialCapabilities.blobConfigured ? (
          <StatusBanner
            icon={<AlertTriangle size={18} />}
            tone="warning"
            title="Blob 存储未配置"
            body="缺少 BLOB_READ_WRITE_TOKEN，封面上传、图片上传、保存草稿和导入文章都不可用。"
          />
        ) : null}
        {!props.initialCapabilities.githubConfigured ? (
          <StatusBanner
            icon={<AlertTriangle size={18} />}
            tone="warning"
            title="GitHub 发布配置未完成"
            body="缺少 GitHub 发布环境变量，草稿仍可保存，但发布按钮不可用。"
          />
        ) : null}
        {error ? <StatusBanner icon={<AlertTriangle size={18} />} tone="danger" title="操作失败" body={error} /> : null}
        {message ? <StatusBanner icon={<CheckCircle2 size={18} />} tone="success" title="操作成功" body={message} /> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
        <section className="editor-card space-y-5 p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted">标题</span>
              <input
                className="editor-input text-lg font-semibold"
                value={draft.title}
                onChange={(event) => {
                  const nextTitle = event.target.value;
                  const update: Partial<DraftPost> = { title: nextTitle };
                  if (!slugManuallyEdited) {
                    update.slug = slugify(nextTitle);
                  }
                  patch(update);
                }}
                placeholder="标题"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted">Slug</span>
              <input
                className="editor-input font-mono text-sm"
                value={draft.slug}
                onChange={(event) => {
                  setSlugManuallyEdited(true);
                  patch({ slug: slugify(event.target.value) });
                }}
                placeholder="slug（xx-xx）"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">Markdown 内容</h2>
                <p className="mt-1 text-sm text-muted">工具栏会按当前选区插入语法，图片上传会优先插入最近的光标位置。</p>
              </div>
              <span className="rounded-full border border-white/70 bg-white/55 px-3 py-1 text-xs text-muted shadow-[0_14px_36px_rgba(71,110,91,0.08)]">
                {hasUnsavedChanges ? "未保存" : "已同步"}
              </span>
            </div>

            <MarkdownToolbar
              onCommand={applyCommand}
              onUploadImage={() => fileRef.current?.click()}
              disabled={isUploadingContentImage || isSaving || blobUnavailable}
            />

            <div className="rounded-[28px] border border-white/75 bg-white/40 p-3 shadow-[0_24px_80px_rgba(71,110,91,0.12)] backdrop-blur-2xl">
              <textarea
                ref={textareaRef}
                className="editor-textarea rounded-[22px] border border-white/65 bg-white/72 px-5 py-4 font-mono text-[15px] leading-7 text-foreground outline-none transition focus:border-accent/45 focus:ring-4 focus:ring-accent/10"
                value={draft.content}
                onChange={(event) => {
                  patch({ content: event.target.value });
                  requestAnimationFrame(autoGrowTextarea);
                }}
                onClick={rememberSelection}
                onKeyUp={rememberSelection}
                onSelect={rememberSelection}
                onFocus={rememberSelection}
                spellCheck={false}
                placeholder="Markdown 内容"
              />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <CoverUploader
            cover={draft.cover}
            onOpenPicker={() => coverFileRef.current?.click()}
            onChangeUrl={(value) => patch({ cover: value })}
            isUploading={isUploadingCover}
            disabled={blobUnavailable}
          />

          <MetaPanel
            description={draft.description}
            category={draft.category}
            categoryOptions={categoryOptions}
            date={toDateTimeLocalValue(draft.date)}
            tags={draft.tags}
            tagInput={tagInput}
            draftOnly={draftOnly}
            onDescriptionChange={(value) => patch({ description: value })}
            onCategoryChange={(value, raw) => patch({ category: value }, { raw })}
            onDateChange={(value) => patch({ date: value })}
            onTagInputChange={setTagInput}
            onAddTags={addTags}
            onRemoveTag={(tag) => patch({ tags: draft.tags.filter((item) => item !== tag) })}
            onDraftOnlyChange={setDraftOnly}
          />

          <ImageAssetsPanel assets={draft.assets} onInsert={onInsertAsset} onCopy={onCopyAsset} />
        </aside>
      </div>

      <button
        type="button"
        className="fixed right-6 top-1/2 z-20 hidden size-14 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/60 text-xl shadow-[0_18px_56px_rgba(71,110,91,0.14)] backdrop-blur-2xl transition hover:-translate-y-[calc(50%+2px)] lg:grid"
        title="写作小助手（即将上线）"
      >
        <Sparkles size={20} />
      </button>

      {isPreviewOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[rgba(8,16,12,0.28)] p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/70 bg-[rgba(255,255,255,0.56)] shadow-[0_32px_120px_rgba(71,110,91,0.16)] backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/60 px-6 py-5">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-accent">Preview</p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">{draft.title || "文章预览"}</h2>
              </div>
              <button type="button" className="editor-action-button" onClick={() => setIsPreviewOpen(false)}>
                关闭
              </button>
            </div>

            <div className="grid max-h-[calc(90vh-88px)] gap-6 overflow-auto p-6 xl:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.6fr)]">
              <section className="editor-card h-fit space-y-5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-foreground">预览辅助信息</h3>
                  {isPreviewLoading ? <Loader2 className="animate-spin text-muted" size={16} /> : null}
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted">目录</h4>
                  {previewData.headings.length === 0 ? (
                    <p className="text-sm text-muted">当前正文还没有可提取的二级或三级标题。</p>
                  ) : (
                    <ul className="space-y-2 text-sm text-foreground">
                      {previewData.headings.map((heading) => (
                        <li key={`${heading.id}-${heading.level}`} className={heading.level === 3 ? "pl-4 text-muted" : ""}>
                          {heading.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted">内容提示</h4>
                  {previewData.warnings.length === 0 ? (
                    <p className="text-sm text-muted">没有发现 directive 语法警告。</p>
                  ) : (
                    <ul className="space-y-2 text-sm text-warn">
                      {previewData.warnings.map((warning, index) => (
                        <li key={`${warning.line}-${index}`}>
                          第 {warning.line} 行：{warning.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <article className="editor-card prose-blog min-h-[60vh] p-6">
                <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
                  <span>{normalizeCategory(draft.category)}</span>
                  <span>·</span>
                  <span>{draft.tags.length > 0 ? draft.tags.join(" / ") : "无标签"}</span>
                </div>
                <h1>{draft.title || "Untitled"}</h1>
                {draft.description ? <p>{draft.description}</p> : null}
                <MarkdownBody content={draft.content || "这里会显示文章预览。"} />
              </article>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatusBanner(props: {
  icon: ReactNode;
  title: string;
  body: string;
  tone: "warning" | "danger" | "success";
}) {
  const toneClass =
    props.tone === "success"
      ? "border-emerald-200/80 bg-emerald-50/70 text-emerald-900"
      : props.tone === "danger"
        ? "border-orange-200/80 bg-orange-50/80 text-orange-950"
        : "border-amber-200/80 bg-amber-50/80 text-amber-950";

  return (
    <section className={`rounded-[22px] border px-4 py-4 shadow-[0_16px_44px_rgba(71,110,91,0.08)] ${toneClass}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{props.icon}</div>
        <div className="space-y-1">
          <p className="font-medium">{props.title}</p>
          <p className="text-sm leading-6 opacity-85">{props.body}</p>
        </div>
      </div>
    </section>
  );
}

