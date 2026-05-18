import { slugify } from "./slug";

export const DEFAULT_CATEGORY = "未分类";

export const CATEGORY_PAGE_MAP = {
  projects: "项目展示",
  "ai-toolbox": "AI 工具箱",
  learning: "学习路线",
} as const;

const CATEGORY_ALIAS_MAP: Record<string, string> = {
  notes: DEFAULT_CATEGORY,
  "未分类": DEFAULT_CATEGORY,
  "ai工具箱": CATEGORY_PAGE_MAP["ai-toolbox"],
  "ai 工具箱": CATEGORY_PAGE_MAP["ai-toolbox"],
  "aitoolbox": CATEGORY_PAGE_MAP["ai-toolbox"],
  "ai-toolbox": CATEGORY_PAGE_MAP["ai-toolbox"],
  projects: CATEGORY_PAGE_MAP.projects,
  learning: CATEGORY_PAGE_MAP.learning,
};

function normalizeCategoryKey(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeCategory(value?: string | null) {
  const input = value?.trim();
  if (!input) return DEFAULT_CATEGORY;

  const alias = CATEGORY_ALIAS_MAP[normalizeCategoryKey(input)];
  if (alias) return alias;
  if (input === "Notes") return DEFAULT_CATEGORY;

  return input;
}

export function categoryToQueryValue(category: string) {
  const normalized = normalizeCategory(category);

  for (const [slug, label] of Object.entries(CATEGORY_PAGE_MAP)) {
    if (label === normalized) return slug;
  }

  return normalized;
}

export function resolveCategoryQuery(value?: string | null) {
  if (!value) return null;
  return normalizeCategory(value);
}

export function isCategoryMatch(category: string, query?: string | null) {
  const resolved = resolveCategoryQuery(query);
  if (!resolved) return true;
  return normalizeCategory(category) === resolved;
}

export function sortCategories(categories: string[]) {
  return [...categories].sort((left, right) => left.localeCompare(right, "zh-CN"));
}

export function dedupeCategories(categories: Array<string | null | undefined>) {
  return sortCategories([...new Set(categories.map((value) => normalizeCategory(value)).filter(Boolean))]);
}

export function createSafeCategorySlug(category: string) {
  return slugify(categoryToQueryValue(category));
}
