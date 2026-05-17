import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarkdownBody } from "./MarkdownBody";

describe("MarkdownBody directive rendering", () => {
  it("renders controlled callout and link card components", () => {
    const html = renderToStaticMarkup(
      <MarkdownBody
        content={`:::callout type="info" title="Heads up"
Useful note.
:::

:::link-card
url: https://example.com
title: Example
description: External resource
:::`}
      />,
    );

    expect(html).toContain("data-directive=\"callout\"");
    expect(html).toContain("Heads up");
    expect(html).toContain("Useful note.");
    expect(html).toContain("data-directive=\"link-card\"");
    expect(html).toContain("href=\"https://example.com\"");
    expect(html).toContain("External resource");
  });
});
