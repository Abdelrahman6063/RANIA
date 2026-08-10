import { useEffect, useState } from "react";

/**
 * Cinematic heart transition: a heart draws itself, pulses, then explodes
 * into petals/sparks while the veil dissolves to reveal the content.
 */
export function HeartTransition({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 2300);
    const t3 = setTimeout(onDone, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  const shards = Array.from({ length: 28 });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, oklch(0.22 0.06 330 / 96%), oklch(0.10 0.03 300 / 99%))",
        animation: phase === 2 ? "veil-out 0.9s ease forwards" : undefined,
      }}
      aria-hidden
    >
      {/* expanding rings */}
      {phase >= 1 &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute h-40 w-40 rounded-full border"
            style={{
              borderColor: "var(--rose)",
              animation: `ring-expand 1.4s ${i * 0.18}s cubic-bezier(0.2,0.8,0.2,1) forwards`,
            }}
          />
        ))}

      {/* the heart */}
      <svg
        viewBox="0 0 100 92"
        className="relative h-40 w-40 animate-heart-pulse"
        style={{
          filter: "drop-shadow(0 0 34px oklch(0.75 0.16 12 / 70%))",
          opacity: phase === 2 ? 0 : 1,
          transform: phase === 1 ? "scale(1.35)" : undefined,
          transition: "opacity .5s ease, transform .8s cubic-bezier(.2,.9,.2,1)",
        }}
      >
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.13 88)" />
            <stop offset="55%" stopColor="oklch(0.72 0.19 12)" />
            <stop offset="100%" stopColor="oklch(0.55 0.17 340)" />
          </linearGradient>
        </defs>
        <path
          d="M50 88C22 68 4 52 4 32.5 4 17 16 6 30 6c9 0 16 4.5 20 11.5C54 10.5 61 6 70 6c14 0 26 11 26 26.5C96 52 78 68 50 88z"
          fill="url(#hg)"
          stroke="oklch(0.92 0.08 90)"
          strokeWidth="1.2"
          style={{
            strokeDasharray: 300,
            strokeDashoffset: 300,
            animation: "draw 1.4s ease forwards",
          }}
        />
        <style>{`@keyframes draw{to{stroke-dashoffset:0}}`}</style>
      </svg>

      {/* explosion shards */}
      {phase >= 1 &&
        shards.map((_, i) => {
          const angle = (i / shards.length) * Math.PI * 2;
          const dist = 180 + (i % 5) * 60;
          return (
            <span
              key={i}
              className="absolute text-lg"
              style={{
                color: i % 3 === 0 ? "var(--gold)" : "var(--rose)",
                animation: `shard-${i % 4} 1.6s cubic-bezier(.15,.8,.3,1) forwards`,
                ["--tx" as string]: `${Math.cos(angle) * dist}px`,
                ["--ty" as string]: `${Math.sin(angle) * dist}px`,
              }}
            >
              {i % 4 === 0 ? "♥" : i % 4 === 1 ? "✦" : i % 4 === 2 ? "❁" : "✧"}
            </span>
          );
        })}
      <style>{`
        @keyframes shard-0,{}
        @keyframes shard-0{to{transform:translate(var(--tx),var(--ty)) rotate(200deg) scale(.2);opacity:0}}
        @keyframes shard-1{to{transform:translate(var(--tx),var(--ty)) rotate(-180deg) scale(.3);opacity:0}}
        @keyframes shard-2{to{transform:translate(var(--tx),var(--ty)) rotate(120deg) scale(.25);opacity:0}}
        @keyframes shard-3{to{transform:translate(var(--tx),var(--ty)) rotate(-90deg) scale(.35);opacity:0}}
      `}</style>

      <p
        className="absolute bottom-24 font-display text-sm tracking-[0.4em] text-gold-shine"
        style={{ opacity: phase === 2 ? 0 : 0.9, transition: "opacity .4s" }}
      >
        MY EVERYTHING
      </p>
    </div>
  );
}
