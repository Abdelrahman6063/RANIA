import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MessageGrid } from "@/components/MessageGrid";
import { Ambience } from "@/components/Ambience";
import { PRIVATE_MESSAGES, PRIVATE_TEASERS } from "@/lib/messages";

export const Route = createFileRoute("/private/messages")({
  head: () => ({
    meta: [
      { title: "كلام خاص جدًا" },
      { name: "description", content: "ست رسائل مكتوبة بهدوء، لكِ وحدك." },
      { property: "og:title", content: "كلام خاص جدًا" },
      { property: "og:description", content: "ست رسائل مكتوبة بهدوء، لكِ وحدك." },
    ],
  }),
  component: PrivateMessages,
});

function PrivateMessages() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("rania-private") !== "1") {
      navigate({ to: "/private", replace: true });
    }
  }, [navigate]);

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-12">
      <Ambience />
      <header className="animate-rise-in text-center">
        <h1 dir="ltr" className="script-soft text-6xl">Private</h1>
        <p className="mt-1 text-[0.7rem] tracking-[0.45em] text-muted-foreground uppercase">
          only for you
        </p>
      </header>

      <section className="mt-10">
        <MessageGrid messages={PRIVATE_MESSAGES} teasers={PRIVATE_TEASERS} />
      </section>

      <button
        onClick={() => window.history.back()}
        className="mx-auto mt-10 block rounded-full border border-accent/40 px-8 py-2 text-sm tracking-widest text-accent transition hover:bg-accent/10"
      >
        رجوع
      </button>
    </main>
  );
}