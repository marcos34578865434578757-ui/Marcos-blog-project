import { beforeEach, describe, expect, it, vi } from "vitest";

const { accessMock, listDraftsMock, readFileMock, readdirMock } = vi.hoisted(() => ({
  accessMock: vi.fn(),
  listDraftsMock: vi.fn(),
  readFileMock: vi.fn(),
  readdirMock: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  default: {
    access: accessMock,
    readFile: readFileMock,
    readdir: readdirMock,
  },
  access: accessMock,
  readFile: readFileMock,
  readdir: readdirMock,
}));

vi.mock("@/lib/services/blob-store", () => ({
  listDrafts: listDraftsMock,
}));

describe("content category queries", () => {
  beforeEach(() => {
    vi.resetModules();
    accessMock.mockReset();
    listDraftsMock.mockReset();
    readFileMock.mockReset();
    readdirMock.mockReset();
  });

  it("builds public categories only from published articles", async () => {
    readdirMock.mockResolvedValue(["project.mdx", "draft.mdx"]);
    readFileMock.mockImplementation(async (pathname: string) => {
      if (pathname.includes("project.mdx")) {
        return `---
title: "Project"
slug: "project"
date: "2026-05-17"
description: ""
tags: []
category: "项目展示"
status: "published"
redirectFrom: []
---

Hello`;
      }

      return `---
title: "Draft"
slug: "draft"
date: "2026-05-17"
description: ""
tags: []
category: "学习路线"
status: "draft"
redirectFrom: []
---

Hidden`;
    });
    listDraftsMock.mockResolvedValue([]);

    const { getPublicCategories } = await import("./posts");
    await expect(getPublicCategories()).resolves.toEqual(["项目展示"]);
  });

  it("builds admin categories from published and draft articles with alias normalization", async () => {
    readdirMock.mockResolvedValue(["published.mdx"]);
    readFileMock.mockResolvedValue(`---
title: "Published"
slug: "published"
date: "2026-05-17"
description: ""
tags: []
category: "Notes"
status: "published"
redirectFrom: []
---

Hello`);
    listDraftsMock.mockResolvedValue([
      { category: "AI工具箱" },
      { category: "项目展示" },
      { category: "" },
    ]);

    const { getAdminCategories } = await import("./posts");
    await expect(getAdminCategories()).resolves.toEqual(["未分类", "项目展示", "AI 工具箱"]);
  });

  it("supports both Chinese category names and route slugs in posts filtering", async () => {
    const { resolvePostsCategoryFilter } = await import("./posts");

    expect(resolvePostsCategoryFilter("projects")).toBe("项目展示");
    expect(resolvePostsCategoryFilter("AI工具箱")).toBe("AI 工具箱");
    expect(resolvePostsCategoryFilter("learning")).toBe("学习路线");
  });
});
