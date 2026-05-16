import type { CSSProperties } from "react";
import { Caveat } from "next/font/google";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const lines = [
  "Welcome to Marcos's blog",
  "Building a digital garden with AI, from scratch",
];

export function AnimatedHeroSubtitle() {
  return (
    <div
      className={`animated-hero-subtitle mt-6 max-w-3xl ${caveat.className}`}
      aria-label={lines.join(" ")}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");

        return (
          <span className="animated-hero-subtitle__line" key={line}>
            {words.map((word, wordPosition) => {
              const chars = Array.from(word);
              const wordIndex =
                lines
                  .slice(0, lineIndex)
                  .join(" ")
                  .replace(/\s/g, "").length +
                words
                  .slice(0, wordPosition)
                  .join("")
                  .length;

              return (
                <span
                  className="animated-hero-subtitle__word"
                  key={`${lineIndex}-${word}-${wordIndex}`}
                  style={
                    {
                      "--line-direction": lineIndex % 2 === 0 ? -1 : 1,
                      "--word-index": wordIndex,
                    } as CSSProperties
                  }
                >
                  <span className="animated-hero-subtitle__word-inner">
                    {chars.map((char, index) => {
                      const currentIndex = wordIndex + index;
                      return (
                        <span
                          className="animated-hero-subtitle__char"
                          key={`${word}-${currentIndex}`}
                          style={{ "--char-index": currentIndex } as CSSProperties}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
}
