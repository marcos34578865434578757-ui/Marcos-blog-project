export function slugify(input: string) {
  const normalized = input
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `post-${Date.now()}`;
}

export function ensureMdxFilename(slug: string) {
  return `${slugify(slug)}.mdx`;
}
