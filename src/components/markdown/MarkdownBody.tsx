import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Callout } from "@/components/markdown/Callout";
import { LinkCard } from "@/components/markdown/LinkCard";
import { Mermaid } from "@/components/markdown/Mermaid";
import { parseDirectiveBlocks } from "@/lib/content/directives";
import { slugify } from "@/lib/content/slug";

export function MarkdownBody({ content }: { content: string }) {
  const { blocks } = parseDirectiveBlocks(content);

  return (
    <>
      {blocks.map((block, index) => {
        if (block.kind === "callout") {
          return (
            <Callout key={`${block.kind}-${index}`} title={block.title} type={block.type}>
              <MarkdownFragment content={block.content} />
            </Callout>
          );
        }

        if (block.kind === "link-card") {
          return <LinkCard key={`${block.kind}-${index}`} description={block.description} title={block.title} url={block.url} />;
        }

        return <MarkdownFragment key={`${block.kind}-${index}`} content={block.content} />;
      })}
    </>
  );
}

function MarkdownFragment({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        h2: ({ children }) => {
          const id = slugify(String(children));
          return <h2 id={id}>{children}</h2>;
        },
        h3: ({ children }) => {
          const id = slugify(String(children));
          return <h3 id={id}>{children}</h3>;
        },
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          if (match && match[1] === "mermaid") {
            return <Mermaid code={String(children).replace(/\n$/, "")} />;
          }
          return <code className={className} {...props}>{children}</code>;
        },
        pre: ({ children }) => {
          const isMermaid = React.isValidElement(children) &&
            children.props &&
            (children.props as any).className === "language-mermaid";
          if (isMermaid) {
            return <>{children}</>;
          }
          return <pre>{children}</pre>;
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

