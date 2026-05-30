"use client";

import { useEffect, useRef, useState } from "react";

let mermaidIdCounter = 0;

export function Mermaid({ code }: { code: string }) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const uniqueId = `mermaid-${++mermaidIdCounter}`;

    const renderDiagram = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          themeVariables: {
            background: "#16241e",
            primaryColor: "#1f4635",
            primaryTextColor: "#eef8f1",
            lineColor: "#2c4639",
          }
        });

        const { svg: renderedSvg } = await mermaid.render(uniqueId, code);
        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err: any) {
        console.error("Mermaid render error:", err);
        if (isMounted) {
          setError(err.message || "无法渲染 Mermaid 图表，请检查语法。");
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [code]);

  if (error) {
    return (
      <pre className="my-5 overflow-x-auto rounded-md border border-warn/30 bg-warn/10 p-4 text-xs text-warn">
        <code>{error}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="my-5 flex items-center justify-center rounded-md border border-line bg-surface-soft p-8 text-sm text-muted animate-pulse">
        正在渲染知识图谱...
      </div>
    );
  }

  return (
    <div
      className="my-6 overflow-x-auto rounded-xl border border-line bg-surface-soft p-6 flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
