import { describe, expect, it } from "vitest";
import { parseDirectiveBlocks } from "./directives";

describe("parseDirectiveBlocks", () => {
  it("parses valid callout blocks without warnings", () => {
    const result = parseDirectiveBlocks(`Before

:::callout type="warning" title="Check this"
Body **text**
:::

After`);

    expect(result.warnings).toEqual([]);
    expect(result.blocks).toEqual([
      { kind: "markdown", content: "Before" },
      {
        kind: "callout",
        type: "warning",
        title: "Check this",
        content: "Body **text**",
      },
      { kind: "markdown", content: "After" },
    ]);
  });

  it("parses valid link cards without warnings", () => {
    const result = parseDirectiveBlocks(`:::link-card
url: https://example.com/article
title: Example Article
description: Optional summary
:::
`);

    expect(result.warnings).toEqual([]);
    expect(result.blocks).toEqual([
      {
        kind: "link-card",
        url: "https://example.com/article",
        title: "Example Article",
        description: "Optional summary",
      },
    ]);
  });

  it("warns and falls back when a directive is not closed", () => {
    const source = `:::callout title="Oops"
Never closed`;
    const result = parseDirectiveBlocks(source);

    expect(result.warnings).toEqual([
      {
        line: 1,
        message: "Callout directive is missing a closing ::: fence.",
      },
    ]);
    expect(result.blocks).toEqual([{ kind: "markdown", content: source }]);
  });

  it("warns and falls back when a link card URL is invalid", () => {
    const result = parseDirectiveBlocks(`:::link-card
url: javascript:alert(1)
title: Bad Link
:::
`);

    expect(result.warnings).toEqual([
      {
        line: 1,
        message: "LinkCard directive requires an http or https URL.",
      },
    ]);
    expect(result.blocks).toEqual([{ kind: "markdown", content: "[Bad Link](javascript:alert(1))" }]);
  });
});
