import { useEffect, useState } from "react";

const START = new Date(2025, 6, 4, 0, 0, 0); // 4 July 2025

function diff(now: Date) {
  let years = now.getFullYear() - START.getFullYear();
  let months = now.getMonth() - START.getMonth();
  let days = now.getDate() - START.getDate();

  let hours = now.getHours() - START.getHours();
  let minutes = now.getMinutes() - START.getMinutes();
  let seconds = now.getSeconds() - START.getSeconds();

  if (seconds < 0) {
    minutes -= 1;
    seconds += 60;
  }
  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }
  if (hours < 0) {
    days -= 1;
    hours += 24;
  }
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const ms = now.getTime() - START.getTime();
  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays: Math.floor(ms / 86400000),
    totalHours: Math.floor(ms / 3600000),
  };
}

/** circular progress ring */
function Ring({
  value,
  max,
  label,
  delay,
}: {
  value: number;
  max: number;
  label: string;
  delay: number;
}) {
  const R = 42;
  const C = 2 * Math.PI * R;
  const pct = Math.min(1, max === 0 ? 0 : (value % max || (value > 0 ? max : 0)) / max);

  return (
    <div className="animate-rise-in flex flex-col items-center" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative h-[104px] w-[104px] sm:h-28 sm:w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            strokeWidth="6"
            stroke="oklch(1 0 0 / 10%)"
          />
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke="var(--gold)"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct)}
            style={{ transition: "stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)", filter: "drop-shadow(0 0 6px var(--gold))" }}
          />
        </svg>
        <div
          className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, oklch(0.30 0.08 330 / 90%), oklch(0.13 0.04 300 / 95%))",
            boxShadow: "inset 0 1px 0 oklch(1 0 0 / 12%), 0 12px 30px -18px oklch(0.05 0.05 300)",
          }}
        >
          <span className="font-display text-2xl text-gold-shine tabular-nums leading-none">
            {value}
          </span>
          <span className="mt-1 font-body text-[9px] tracking-[0.2em] text-muted-foreground">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

function TimeBox({ v, l }: { v: number; l: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-[1px]"
      style={{
        background:
          "linear-gradient(160deg, oklch(1 0 0 / 30%), oklch(1 0 0 / 5%) 50%, var(--gold) 145%)",
        boxShadow: "0 14px 34px -18px oklch(0.05 0.05 300 / 90%)",
      }}
    >
      <div
        className="relative overflow-hidden rounded-[0.95rem] px-2 py-4"
        style={{
          background:
            "linear-gradient(165deg, oklch(0.24 0.06 320 / 92%), oklch(0.14 0.04 300 / 95%))",
        }}
      >
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
          style={{ background: "linear-gradient(180deg, oklch(1 0 0 / 10%), transparent)" }}
        />
        <div className="relative font-display text-2xl text-gold-shine tabular-nums">
          {String(v).padStart(2, "0")}
        </div>
        <div className="relative mx-auto mt-2 h-px w-6" style={{ background: "var(--gold)", opacity: 0.5 }} />
        <div className="relative mt-2 font-body text-[10px] tracking-widest text-muted-foreground">
          {l}
        </div>
      </div>
    </div>
  );
}

export function CountdownBox() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const d = now ? diff(now) : null;

  return (
    <div
      dir="rtl"
      className="glass-panel grain-layer relative overflow-hidden rounded-[2rem] px-6 py-10 text-center"
      style={{
        background:
          "linear-gradient(150deg, oklch(0.30 0.09 340 / 60%), oklch(0.18 0.05 300 / 70%))",
      }}
    >
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "oklch(0.75 0.16 12 / 30%)" }}
      />
      <p className="font-body text-[10px] tracking-[0.45em] text-muted-foreground">SINCE</p>
      <h3 className="mt-2 font-display text-3xl text-gold-shine">٤ / ٧ / ٢٠٢٥</h3>
      <p className="mt-1 font-serif-ar text-sm text-muted-foreground">
        من اليوم ده والحكاية شغالة 🤍
      </p>

      {d && (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 sm:gap-8">
            <Ring value={d.years} max={5} label="سنة" delay={0} />
            <Ring value={d.months} max={12} label="شهر" delay={90} />
            <Ring value={d.days} max={31} label="يوم" delay={180} />
          </div>

          <div
            className="mx-auto mt-8 h-px w-48"
            style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
          />

          <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
            <TimeBox v={d.hours} l="ساعة" />
            <TimeBox v={d.minutes} l="دقيقة" />
            <TimeBox v={d.seconds} l="ثانية" />
          </div>

          <p className="mt-6 font-serif-ar text-base text-foreground/90">
            يعني بقالنا <span className="text-gold-shine font-display">{d.totalDays}</span> يوم
            {" · "}
            <span className="text-gold-shine font-display">{d.totalHours}</span> ساعة ♥
          </p>
        </>
      )}
    </div>
  );
}
