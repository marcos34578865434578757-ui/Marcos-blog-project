export type EditorSelection = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export type EditorEditResult = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export type MarkdownCommand =
  | "h2"
  | "h3"
  | "bold"
  | "italic"
  | "inline-code"
  | "code-block"
  | "quote"
  | "bulleted-list"
  | "todo-list"
  | "link"
  | "image";

function replaceSelection(
  input: EditorSelection,
  before: string,
  placeholder: string,
  after = "",
): EditorEditResult {
  const selected = input.value.slice(input.selectionStart, input.selectionEnd);
  const content = selected || placeholder;
  const value =
    input.value.slice(0, input.selectionStart) +
    before +
    content +
    after +
    input.value.slice(input.selectionEnd);

  return {
    value,
    selectionStart: input.selectionStart + before.length,
    selectionEnd: input.selectionStart + before.length + content.length,
  };
}

function getLineRange(value: string, selectionStart: number, selectionEnd: number) {
  const start = value.lastIndexOf("\n", Math.max(0, selectionStart - 1)) + 1;
  const lineBreak = value.indexOf("\n", selectionEnd);
  const end = lineBreak === -1 ? value.length : lineBreak;
  return { start, end };
}

function prefixLines(input: EditorSelection, prefix: string, emptyLineFallback?: string): EditorEditResult {
  const range = getLineRange(input.value, input.selectionStart, input.selectionEnd);
  const block = input.value.slice(range.start, range.end);
  const replacement = block
    .split("\n")
    .map((line) => {
      if (!line.trim()) return emptyLineFallback ?? prefix.trimEnd();
      return `${prefix}${line}`;
    })
    .join("\n");

  const value = input.value.slice(0, range.start) + replacement + input.value.slice(range.end);
  return {
    value,
    selectionStart: range.start,
    selectionEnd: range.start + replacement.length,
  };
}

function wrapBlock(input: EditorSelection, fence: string, placeholder: string): EditorEditResult {
  const selected = input.value.slice(input.selectionStart, input.selectionEnd).trim();
  const body = selected || placeholder;
  const prefix = input.selectionStart > 0 && input.value[input.selectionStart - 1] !== "\n" ? "\n" : "";
  const suffix = input.selectionEnd < input.value.length && input.value[input.selectionEnd] !== "\n" ? "\n" : "";
  const insertion = `${prefix}${fence}\n${body}\n${fence}${suffix}`;
  const value = input.value.slice(0, input.selectionStart) + insertion + input.value.slice(input.selectionEnd);
  const bodyStart = input.selectionStart + prefix.length + fence.length + 1;

  return {
    value,
    selectionStart: bodyStart,
    selectionEnd: bodyStart + body.length,
  };
}

export function applyMarkdownCommand(input: EditorSelection, command: MarkdownCommand): EditorEditResult {
  switch (command) {
    case "h2":
      return prefixLines(input, "## ", "## ");
    case "h3":
      return prefixLines(input, "### ", "### ");
    case "bold":
      return replaceSelection(input, "**", "加粗内容", "**");
    case "italic":
      return replaceSelection(input, "*", "斜体内容", "*");
    case "inline-code":
      return replaceSelection(input, "`", "code", "`");
    case "code-block":
      return wrapBlock(input, "```", "code block");
    case "quote":
      return prefixLines(input, "> ", "> ");
    case "bulleted-list":
      return prefixLines(input, "- ", "- 列表项");
    case "todo-list":
      return prefixLines(input, "- [ ] ", "- [ ] 待办事项");
    case "link":
      return replaceSelection(input, "[", "链接文本", "](https://example.com)");
    case "image":
      return replaceSelection(input, "![", "图片描述", "](https://example.com/image.png)");
  }
}
