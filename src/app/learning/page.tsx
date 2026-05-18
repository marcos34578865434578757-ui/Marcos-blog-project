import type { Metadata } from "next";
import { Route } from "lucide-react";
import { CategoryArchivePage } from "@/components/CategoryArchivePage";
import { getPublishedPostsForSection } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "学习路线",
  description: "查看归档在“学习路线”分类下的学习计划、阶段复盘与方法总结。",
};

export default async function LearningPage() {
  const posts = await getPublishedPostsForSection("learning");

  return (
    <CategoryArchivePage
      eyebrow="Learning"
      title="学习路线"
      description="记录技术、产品和写作方向的阶段性路线，把目标、资料和复盘串起来。"
      icon={<Route size={21} />}
      posts={posts}
      emptyTitle="还没有学习路线文章"
      emptyBody="等你发布归类到“学习路线”的文章后，这里会展示每一阶段的学习记录和方法总结。"
    />
  );
}
