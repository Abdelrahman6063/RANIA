import { useState, type FormEvent } from "react";
import { HeartBurst } from "./HeartBurst";

type Props = {
  scriptTitle: string;
  subtitle: string;
  expectedUser: string;
  expectedPass: string;
  userLabel?: string;
  passLabel?: string;
  themeFace?: string;
  onUnlock: () => void;
};

export function LoginGate({
  scriptTitle,
  subtitle,
  expectedUser,
  expectedPass,
  userLabel = "اليوزر",
  passLabel = "الباسورد",
  themeFace,
  onUnlock,
}: Props) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [bursting, setBursting] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const okUser = user.trim().toLowerCase() === expectedUser.toLowerCase();
    const okPass = pass.trim() === expectedPass;
    if (okUser && okPass) {
      setError(false);
      setBursting(true);
      return;
    }
    setError(true);
    setShakeKey((k) => k + 1);
  }

  if (bursting) return <HeartBurst onDone={onUnlock} />;

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-12">
      <section
        key={shakeKey}
        className={`grain animate-rise-in relative w-full max-w-md overflow-hidden rounded-4xl p-8 sm:p-10 ${
          error ? "animate-shake-x" : ""
        } ${themeFace ? "" : "surface-luxe"}`}
        style={
          themeFace
            ? {
                background: themeFace,
                border: "1px solid oklch(0.85 0.12 88 / 22%)",
                boxShadow: "var(--shadow-luxe)",
              }
            : undefined
        }
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="animate-float-soft text-primary/90">
            <svg viewBox="0 0 32 29" className="h-12 w-12 fill-current">
              <path d="M16 29S0 18.6 0 9.6C0 4.3 4.2 0 9.3 0 12.2 0 14.8 1.4 16 3.6 17.2 1.4 19.8 0 22.7 0 27.8 0 32 4.3 32 9.6 32 18.6 16 29 16 29z" />
            </svg>
          </div>

          <h1 dir="ltr" className="script-soft mt-5 text-6xl leading-tight sm:text-7xl">
            {scriptTitle}
          </h1>
          <p className="mt-2 text-[0.65rem] tracking-[0.4em] text-muted-foreground/80 uppercase">
            {subtitle}
          </p>
          <span className="mt-5 h-px w-16 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        </div>

        <form onSubmit={submit} className="relative z-10 mt-9 space-y-4" dir="rtl">
          <div className="space-y-2">
            <label className="text-xs tracking-widest text-muted-foreground">{userLabel}</label>
            <input
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
                setError(false);
              }}
              autoComplete="off"
              className="w-full rounded-2xl border border-border bg-input/40 px-4 py-3 text-center tracking-widest text-foreground outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs tracking-widest text-muted-foreground">{passLabel}</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setError(false);
              }}
              autoComplete="off"
              className="w-full rounded-2xl border border-border bg-input/40 px-4 py-3 text-center tracking-widest text-foreground outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-ring/40"
            />
          </div>

          {error && (
            <p className="animate-rise-in rounded-2xl border border-destructive/40 bg-destructive/15 px-4 py-2 text-center text-sm text-destructive-foreground">
              💔 كلمة السر غلط… جرّبي تاني بهدوء
            </p>
          )}

          <button
            type="submit"
            className="relative w-full overflow-hidden rounded-2xl px-6 py-3 font-display text-lg text-primary-foreground transition-transform duration-300 hover:scale-[1.01] active:scale-95"
            style={{ background: "var(--gradient-gold)" }}
          >
            <span className="relative z-10">افتحي القلب</span>
          </button>
        </form>
      </section>
    </main>
  );
}