import type { CSSProperties } from "react";

export function AnimatedHeroTitle({ text }: { text: string }) {
  const characters = Array.from(text);

  return (
    <h1
      className="animated-hero-title mt-5 max-w-3xl text-5xl font-semibold leading-[0.92] tracking-tight md:text-7xl"
      aria-label={text}
    >
      <span aria-hidden="true" className="animated-hero-title__shadow">
        {text}
      </span>
      <span aria-hidden="true" className="animated-hero-title__line">
        {characters.map((char, index) => (
          <span
            className={char === " " ? "animated-hero-title__space" : "animated-hero-title__char"}
            key={`${char}-${index}`}
            style={{ "--char-index": index } as CSSProperties}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </h1>
  );
}
