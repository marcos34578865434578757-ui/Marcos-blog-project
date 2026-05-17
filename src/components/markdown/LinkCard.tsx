import { ArrowUpRight } from "lucide-react";

export function LinkCard({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description?: string;
}) {
  return (
    <a
      className="my-5 flex items-start justify-between gap-4 rounded-md border border-line bg-surface-soft p-4 no-underline transition hover:border-accent hover:bg-accent-soft"
      data-directive="link-card"
      href={url}
      rel="noreferrer"
      target="_blank"
    >
      <span>
        <span className="block font-semibold text-foreground">{title}</span>
        {description ? <span className="mt-1 block text-sm leading-6 text-muted">{description}</span> : null}
        <span className="mt-2 block break-all font-mono text-xs text-accent">{url}</span>
      </span>
      <ArrowUpRight aria-hidden="true" className="mt-1 shrink-0 text-accent" size={18} />
    </a>
  );
}
