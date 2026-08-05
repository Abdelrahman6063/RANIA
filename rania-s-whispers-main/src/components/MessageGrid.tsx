import { useEffect, useRef, useState } from "react";

const THEMES = [
  {
    face: "linear-gradient(150deg, oklch(0.42 0.13 350), oklch(0.24 0.08 320))",
    ring: "oklch(0.85 0.12 88 / 40%)",
    glyph: "🤍",
  },
  {
    face: "linear-gradient(150deg, oklch(0.38 0.11 285), oklch(0.2 0.07 310))",
    ring: "oklch(0.78 0.13 300 / 40%)",
    glyph: "🌙",
  },
  {
    face: "linear-gradient(150deg, oklch(0.4 0.1 160), oklch(0.21 0.06 200))",
    ring: "oklch(0.8 0.12 165 / 40%)",
    glyph: "🌿",
  },
  {
    face: "linear-gradient(150deg, oklch(0.46 0.13 30), oklch(0.24 0.08 350))",
    ring: "oklch(0.86 0.11 60 / 45%)",
    glyph: "🌸",
  },
  {
    face: "linear-gradient(150deg, oklch(0.34 0.09 250), oklch(0.19 0.06 300))",
    ring: "oklch(0.8 0.1 250 / 40%)",
    glyph: "✨",
  },
  {
    face: "linear-gradient(150deg, oklch(0.44 0.14 12), oklch(0.22 0.08 330))",
    ring: "oklch(0.82 0.14 10 / 45%)",
    glyph: "💖",
  },
];

/** كتابة الرسالة حرف حرف زي الكمبيوتر. */
function Typewriter({ text, speed = 26 }: { text: string; speed?: number }) {
  const [count, setCount] = useState(0);
  const done = count >= text.length;
  const ref = useRef(text);

  useEffect(() => {
    ref.current = text;
    setCount(0);
  }, [text]);

  useEffect(() => {
    if (count >= ref.current.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [count, speed]);

  return (
    <p
      onClick={() => setCount(text.length)}
      className="mt-6 text-lg leading-loose whitespace-pre-line text-foreground"
      style={{ textShadow: "0 1px 12px oklch(0.85 0.12 88 / 18%)" }}
    >
      {text.slice(0, count)}
      {!done && (
        <span
          className="ml-0.5 inline-block h-5 w-px translate-y-0.5 bg-accent align-middle"
          style={{ animation: "caret-blink 0.9s step-end infinite" }}
        />
      )}
    </p>
  );
}

export function MessageGrid({ messages, teasers }: { messages: string[]; teasers?: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [read, setRead] = useState<Set<number>>(new Set());

  // Phone back button closes an open letter instead of leaving the page.
  useEffect(() => {
    if (open === null) return;
    window.history.pushState({ letter: true }, "");
    const onPop = () => setOpen(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open]);

  function openLetter(i: number) {
    setOpen(i);
    setRead((prev) => new Set(prev).add(i));
  }

  function closeLetter() {
    if (window.history.state?.letter) window.history.back();
    else setOpen(null);
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {messages.map((msg, i) => {
          const t = THEMES[i % THEMES.length]!;
          return (
            <button
              key={i}
              onClick={() => openLetter(i)}
              className="grain animate-rise-in group relative w-full overflow-hidden rounded-3xl px-6 py-7 text-right transition-transform duration-500 ease-out hover:-translate-y-1.5 sm:px-8 sm:py-9"
              style={{
                background: t.face,
                border: `1px solid ${t.ring}`,
                boxShadow: "var(--shadow-luxe)",
                animationDelay: `${i * 55}ms`,
              }}
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-gradient-to-b from-white/12 to-transparent" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/8 text-2xl"
                    style={{ animation: `card-breathe 6s ease-in-out ${i * 0.3}s infinite` }}
                  >
                    {t.glyph}
                  </span>
                  <span className="flex flex-col items-start gap-1">
                    <span className="script-soft text-4xl leading-none">{i + 1}</span>
                    <span className="text-sm text-foreground/75">
                      {teasers?.[i] ?? "رسالة صغيرة"}
                    </span>
                  </span>
                </div>
                <span
                  dir="ltr"
                  className="script-soft text-3xl leading-none opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                >
                  {read.has(i) ? "Read" : "Open"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-background/90 p-5 backdrop-blur-md"
          onClick={closeLetter}
        >
          <article
            onClick={(e) => e.stopPropagation()}
            className="surface-luxe grain animate-rise-in relative max-h-[80dvh] w-full max-w-xl overflow-y-auto rounded-4xl p-8 text-center"
            style={{ background: THEMES[open % THEMES.length]!.face }}
          >
            <div className="text-4xl">{THEMES[open % THEMES.length]!.glyph}</div>
            <p className="script-soft mt-2 text-4xl">{open + 1}</p>
            <span className="mx-auto mt-3 block h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <Typewriter text={messages[open]!} />
            <span className="mt-6 block text-accent/70">❦</span>
            <button
              onClick={closeLetter}
              className="mt-6 rounded-full border border-accent/40 px-6 py-2 text-sm tracking-widest text-accent transition hover:bg-accent/10"
            >
              إغلاق
            </button>
          </article>
        </div>
      )}
    </>
  );
}
