import { useEffect, useRef, useState } from "react";
import type { Msg } from "@/data/messages";
import { playOpenChime, playTypeTick } from "@/lib/sfx";


/** Sealed envelope-style card. Hover lifts + sheen; click opens the letter. */
export function MessageCard({
  msg,
  index,
  opened,
  onOpen,
}: {
  msg: Msg;
  index: number;
  opened: boolean;
  onOpen: () => void;
}) {
  const t = msg.theme;
  return (
    <button
      onClick={onOpen}
      dir="rtl"
      className="group grain-layer animate-rise-in relative w-full overflow-hidden rounded-[1.5rem] p-[1.5px] text-right transition-all duration-500 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        animationDelay: `${index * 60}ms`,
        background: `conic-gradient(from 130deg, ${t.glow}, oklch(1 0 0 / 30%) 22%, ${t.glow} 50%, oklch(1 0 0 / 16%) 78%, ${t.glow})`,
        boxShadow: `0 20px 46px -26px ${t.glow}`,
      }}
    >
      <span
        className="relative flex min-h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded-[1.42rem] px-4 pb-5 pt-6"
        style={{ background: `linear-gradient(160deg, ${t.a}, ${t.b} 80%)` }}
      >
        {/* halo */}
        <span
          className="pointer-events-none absolute -top-14 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full blur-3xl transition-all duration-700 group-hover:scale-125"
          style={{ background: t.glow, opacity: 0.38 }}
        />
        {/* rotating ornament ring behind medallion */}
        <span
          className="pointer-events-none absolute left-1/2 top-[52px] h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 transition-all duration-700 group-hover:rotate-180 group-hover:opacity-90"
          style={{ border: `1px dashed ${t.glow}` }}
        />
        {/* inner hairline frame */}
        <span
          className="pointer-events-none absolute inset-[8px] rounded-[1.15rem] transition-all duration-500 group-hover:inset-[5px]"
          style={{ border: "1px solid oklch(1 0 0 / 24%)" }}
        />
        {/* top gloss */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
          style={{ background: "linear-gradient(180deg, oklch(1 0 0 / 18%), transparent)" }}
        />
        {/* sheen sweep */}
        <span
          className="pointer-events-none absolute inset-0 translate-x-[-130%] transition-transform duration-[1100ms] group-hover:translate-x-[130%]"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, oklch(1 0 0 / 24%) 50%, transparent 60%)",
          }}
        />

        {/* corner ornaments */}
        <span className="pointer-events-none absolute left-3 top-2 text-[13px] opacity-60" style={{ color: t.glow }}>
          ❖
        </span>
        <span className="pointer-events-none absolute bottom-2 right-3 text-[13px] opacity-60" style={{ color: t.glow }}>
          ❖
        </span>

        {/* corner index */}
        <span
          className="absolute right-3 top-3 font-ornate text-[10px] tracking-[0.3em] tabular-nums"
          style={{ color: "oklch(1 0 0 / 70%)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* flower medallion */}
        <span
          className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full text-[26px] transition-transform duration-500 group-hover:rotate-[12deg] group-hover:scale-110"
          style={{
            background: `radial-gradient(circle at 32% 26%, oklch(1 0 0 / 45%), ${t.glow} 130%)`,
            boxShadow: `inset 0 0 0 1px oklch(1 0 0 / 55%), 0 0 28px ${t.glow}`,
          }}
        >
          {t.glyph}
        </span>

        <span
          className="relative mt-3 block bg-clip-text text-center font-display text-[1.7rem] font-bold leading-snug"
          style={{
            backgroundImage: `linear-gradient(100deg, oklch(1 0 0), ${t.glow} 45%, oklch(1 0 0))`,
            backgroundSize: "220% auto",
            WebkitBackgroundClip: "text",
            color: "transparent",
            animation: "shine 6s linear infinite",
            filter: `drop-shadow(0 4px 18px ${t.glow})`,
          }}
        >
          {msg.title}
        </span>
        <span
          className="relative mx-auto mt-2 block h-px w-20"
          style={{ background: `linear-gradient(90deg, transparent, ${t.glow}, transparent)` }}
        />

        <span
          className="relative mt-4 flex items-center gap-2 rounded-full px-6 py-2 font-ornate text-[14px] font-bold tracking-[0.45em] transition-all duration-500 group-hover:tracking-[0.6em]"
          style={{
            background: opened ? "oklch(1 0 0 / 24%)" : "oklch(1 0 0 / 12%)",
            boxShadow: `inset 0 0 0 1px oklch(1 0 0 / 34%), 0 0 22px ${opened ? t.glow : "transparent"}`,
            color: "oklch(0.99 0 0)",
          }}
        >
          <span style={{ opacity: 0.8, color: t.glow }}>✿</span>
          {opened ? "READ" : "OPEN"}
          <span style={{ opacity: 0.8, color: t.glow }}>✿</span>
        </span>

      </span>
    </button>
  );
}





