import { useEffect, useState } from "react";

const START = new Date(2025, 6, 14, 0, 0, 0); // 14/7/2025

function diffFrom(start: Date, now: Date) {
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prev = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prev;
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }
  const totalDays = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return { years, months, days, hours, minutes, seconds, totalDays };
}

function Ring({ value, label }: { value: number; label: string }) {
  return (
    <div className="relative grid h-28 w-28 place-items-center rounded-full sm:h-32 sm:w-32">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 210deg, var(--gold), var(--rose), var(--gold))",
          padding: 2,
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
        }}
      />
      <div className="surface-luxe grain flex h-full w-full flex-col items-center justify-center rounded-full">
        <span className="font-display text-gold-gradient text-4xl">{value}</span>
        <span className="mt-1 text-[0.65rem] tracking-[0.3em] text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className="surface-luxe grain flex min-w-20 flex-col items-center rounded-2xl px-4 py-3">
      <span className="font-display text-2xl text-foreground tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[0.6rem] tracking-[0.25em] text-muted-foreground">{label}</span>
    </div>
  );
}

export function DateCounter() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const d = diffFrom(START, now ?? START);

  return (
    <section className="surface-luxe grain animate-rise-in rounded-4xl p-8 text-center">
      <p className="text-[0.65rem] tracking-[0.45em] text-accent uppercase">since 14 / 7 / 2025</p>
      <h2 className="script-soft mt-2 text-5xl">Our Time</h2>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
        <Ring value={d.years} label="سنة" />
        <Ring value={d.months} label="شهر" />
        <Ring value={d.days} label="يوم" />
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Tile value={d.hours} label="ساعة" />
        <Tile value={d.minutes} label="دقيقة" />
        <Tile value={d.seconds} label="ثانية" />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        يعني بقالنا <span className="text-accent">{d.totalDays}</span> يوم من يوم 14 / 7 / 2025 🤍
      </p>
    </section>
  );
}