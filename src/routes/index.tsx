import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LoginGate } from "@/components/LoginGate";
import { HeartTransition } from "@/components/HeartTransition";
import { PetalField } from "@/components/PetalField";
import { MessageCard, LetterReader } from "@/components/MessageCard";
import { CountdownBox } from "@/components/CountdownBox";
import { PrivateVault } from "@/components/PrivateVault";
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
            <h1 className="mt-3 font-display text-6xl text-gold-shine sm:text-8xl">RANIA</h1>
            <p className="mx-auto mt-4 max-w-md font-serif-ar text-base leading-relaxed text-foreground/80">
              ١٣ رسالة… كل واحدة جوه صندوق. افتحيهم على مهلك 🤍
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

          <footer className="mt-16 pb-10 text-center">
            <p className="mx-auto max-w-md font-serif-ar text-sm leading-relaxed text-muted-foreground">
              وفي الآخر… يكفيني إن اسمك اتكتب هنا بمحبة، ودعوة من قلبي تسبقك في كل خطوة 🤍
            </p>
          </footer>

        </div>
      )}

      <LetterReader msg={active} onClose={() => setActive(null)} />
    </main>
  );
}
