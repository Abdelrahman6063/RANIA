import { useMemo } from "react";

/** جو خفيف جدًا: أضواء ناعمة + ورد بسيط يتساقط، بدون تأثير على الأداء. */
export function Ambience() {
  const petals = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        left: `${8 + i * 13}%`,
        delay: `${i * 2.4}s`,
        dur: `${16 + (i % 3) * 5}s`,
        dx: `${(i % 2 === 0 ? 1 : -1) * (18 + i * 6)}px`,
        size: 11 + (i % 3) * 4,
        glyph: ["🌸", "🤍", "✨"][i % 3],
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-24 -right-16 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.16 350 / 28%), transparent 70%)",
          animation: "ambient-glow 14s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/3 -left-20 h-80 w-80 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, oklch(0.62 0.12 88 / 18%), transparent 70%)",
          animation: "ambient-glow 18s ease-in-out 2s infinite",
        }}
      />
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 select-none"
          style={{
            left: p.left,
            fontSize: p.size,
            // @ts-expect-error custom property
            "--dx": p.dx,
            animation: `petal-drift ${p.dur} linear ${p.delay} infinite`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
