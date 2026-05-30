import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { Mail, Cpu, Layers, Sparkles, ExternalLink, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "关于 - Marcos Notes",
  description: "关于 Marcos Notes 博客项目及作者 Marcos 的介绍。",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-12">
        {/* Header Hero Section */}
        <section className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">About This Site</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-accent to-emerald-800 bg-clip-text text-transparent">
            关于 Marcos Notes
          </h1>
          <p className="mt-4 text-muted max-w-2xl mx-auto text-base md:text-lg">
            一个专为个人写作打造的轻量级 CMS 博客系统，致力于极致的创作流与沉浸式的阅读体验。
          </p>
        </section>

        {/* Main Grid Layout */}
        <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr] items-start">
          
          {/* Left Column: Project Introduction */}
          <div className="space-y-8">
            <section className="soft-panel p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-line/65 pb-4">
                <div className="p-2 rounded-xl bg-accent-soft text-accent-strong shrink-0">
                  <Cpu size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">项目设计初衷</h2>
                  <p className="text-xs text-muted">Core Philosophy & Motivation</p>
                </div>
              </div>
              
              <div className="prose-blog text-muted space-y-4">
                <p>
                  传统的博客系统要么过于繁重（如 WordPress），要么缺少便捷的在线编辑与动态更新能力（如纯 Hexo/Hugo 静态站）。
                </p>
                <p>
                  <strong>Marcos Notes</strong> 采用了混合架构（Hybrid Architecture）：
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>极致的静态性能</strong>：面向读者的前端页面全部由 Next.js 进行静态预渲染（SSG），加载速度极快，且天然具备出色的 SEO。</li>
                  <li><strong>便捷的管理体验</strong>：后台通过 Vercel Blob 进行快速的草稿迭代、媒体上传与临时保存，提供像云笔记一样丝滑的编辑体验。</li>
                  <li><strong>Git 级的内容版本控制</strong>：一旦内容确认发布，系统会将草稿自动编译成 Markdown 并同步至 GitHub 仓库，随后触发 Vercel CI/CD 管道重新生成静态页面。</li>
                </ul>
              </div>
            </section>

            <section className="soft-panel p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-line/65 pb-4">
                <div className="p-2 rounded-xl bg-accent-soft text-accent-strong shrink-0">
                  <Layers size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">技术栈与架构</h2>
                  <p className="text-xs text-muted">Tech Stack & Infrastructure</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-2xl bg-surface-soft border border-line/50 hover:border-accent/40 transition">
                  <span className="font-semibold text-foreground text-sm block mb-1">⚡️ 前端渲染</span>
                  <p className="text-xs text-muted leading-relaxed">
                    Next.js + React (v19) + TypeScript。利用 React Markdown 提供灵活的高级排版，利用 Tailwind CSS v4 构建精致的视觉样式。
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-surface-soft border border-line/50 hover:border-accent/40 transition">
                  <span className="font-semibold text-foreground text-sm block mb-1">📦 媒体与草稿存储</span>
                  <p className="text-xs text-muted leading-relaxed">
                    使用 Vercel Blob 作为媒体和草稿的存储后端，完美承载图片资源和云端未发布草稿。
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-surface-soft border border-line/50 hover:border-accent/40 transition">
                  <span className="font-semibold text-foreground text-sm block mb-1">🔄 CI/CD 自动流</span>
                  <p className="text-xs text-muted leading-relaxed">
                    文章发布自动推送至 GitHub。通过 Webhook 触发 Vercel 自动化部署，实现从「编辑保存」到「全网公开」的端到端自动化。
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-surface-soft border border-line/50 hover:border-accent/40 transition">
                  <span className="font-semibold text-foreground text-sm block mb-1">🎨 卓越的编辑体验</span>
                  <p className="text-xs text-muted leading-relaxed">
                    内置左右分栏 Markdown 实时预览工作台，配备垂直粘性工具栏、快捷操作浮窗、快速图片上传和交互式新建分类功能。
                  </p>
                </div>
              </div>
            </section>

            <section className="soft-panel p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-line/65 pb-4">
                <div className="p-2 rounded-xl bg-accent-soft text-accent-strong shrink-0">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">后续演进路线</h2>
                  <p className="text-xs text-muted">Future Roadmap & Ideas</p>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-muted">
                <div className="flex items-start gap-2.5">
                  <div className="mt-1 size-1.5 rounded-full bg-accent shrink-0" />
                  <span>支持从飞书、Obsidian 导出的 Markdown 文件进行智能高保真解析与导入。</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-1 size-1.5 rounded-full bg-accent shrink-0" />
                  <span>文章版本历史管理：集成简洁的分支或修订历史回溯。</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-1 size-1.5 rounded-full bg-accent shrink-0" />
                  <span>智能媒体资产管理：自动识别与清理未被引用的历史遗留图片。</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-1 size-1.5 rounded-full bg-accent shrink-0" />
                  <span>自定义 MDX 增强组件：支持折叠面板、互动沙盒等更多丰富排版手段。</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Author Information Column */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="soft-panel p-6 space-y-6 relative overflow-hidden">
              {/* Decorative gradient light */}
              <div className="absolute -top-12 -right-12 size-24 rounded-full bg-accent/20 blur-xl pointer-events-none" />

              <div className="text-center space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="size-20 rounded-full mx-auto border-2 border-accent/80 p-0.5 object-cover shadow-md transition-transform duration-300 hover:scale-105 hover:rotate-3"
                  src="/avatar.png"
                  alt="Marcos Avatar"
                />
                <div>
                  <h3 className="text-lg font-bold text-foreground">Marcos Wu</h3>
                  <p className="text-xs text-accent font-medium mt-0.5">站点主理人 / 开发者</p>
                </div>
                <p className="text-xs text-muted px-2">
                  对前沿技术充满热情的折腾者，喜欢探索现代 Web 开发与 AI 协作的最佳实践。
                </p>
              </div>

              <div className="border-t border-line/60 pt-5 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-3">我的专栏 & 社交媒体</span>
                
                <a
                  href="https://github.com/Marcos-wu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-soft border border-line/40 hover:border-accent/40 hover:bg-accent-soft/30 transition group"
                >
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" className="size-[18px] text-muted group-hover:text-accent fill-current transition-colors" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    <span className="text-sm font-medium text-foreground">GitHub 专栏</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted group-hover:text-accent-strong transition-colors">
                    <span>@Marcos-wu</span>
                    <ExternalLink size={12} />
                  </div>
                </a>

                <a
                  href="https://x.com/Leochalikes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-soft border border-line/40 hover:border-accent/40 hover:bg-accent-soft/30 transition group"
                >
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" className="size-[18px] text-muted group-hover:text-accent fill-current transition-colors" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-sm font-medium text-foreground">X (Twitter)</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted group-hover:text-accent-strong transition-colors">
                    <span>@Leochalikes</span>
                    <ExternalLink size={12} />
                  </div>
                </a>

                <a
                  href="mailto:2768073859@qq.com"
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-soft border border-line/40 hover:border-accent/40 hover:bg-accent-soft/30 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-muted group-hover:text-accent transition-colors" />
                    <span className="text-sm font-medium text-foreground">电子邮件</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted group-hover:text-accent-strong transition-colors">
                    <span>2768073859@qq.com</span>
                    <ExternalLink size={12} />
                  </div>
                </a>
              </div>

              <div className="border-t border-line/60 pt-4 flex items-center justify-between text-[11px] text-muted">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-accent" />
                  站点已启用 SSL 安全加密
                </span>
                <span>v1.2.0</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
