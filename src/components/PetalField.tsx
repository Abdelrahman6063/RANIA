import { useMemo } from "react";

const GLYPHS = ["♥", "✦", "❁", "✧", "🌸", "🤍"];

export function PetalField({ count = 18 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 97) % 100,
        delay: (i * 1.37) % 12,
        dur: 12 + ((i * 3) % 10),
        size: 10 + ((i * 5) % 14),
        drift: ((i % 2 === 0 ? 1 : -1) * (30 + (i * 11) % 90)),
        glyph: GLYPHS[i % GLYPHS.length],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            color: p.id % 3 === 0 ? "var(--gold)" : "var(--rose)",
            opacity: 0.5,
            animation: `petal-fall ${p.dur}s linear ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
