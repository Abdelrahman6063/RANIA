import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LoginGate } from "@/components/LoginGate";
import { HeartTransition } from "@/components/HeartTransition";
import { PetalField } from "@/components/PetalField";
import { MessageCard, LetterReader } from "@/components/MessageCard";
import { CountdownBox } from "@/components/CountdownBox";
import { PrivateVault } from "@/components/PrivateVault";
import { MusicPlayer } from "@/components/MusicPlayer";
import { messages, type Msg } from "@/data/messages";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RANIA — My Everything" },
      {
        name: "description",
        content:
          "مساحة خاصة لرانيا: ١٣ رسالة، عدّاد من ٤ يوليو ٢٠٢٥، وصندوق خاص مقفول بالقلب.",
      },
      { property: "og:title", content: "RANIA — My Everything" },
      {
        property: "og:description",
        content: "١٣ رسالة، عدّاد أيام، وصندوق خاص… كل ده ليكي إنتِ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Stage = "gate" | "heart" | "open";

function Index() {
  const [stage, setStage] = useState<Stage>("gate");
  const [active, setActive] = useState<Msg | null>(null);
  const [read, setRead] = useState<number[]>([]);

  return (
    <main className="relative min-h-screen">
      <PetalField />
      {stage === "heart" && <HeartTransition onDone={() => setStage("open")} />}

      {stage !== "open" ? (
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
          <LoginGate
            title="RANIA"
            subtitle="MY EVERYTHING"
            expectedUser="RANIA"
            expectedPass="5/9/2005"
            onSuccess={() => setStage("heart")}
          />
        </div>
      ) : (
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <header dir="rtl" className="animate-rise-in text-center">
            <p className="font-body text-[10px] tracking-[0.5em] text-muted-foreground">
              MY EVERYTHING
            </p>

            <div className="mt-4 flex items-center justify-center gap-3 sm:gap-5">
              <span
                className="h-px w-10 sm:w-20"
                style={{ background: "linear-gradient(90deg, transparent, var(--gold))" }}
              />
              <span className="font-display text-xl" style={{ color: "var(--gold)" }}>
                ✦
              </span>
              <h1
                className="font-ornate text-6xl font-black leading-none text-gold-shine sm:text-[10rem]"
                style={{
                  letterSpacing: "0.1em",
                  filter: "drop-shadow(0 14px 46px oklch(0.85 0.13 88 / 38%))",
                }}
              >
                RANIA
              </h1>
              <span className="font-display text-xl" style={{ color: "var(--gold)" }}>
                ✦
              </span>
              <span
                className="h-px w-10 sm:w-20"
                style={{ background: "linear-gradient(270deg, transparent, var(--gold))" }}
              />
            </div>

            <p className="mx-auto mt-5 max-w-md font-serif-ar text-base leading-relaxed text-foreground/80">
              <span className="font-ornate font-bold tabular-nums text-gold-shine">21</span> رسالة… كل واحدة
              جوه صندوق. افتحيهم على مهلك 🤍
            </p>

            <div
              className="mx-auto mt-6 h-px w-40"
              style={{
                background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
              }}
            />
          </header>


          <section className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {messages.map((m, i) => (
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
          </section>

          <section className="mt-16">
            <PrivateVault />
          </section>

          <section className="mt-10">
            <CountdownBox />
          </section>

          <footer dir="rtl" className="mt-16 pb-10 text-center">
            <div
              className="mx-auto mb-6 h-px w-32"
              style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
            />
            <p className="mx-auto max-w-lg font-serif-ar text-base leading-loose text-foreground/85">
              مهما بعدت المسافة أو طال الوقت، هيفضل في ركن دافي جوايا اسمه إنتِ… ربنا يحوّطك بالخير ويخلّي ضحكتك أطول من أي حزن 🤍
            </p>

            <p className="mt-3 font-body text-[10px] tracking-[0.45em] text-muted-foreground">
              WRITTEN WITH LOVE
            </p>
          </footer>


        </div>
      )}

      <MusicPlayer />
      <LetterReader msg={active} onClose={() => setActive(null)} />

      <span
        dir="ltr"
        className="pointer-events-none fixed bottom-3 left-3 z-50 rounded-full px-3 py-1 font-ornate text-[11px] tracking-[0.25em]"
        style={{ color: "oklch(1 0 0)", background: "oklch(0 0 0 / 35%)", boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 16%)" }}

      >
        by abdelrahman
      </span>



    </main>
  );
}
