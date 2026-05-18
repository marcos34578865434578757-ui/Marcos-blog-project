import type { Metadata } from "next";
import { Boxes } from "lucide-react";
import { CategoryArchivePage } from "@/components/CategoryArchivePage";
import { getPublishedPostsForSection } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "项目展示",
  description: "查看归档在“项目展示”分类下的已发布文章与实践记录。",
};

export default async function ProjectsPage() {
  const posts = await getPublishedPostsForSection("projects");

  return (
    <CategoryArchivePage
      eyebrow="Projects"
      title="项目展示"
      description="整理正在做、已经完成，或值得复盘的产品、网站与实验。"
      icon={<Boxes size={21} />}
      posts={posts}
      emptyTitle="还没有项目展示文章"
      emptyBody="等你发布归类到“项目展示”的文章后，这里就会开始形成一个项目归档页。"
    />
  );
}
