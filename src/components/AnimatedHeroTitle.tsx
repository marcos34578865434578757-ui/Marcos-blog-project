export function AnimatedHeroTitle({ text }: { text: string }) {
  return (
    <h1
      className="animated-hero-title mt-5 max-w-3xl text-5xl font-semibold leading-[0.92] tracking-tight md:text-7xl"
      aria-label={text}
    >
      <span aria-hidden="true" className="animated-hero-title__shadow">
        {text}
      </span>
      <span aria-hidden="true" className="animated-hero-title__line">
        {text}
      </span>
    </h1>
  );
}
