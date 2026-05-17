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
} from "lucide-react";
import type { ReactNode } from "react";
import type { MarkdownCommand } from "@/lib/admin/markdown-editor";

const toolbarItems: Array<{
  command: MarkdownCommand;
  label: string;
  icon: ReactNode;
}> = [
  { command: "h2", label: "H2", icon: <Heading2 size={16} /> },
  { command: "h3", label: "H3", icon: <Heading3 size={16} /> },
  { command: "bold", label: "粗体", icon: <Bold size={16} /> },
  { command: "italic", label: "斜体", icon: <Italic size={16} /> },
  { command: "quote", label: "引用", icon: <Quote size={16} /> },
  { command: "inline-code", label: "代码", icon: <Code size={16} /> },
  { command: "code-block", label: "代码块", icon: <FileCode2 size={16} /> },
  { command: "bulleted-list", label: "列表", icon: <List size={16} /> },
  { command: "todo-list", label: "待办", icon: <ListTodo size={16} /> },
  { command: "link", label: "链接", icon: <Link2 size={16} /> },
];

export function MarkdownToolbar(props: {
  onCommand: (command: MarkdownCommand) => void;
  onUploadImage: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {toolbarItems.map((item) => (
        <button
          key={item.command}
          type="button"
          className="editor-toolbar-button"
          onClick={() => props.onCommand(item.command)}
          title={item.label}
          disabled={props.disabled}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
      <button type="button" className="editor-toolbar-button" onClick={props.onUploadImage} disabled={props.disabled} title="上传图片">
        <ImagePlus size={16} />
        <span>图片</span>
      </button>
    </div>
  );
}
