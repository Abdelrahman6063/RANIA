import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MessageGrid } from "@/components/MessageGrid";
import { DateCounter } from "@/components/DateCounter";
import { Ambience } from "@/components/Ambience";
import { MAIN_MESSAGES, MAIN_TEASERS } from "@/lib/messages";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "١٣ رسالة لرانيا" },
      { name: "description", content: "ثلاثة عشر صندوقًا، في كل واحد كلمة من القلب." },
      { property: "og:title", content: "١٣ رسالة لرانيا" },
      { property: "og:description", content: "ثلاثة عشر صندوقًا، في كل واحد كلمة من القلب." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("rania-unlocked") !== "1") {
      navigate({ to: "/", replace: true });
    }
  }, [navigate]);

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12">
      <Ambience />
      <header className="animate-rise-in text-center">
        <h1 dir="ltr" className="script-soft text-6xl sm:text-7xl">RANIA</h1>
        <p className="mt-1 text-[0.7rem] tracking-[0.45em] text-muted-foreground uppercase">
          my everything
        </p>
      </header>

      <section className="mt-10">
        <MessageGrid messages={MAIN_MESSAGES} teasers={MAIN_TEASERS} />
      </section>

      <button
        onClick={() => navigate({ to: "/private" })}
        className="grain group mt-4 flex w-full items-center justify-between gap-4 rounded-3xl px-5 py-5 transition-transform duration-500 ease-out hover:-translate-y-1"
        style={{
          background: "linear-gradient(150deg, oklch(0.44 0.14 12), oklch(0.22 0.08 330))",
          border: "1px solid oklch(0.82 0.14 10 / 45%)",
          boxShadow: "var(--shadow-luxe)",
        }}
      >
        <span className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/8 text-2xl">
            🔒
          </span>
          <span className="font-display text-xl text-foreground">صندوق خاص جدًا</span>
        </span>
        <span dir="ltr" className="script-soft text-3xl leading-none opacity-90">
          Private
        </span>
      </button>

      <div className="mt-8">
        <DateCounter />
      </div>

      <p className="mt-10 text-center text-sm leading-loose text-muted-foreground">
        🤍 مهما بعدت الطرق… يفضل في القلب مكان دافي اسمه إنتِ، ودعوة بالخير تسبقك في كل خطوة.
      </p>
    </main>
  );
}