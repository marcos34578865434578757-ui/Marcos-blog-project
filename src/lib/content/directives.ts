export type DirectiveWarning = {
  line: number;
  message: string;
};

export type MarkdownBlock = {
  kind: "markdown";
  content: string;
};

export type CalloutBlock = {
  kind: "callout";
  type: "info" | "note" | "warning" | "success";
  title?: string;
  content: string;
};

export type LinkCardBlock = {
  kind: "link-card";
  url: string;
  title: string;
  description?: string;
};

export type DirectiveBlock = MarkdownBlock | CalloutBlock | LinkCardBlock;

const calloutTypes = new Set<CalloutBlock["type"]>(["info", "note", "warning", "success"]);

export function parseDirectiveBlocks(content: string): {
  blocks: DirectiveBlock[];
  warnings: DirectiveWarning[];
} {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: DirectiveBlock[] = [];
  const warnings: DirectiveWarning[] = [];
  const markdownBuffer: string[] = [];

  function flushMarkdown() {
    const markdown = normalizeMarkdown(markdownBuffer.join("\n"));
    markdownBuffer.length = 0;
    if (markdown) blocks.push({ kind: "markdown", content: markdown });
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const start = /^:::(callout|link-card)\b(.*)$/.exec(line.trim());

    if (!start) {
      markdownBuffer.push(line);
      continue;
    }

    flushMarkdown();

    const directiveName = start[1] as "callout" | "link-card";
    const directiveLine = index + 1;
    const closingIndex = findClosingFence(lines, index + 1);
    const source = lines.slice(index, closingIndex === -1 ? lines.length : closingIndex + 1).join("\n");

    if (closingIndex === -1) {
      warnings.push({
        line: directiveLine,
        message:
          directiveName === "callout"
            ? "Callout directive is missing a closing ::: fence."
            : "LinkCard directive is missing a closing ::: fence.",
      });
      blocks.push({ kind: "markdown", content: normalizeMarkdown(source) });
      break;
    }

    const innerContent = normalizeMarkdown(lines.slice(index + 1, closingIndex).join("\n"));

    if (directiveName === "callout") {
      const attrs = parseAttributes(start[2]);
      const requestedType = attrs.type ?? "info";
      const type = calloutTypes.has(requestedType as CalloutBlock["type"]) ? (requestedType as CalloutBlock["type"]) : "info";

      if (requestedType !== type) {
        warnings.push({
          line: directiveLine,
          message: `Callout directive type "${requestedType}" is not supported; using "info".`,
        });
      }

      blocks.push({
        kind: "callout",
        type,
        title: attrs.title,
        content: innerContent,
      });
    } else {
      const fields = parseYamlLikeFields(innerContent);
      const url = fields.url?.trim() ?? "";
      const title = fields.title?.trim() || url;

      if (!isHttpUrl(url)) {
        warnings.push({
          line: directiveLine,
          message: "LinkCard directive requires an http or https URL.",
        });
        blocks.push({ kind: "markdown", content: linkCardFallback(title, url, source) });
      } else {
        blocks.push({
          kind: "link-card",
          url,
          title,
          description: fields.description?.trim() || undefined,
        });
      }
    }

    index = closingIndex;
  }

  flushMarkdown();

  return { blocks, warnings };
}

export function getDirectiveWarnings(content: string) {
  return parseDirectiveBlocks(content).warnings;
}

function findClosingFence(lines: string[], startIndex: number) {
  for (let index = startIndex; index < lines.length; index += 1) {
    if (lines[index].trim() === ":::") return index;
  }
  return -1;
}

function normalizeMarkdown(content: string) {
  return content.replace(/^\n+|\n+$/g, "");
}

function parseAttributes(source: string) {
  const attrs: Record<string, string> = {};
  const attrPattern = /(\w+)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g;
  let match: RegExpExecArray | null;

  while ((match = attrPattern.exec(source)) !== null) {
    attrs[match[1]] = match[2] ?? match[3] ?? match[4] ?? "";
  }

  return attrs;
}

function parseYamlLikeFields(content: string) {
  const fields: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const match = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line.trim());
    if (match) fields[match[1]] = match[2];
  }

  return fields;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function linkCardFallback(title: string, url: string, source: string) {
  if (title && url) return `[${title}](${url})`;
  return normalizeMarkdown(source);
}