/** Full-screen letter reader with unfolding paper + word-by-word reveal. */
export function LetterReader({ msg, onClose }: { msg: Msg | null; onClose: () => void }) {
  const [shown, setShown] = useState(0);
  const words = msg ? msg.text.split(/(\s+)/) : [];

  useEffect(() => {
    if (!msg) return;
    setShown(0);
    playOpenChime();
    const id = setInterval(() => {
      setShown((s) => {
        if (s >= words.length) {
          clearInterval(id);
          return s;
        }
        if (s % 2 === 0) playTypeTick();
        return s + 1;
      });
    }, 45);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // زرار الرجوع في الموبايل يقفل الرسالة بدل ما يخرج من الصفحة
  const pushed = useRef(false);
  useEffect(() => {
    if (!msg) return;
    window.history.pushState({ letter: true }, "");
    pushed.current = true;
    const onPop = () => {
      pushed.current = false;
      onClose();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (pushed.current) {
        pushed.current = false;
        window.history.back();
      }
    };
  }, [msg, onClose]);

  if (!msg) return null;
  const t = msg.theme;


  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: "oklch(0.08 0.03 300 / 82%)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="grain-layer relative max-h-[86vh] w-full max-w-xl overflow-y-auto rounded-[2rem] p-8 text-right"
        style={{
          background: `linear-gradient(160deg, ${t.a}, ${t.b})`,
          border: "1px solid oklch(1 0 0 / 18%)",
          boxShadow: `0 40px 100px -30px ${t.glow}`,
          animation: "unfold .7s cubic-bezier(.2,.9,.2,1) both",
        }}
      >
        <style>{`@keyframes unfold{from{opacity:0;transform:perspective(1200px) rotateX(-45deg) translateY(40px) scale(.9)}to{opacity:1;transform:none}}`}</style>

        <span
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full blur-3xl"
          style={{ background: t.glow, opacity: 0.3 }}
        />

        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs tracking-[0.35em]" style={{ color: t.glow }}>
              رسالة {String(msg.id >= 100 ? msg.id - 99 : msg.id).padStart(2, "0")}
            </span>
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="rounded-full px-3 py-1 font-body text-xs text-foreground/70 transition-colors hover:text-foreground"
              style={{ background: "oklch(1 0 0 / 10%)" }}
            >
              إغلاق ✕
            </button>
          </div>

          <div className="my-6 text-center">
            <div className="text-5xl">{msg.glyph}</div>
            <h2 className="mt-3 font-display text-3xl text-gold-shine">{msg.title}</h2>
            <div
              className="mx-auto mt-4 h-px w-24"
              style={{ background: `linear-gradient(90deg, transparent, ${t.glow}, transparent)` }}
            />
          </div>

          <p className="whitespace-pre-line font-serif-ar text-lg leading-loose text-foreground/95">
            {words.slice(0, shown).join("")}
            {shown < words.length && (
              <span className="animate-pulse" style={{ color: t.glow }}>
                ▌
              </span>
            )}
          </p>

          <div className="mt-8 text-center text-2xl" style={{ color: t.glow }}>
            {t.glyph}
          </div>
        </div>
      </div>
    </div>
  );
}
