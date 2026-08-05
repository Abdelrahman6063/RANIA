import { useEffect, useMemo } from "react";

type Props = {
  onDone: () => void;
  duration?: number;
};

/** Luxe unlock transition: a beating heart lifts petals, then blooms over the screen. */
export function HeartBurst({ onDone, duration = 1400 }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [onDone, duration]);

  const petals = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: `${(i * 6.1 + (i % 3) * 7) % 96}%`,
        delay: `${(i % 8) * 0.05}s`,
        dur: `${1.1 + (i % 5) * 0.18}s`,
        dx: `${(i % 2 === 0 ? 1 : -1) * (20 + (i % 6) * 14)}px`,
        size: 10 + (i % 4) * 6,
        glyph: ["🤍", "🌸", "✨", "♥"][i % 4],
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/95 backdrop-blur-xl">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 select-none"
          style={{
            left: p.left,
            fontSize: p.size,
            // @ts-expect-error custom property
            "--dx": p.dx,
            animation: `petal-rise ${p.dur} linear ${p.delay} forwards`,
          }}
        >
          {p.glyph}
        </span>
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div
            className="text-primary drop-shadow-[0_0_40px_var(--rose)]"
            style={{ animation: "heart-beat 0.45s ease-in-out 2, heart-burst 1.4s ease-in forwards" }}
          >
            <svg viewBox="0 0 32 29" className="h-24 w-24 fill-current">
              <path d="M16 29S0 18.6 0 9.6C0 4.3 4.2 0 9.3 0 12.2 0 14.8 1.4 16 3.6 17.2 1.4 19.8 0 22.7 0 27.8 0 32 4.3 32 9.6 32 18.6 16 29 16 29z" />
            </svg>
          </div>
          <p className="mt-6 font-display text-lg tracking-widest text-accent">
            بيفتح لكِ القلب…
          </p>
        </div>
      </div>
    </div>
  );
}