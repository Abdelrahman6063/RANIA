import { useState } from "react";
import { Lock, Heart } from "lucide-react";
import { LoginGate } from "./LoginGate";
import { HeartTransition } from "./HeartTransition";
import { MessageCard, LetterReader } from "./MessageCard";
import { privateMessages, type Msg } from "@/data/messages";

type Stage = "sealed" | "gate" | "heart" | "open";

export function PrivateVault() {
  const [stage, setStage] = useState<Stage>("sealed");
  const [active, setActive] = useState<Msg | null>(null);
  const [read, setRead] = useState<number[]>([]);

  return (
    <>
      {stage === "heart" && <HeartTransition onDone={() => setStage("open")} />}

      <div
        dir="rtl"
        className="glass-panel grain-layer relative overflow-hidden rounded-[2rem] p-8 text-center"
        style={{
          background:
            "linear-gradient(150deg, oklch(0.26 0.07 20 / 70%), oklch(0.16 0.05 320 / 80%))",
        }}
      >
        <span
          className="pointer-events-none absolute -bottom-24 right-1/3 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "oklch(0.82 0.14 40 / 25%)" }}
        />

        {stage === "sealed" && (
          <div className="relative">
            <div className="flex justify-center">
              <div
                className="flex h-16 w-16 animate-float-soft items-center justify-center rounded-full"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Lock className="h-7 w-7" style={{ color: "var(--ink)" }} />
              </div>
            </div>
            <h3 className="mt-5 font-ornate text-4xl font-bold tracking-[0.2em] text-gold-shine">PRIVATE</h3>
            <p className="mt-2 font-serif-ar text-sm text-muted-foreground">
              <span className="font-ornate font-bold tabular-nums">6</span> رسايل مقفولة… ليكي إنتِ بس 🤍
            </p>

            <button
              onClick={() => setStage("gate")}
              className="mt-6 rounded-xl px-6 py-3 font-body text-sm font-bold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
              style={{ background: "var(--gradient-gold)", boxShadow: "var(--glow-rose)" }}
            >
              افتحي القفل ♥
            </button>
          </div>
        )}

        {stage === "gate" && (
          <div className="relative py-2">
            <LoginGate
              compact
              title="PRIVATE"
              subtitle="FOR YOUR EYES ONLY"
              expectedUser="6063"
              expectedPass="47839836063"
              onSuccess={() => setStage("heart")}
            />
          </div>
        )}

        {stage === "open" && (
          <div className="relative">
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-5 w-5 animate-heart-pulse" style={{ color: "var(--rose)" }} fill="currentColor" />
              <h3 className="font-ornate text-4xl font-bold tracking-[0.2em] text-gold-shine">PRIVATE</h3>
            </div>
            <p className="mt-2 font-serif-ar text-sm text-muted-foreground">
              اتفتح… اقري براحتك 🤍
            </p>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {privateMessages.map((m, i) => (
                <MessageCard
                  key={m.id}
                  msg={m}
                  index={i}
                  opened={read.includes(m.id)}
                  onOpen={() => {
                    setActive(m);
                    setRead((r) => (r.includes(m.id) ? r : [...r, m.id]));
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <LetterReader msg={active} onClose={() => setActive(null)} />
    </>
  );
}
