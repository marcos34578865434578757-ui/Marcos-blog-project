# Marcos Notes

A Vercel-first personal blog and lightweight CMS.

## Architecture

- Public posts live in `src/content/posts/*.mdx`.
- Drafts are stored in Vercel Blob under `drafts/{slug}.json`.
- Uploaded and imported images are stored in Vercel Blob under `posts/{slug}/{uuid}.{ext}`.
- Publishing writes the final article file to GitHub with the Contents API, which triggers a Vercel deploy.
- V1 renders Markdown safely with GFM and sanitization. Arbitrary MDX JSX is intentionally not enabled.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

For admin features, configure:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `NEXT_PUBLIC_SITE_URL`

## Supported Import Formats

- Single `.md`
- Single `.mdx`
- Single `.zip` bundle containing one Markdown article and related local assets

The importer handles normal Markdown image paths and Obsidian image syntax like `![[image.png]]`.
