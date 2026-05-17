import { describe, expect, it } from "vitest";
import { applyMarkdownCommand, insertTextAtSelection, parseTagInput } from "./markdown-editor";

describe("markdown editor helpers", () => {
  it("wraps selected text with emphasis markers", () => {
    const result = applyMarkdownCommand(
      {
        value: "Hello world",
        selectionStart: 6,
        selectionEnd: 11,
      },
      "bold",
    );

    expect(result.value).toBe("Hello **world**");
    expect(result.selectionStart).toBe(8);
    expect(result.selectionEnd).toBe(13);
  });

  it("prefixes the current line for headings and lists", () => {
    const heading = applyMarkdownCommand(
      {
        value: "Roadmap",
        selectionStart: 0,
        selectionEnd: 7,
      },
      "h2",
    );

    const list = applyMarkdownCommand(
      {
        value: "Item one\nItem two",
        selectionStart: 0,
        selectionEnd: 16,
      },
      "bulleted-list",
    );

    expect(heading.value).toBe("## Roadmap");
    expect(list.value).toBe("- Item one\n- Item two");
  });

  it("inserts placeholder content when the selection is empty", () => {
    const result = applyMarkdownCommand(
      {
        value: "",
        selectionStart: 0,
        selectionEnd: 0,
      },
      "code-block",
    );

    expect(result.value).toBe("```\ncode block\n```");
    expect(result.selectionStart).toBe(4);
    expect(result.selectionEnd).toBe(14);
  });

  it("inserts arbitrary text at the stored cursor position", () => {
    const result = insertTextAtSelection(
      {
        value: "Hello world",
        selectionStart: 6,
        selectionEnd: 11,
      },
      "planet",
    );

    expect(result.value).toBe("Hello planet");
    expect(result.selectionStart).toBe(12);
    expect(result.selectionEnd).toBe(12);
  });

  it("parses tag input with enter, English comma, and Chinese comma semantics", () => {
    expect(parseTagInput("react, next， cms\nblog")).toEqual(["react", "next", "cms", "blog"]);
  });
});
