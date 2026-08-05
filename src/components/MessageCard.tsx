import { useEffect, useRef, useState } from "react";
import type { Msg } from "@/data/messages";

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
      className="group grain-layer animate-rise-in relative min-h-[230px] w-full overflow-hidden rounded-[1.75rem] p-[1px] text-right transition-all duration-500 hover:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        animationDelay: `${index * 70}ms`,
        background: `linear-gradient(160deg, oklch(1 0 0 / 26%), oklch(1 0 0 / 4%) 45%, ${t.glow} 130%)`,
        boxShadow: "var(--shadow-lux)",
      }}
    >
      <span
        className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[1.7rem] p-5"
        style={{ background: `linear-gradient(155deg, ${t.a}, ${t.b})` }}
      >
        {/* glow orb */}
        <span
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-2xl transition-all duration-700 group-hover:scale-150"
          style={{ background: t.glow, opacity: 0.26 }}
        />
        {/* envelope flap */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-16 transition-all duration-500 group-hover:h-10 group-hover:opacity-70"
          style={{
            background: "linear-gradient(180deg, oklch(1 0 0 / 12%), transparent)",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
        />
        {/* sheen */}
        <span
          className="pointer-events-none absolute inset-0 translate-x-[-120%] transition-transform duration-[1100ms] group-hover:translate-x-[120%]"
          style={{
            background:
              "linear-gradient(105deg, transparent 35%, oklch(1 0 0 / 22%) 50%, transparent 65%)",
          }}
        />

        <span className="relative flex items-center justify-between">
          <span
            className="rounded-full px-2 py-[3px] font-display text-[10px] tracking-[0.3em]"
            style={{ background: "oklch(0 0 0 / 22%)", color: t.glow }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition-transform duration-500 group-hover:rotate-12"
            style={{
              background: "oklch(1 0 0 / 10%)",
              boxShadow: `inset 0 0 0 1px oklch(1 0 0 / 16%), 0 0 22px ${t.glow}`,
              color: t.glow,
            }}
          >
            {t.glyph}
          </span>
        </span>

        <span className="relative block">
          <span className="mb-2 block text-3xl">{msg.glyph}</span>
          <span className="block font-display text-xl leading-tight text-foreground">
            {msg.title}
          </span>
          <span className="mt-2 line-clamp-2 block font-serif-ar text-xs leading-relaxed text-foreground/60">
            {msg.text}
          </span>
        </span>

        <span className="relative mt-4 flex items-center justify-between">
          <span
            className="rounded-full px-3 py-1 font-body text-[10px] tracking-widest"
            style={{
              background: "oklch(1 0 0 / 10%)",
              color: opened ? t.glow : "var(--muted-foreground)",
            }}
          >
            {opened ? "اتقريت ♥" : "افتحيني"}
          </span>
          <span
            className="h-[2px] w-10 origin-right scale-x-50 rounded-full transition-transform duration-500 group-hover:scale-x-100"
            style={{ background: t.glow }}
          />
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
    const id = setInterval(() => {
      setShown((s) => {
        if (s >= words.length) {
          clearInterval(id);
          return s;
        }
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
