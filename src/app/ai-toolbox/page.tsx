import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { CategoryArchivePage } from "@/components/CategoryArchivePage";
import { getPublishedPostsForSection } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "AI 工具箱",
  description: "查看归档在“AI 工具箱”分类下的工具实践、提示词与自动化文章。",
};

export default async function AiToolboxPage() {
  const posts = await getPublishedPostsForSection("ai-toolbox");

  return (
    <CategoryArchivePage
      eyebrow="AI Toolbox"
      title="AI 工具箱"
      description="沉淀常用 AI 工具、提示词模板和自动化流程，让写作与发布更顺手。"
      icon={<Sparkles size={21} />}
      posts={posts}
      emptyTitle="还没有 AI 工具箱文章"
      emptyBody="等你发布归类到“AI 工具箱”的文章后，这里会变成一份持续增长的工具归档。"
    />
  );
}
