import type { ReactNode } from "react";
import type { CalloutBlock } from "@/lib/content/directives";

const labels: Record<CalloutBlock["type"], string> = {
  info: "Info",
  note: "Note",
  warning: "Warning",
  success: "Success",
};

export function Callout({
  type,
  title,
  children,
}: {
  type: CalloutBlock["type"];
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside
      className="my-5 rounded-md border border-line bg-surface-soft px-4 py-3 text-sm leading-7"
      data-callout-type={type}
      data-directive="callout"
    >
      <p className="m-0 text-sm font-semibold text-accent-strong">{title || labels[type]}</p>
      <div className="mt-2">{children}</div>
    </aside>
  );
}
