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
  Eye,
  EyeOff,
} from "lucide-react";
import type { ReactNode } from "react";
import type { MarkdownCommand } from "@/lib/admin/markdown-editor";

const toolbarItems: Array<{
  command: MarkdownCommand;
  label: string;
  icon: ReactNode;
}> = [
  { command: "h2", label: "H2", icon: <Heading2 size={18} /> },
  { command: "h3", label: "H3", icon: <Heading3 size={18} /> },
  { command: "bold", label: "粗体", icon: <Bold size={18} /> },
  { command: "italic", label: "斜体", icon: <Italic size={18} /> },
  { command: "quote", label: "引用", icon: <Quote size={18} /> },
  { command: "inline-code", label: "代码", icon: <Code size={18} /> },
  { command: "code-block", label: "代码块", icon: <FileCode2 size={18} /> },
  { command: "bulleted-list", label: "列表", icon: <List size={18} /> },
  { command: "todo-list", label: "待办", icon: <ListTodo size={18} /> },
  { command: "link", label: "链接", icon: <Link2 size={18} /> },
];

export function MarkdownToolbar(props: {
  onCommand: (command: MarkdownCommand) => void;
  onUploadImage: () => void;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  isPreviewOpen?: boolean;
  onTogglePreview?: () => void;
}) {
  const orientation = props.orientation ?? "horizontal";
  const isVertical = orientation === "vertical";

  const containerClasses = isVertical
    ? "flex flex-row flex-wrap md:flex-col gap-2 p-2 rounded-[24px] border border-white/70 bg-white/40 shadow-lg backdrop-blur-xl w-full md:w-fit"
    : "flex flex-wrap gap-2";

  const buttonClasses = isVertical
    ? "editor-toolbar-button md:size-10 md:p-0 md:rounded-full shrink-0 flex items-center justify-center"
    : "editor-toolbar-button";

  return (
    <div className={containerClasses}>
      {toolbarItems.map((item) => (
        <div key={item.command} className="relative group/tooltip">
          <button
            type="button"
            className={buttonClasses}
            onClick={() => props.onCommand(item.command)}
            disabled={props.disabled}
            aria-label={item.label}
          >
            {item.icon}
            {!isVertical && <span>{item.label}</span>}
            {isVertical && <span className="md:hidden">{item.label}</span>}
          </button>
          <span
            className={`tooltip-custom ${
              isVertical
                ? "left-full top-1/2 -translate-y-1/2 ml-2 origin-left"
                : "bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom"
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
      <div className="relative group/tooltip">
        <button
          type="button"
          className={buttonClasses}
          onClick={props.onUploadImage}
          disabled={props.disabled}
          aria-label="上传图片"
        >
          <ImagePlus size={18} />
          {!isVertical && <span>图片</span>}
          {isVertical && <span className="md:hidden">图片</span>}
        </button>
        <span
          className={`tooltip-custom ${
            isVertical
              ? "left-full top-1/2 -translate-y-1/2 ml-2 origin-left"
              : "bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom"
          }`}
        >
          上传图片
        </span>
      </div>

      {props.onTogglePreview && (
        <div
          className={`relative group/tooltip ${
            isVertical ? "border-t border-white/40 pt-2 mt-1" : "border-l border-white/40 pl-2 ml-1"
          }`}
        >
          <button
            type="button"
            className={`${buttonClasses} ${
              props.isPreviewOpen
                ? "border-accent bg-accent-soft text-accent-strong hover:bg-accent-soft/80"
                : ""
            }`}
            onClick={props.onTogglePreview}
            disabled={props.disabled}
            aria-label={props.isPreviewOpen ? "关闭预览" : "实时预览"}
          >
            {props.isPreviewOpen ? <EyeOff size={18} /> : <Eye size={18} />}
            {!isVertical && <span>{props.isPreviewOpen ? "关闭预览" : "预览"}</span>}
          </button>
          <span
            className={`tooltip-custom ${
              isVertical
                ? "left-full top-1/2 -translate-y-1/2 ml-2 origin-left"
                : "bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom"
            }`}
          >
            {props.isPreviewOpen ? "关闭预览" : "实时预览"}
          </span>
        </div>
      )}
    </div>
  );
}
