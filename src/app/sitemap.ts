import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/content/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const posts = await getPublishedPosts();

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/posts`, lastModified: new Date() },
    { url: `${siteUrl}/about`, lastModified: new Date() },
    ...posts.map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.date),
    })),
  ];
}
