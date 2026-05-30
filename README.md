# Marcos Notes 🚀

> 一个基于 Next.js 和 Vercel 构建的现代化、高性能个人博客系统与轻量级 CMS 管理后台。

![Blog Preview](https://via.placeholder.com/1000x500.png?text=Marcos+Notes+-+Personal+Blog+System)

## ✨ 项目简介 (Overview)

Marcos Notes 是一套专为开发者打造的全栈个人博客系统。它摒弃了笨重的传统数据库，通过 **Vercel Blob** 作为草稿箱与图片存储，并利用 **GitHub API** 直接将内容推送到代码仓库。每次发布都会自动触发 Vercel 构建，从而生成极致性能的静态站点（SSG）。

此外，项目在前端呈现上大量运用了现代 Web 设计美学，如毛玻璃效果（Glassmorphism）、平滑过渡动画以及精心调优的阅读排版，力求带来令人惊艳的视觉和交互体验。

## 🌟 核心特性 (Features)

### 🎨 前端体验 (Frontend)
- **极致的视觉设计**：大范围应用毛玻璃（Backdrop Blur）、平滑过渡动画、动态交互组件，打造具有现代感和呼吸感的极客风 UI。
- **流畅的阅读体验**：
  - 文章区域自带独立毛玻璃质感包裹框。
  - 右侧提供**智能滚动的高亮目录（TOC）**，鼠标悬浮即可独立滚动，不再随页面整体乱跑。
  - 文章发布日期、阅读时长估算、多分类与多标签的动态展示。
- **全站响应式设计**：完美适配 PC、平板和移动端，各个断点下均有最佳视觉效果。

### 🛠️ 强大的后台管理 (CMS Admin)
- **所见即所得的 Markdown 编辑器**：
  - 支持快捷工具栏（H2、加粗、代码块、列表等）。
  - **工具栏自动悬浮左侧**（贴边设计），即使编写长文也能快速呼出操作。
  - **独立居中弹窗预览**，沉浸式实时查看渲染效果，预览面板同样带有粘性（Sticky）目录导航。
- **元信息管理 (Meta Info)**：直观的面板用于设置文章摘要、动态新建分类、添加/删除标签以及修改自定义时间。
- **原生文件上传与导入**：
  - 支持直接粘贴/上传图片至 Vercel Blob。
  - 完美支持外部文件导入：单 `.md`、`.mdx`，或者打包成 `.zip`（支持解析 Obsidian 的 `![[image.png]]` 格式语法）。
- **安全的草稿同步机制**：结合 Vercel Edge 边缘缓存自动失效机制，确保草稿与线上正式发布的数据完美同步。

## 🏗️ 架构与技术栈 (Architecture)

- **框架**：[Next.js](https://nextjs.org/) (App Router)
- **样式**：[TailwindCSS](https://tailwindcss.com/) + CSS 原生变量
- **内容解析**：`gray-matter`, 自定义 MDX 解析器（安全隔离的 GFM 支持）
- **数据存储 & 托管**：
  - 静态页面托管：**Vercel**
  - 图床与临时草稿箱：**Vercel Blob**
  - 持久化内容存储：**GitHub Repository** (利用 Contents API 自动提交 Commit)

## 🚀 本地开发与部署 (Quick Start)

### 1. 环境准备
确保你的电脑已经安装了 Node.js (建议 v18+)，并克隆本仓库：
```bash
git clone https://github.com/Marcos-wu/Marcos-blog-project.git
cd Marcos-blog-project
npm install
```

### 2. 配置环境变量
复制 `.env.example` 文件并重命名为 `.env.local`：
```bash
cp .env.example .env.local
```
请在其中填入以下必须的环境变量：
- `ADMIN_PASSWORD`: 进入后台的管理员密码
- `ADMIN_SESSION_SECRET`: 会话加密密钥（随机长字符串）
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob 的读写 Token
- `GITHUB_TOKEN`: 具备仓库读写权限的 GitHub Personal Access Token
- `GITHUB_OWNER`: GitHub 用户名 (Marcos-wu)
- `GITHUB_REPO`: GitHub 仓库名 (Marcos-blog-project)
- `GITHUB_BRANCH`: 推送内容的目标分支 (默认 master 或 main)
- `NEXT_PUBLIC_SITE_URL`: 你的博客前台线上地址

### 3. 运行项目
```bash
npm run dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可查看前台页面。
访问 `http://localhost:3000/admin` 即可登录并使用后台创作功能。

## 📄 目录结构简述

- `src/app/`: Next.js 路由核心，包含了前台展示 (`/posts`, `/about` 等) 和后台管理 (`/admin`) 以及 API 路由。
- `src/components/`: 可复用组件，如站点头部 (`SiteHeader`)，Markdown 渲染组件 (`MarkdownBody`) 以及后台编辑器组件 (`PostEditor`, `MarkdownToolbar` 等)。
- `src/content/posts/`: 发布后的所有文章最终都会以 `.md` 或 `.mdx` 落地于此。
- `src/lib/`: 工具函数库，包括云端 Blob 存储服务 (`blob-store.ts`)、GitHub API 交互 (`github.ts`) 及 Markdown 解析逻辑。

## 👨‍💻 作者 (Author)
- **GitHub**: [@Marcos-wu](https://github.com/Marcos-wu)
- **X (Twitter)**: [@Leochalikes](https://x.com/Leochalikes)
- **Email**: 2768073859@qq.com

---
*Built with ❤️ utilizing the power of Agentic Coding & Next.js Ecosystem.*
