import { useState, type FormEvent } from "react";
import { Heart } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  userLabel?: string;
  passLabel?: string;
  expectedUser: string;
  expectedPass: string;
  onSuccess: () => void;
  compact?: boolean;
};

export function LoginGate({
  title,
  subtitle,
  userLabel = "اسم المستخدم",
  passLabel = "كلمة السر",
  expectedUser,
  expectedPass,
  onSuccess,
  compact = false,
}: Props) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const norm = (v: string) =>
    v
      .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
      .replace(/[\u06f0-\u06f9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
      .replace(/[\u200e\u200f\s]/g, "")
      .replace(/[\\\-.]/g, "/")
      .trim()
      .toLowerCase();

  function submit(e: FormEvent) {
    e.preventDefault();
    const ok = norm(user) === norm(expectedUser) && norm(pass) === norm(expectedPass);
    if (ok) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  }

  return (
    <div
      className={`glass-panel grain-layer relative mx-auto w-full overflow-hidden rounded-3xl px-7 py-10 text-center ${
        compact ? "max-w-md" : "max-w-lg"
      }`}
      dir="rtl"
    >



      <div className="mb-5 flex justify-center">
        <div
          className="relative flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: "var(--gradient-gold)",
            boxShadow: "var(--glow-rose)",
          }}
        >
          <Heart
            className="h-9 w-9 animate-heart-pulse"
            style={{ color: "var(--ink)" }}
            fill="currentColor"
          />
        </div>
      </div>

      <h1
        className={`font-ornate font-black text-gold-shine leading-tight ${compact ? "text-4xl" : "text-5xl sm:text-7xl"}`}
        style={{ letterSpacing: "0.1em" }}
      >
        {title}
      </h1>
      <p className="mt-3 font-ornate text-[11px] tracking-[0.4em] text-muted-foreground">
        {subtitle}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-3 text-right">
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder={userLabel}
          aria-label={userLabel}
          maxLength={64}
          className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-center font-body text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/40"
        />
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder={passLabel}
          aria-label={passLabel}
          type="password"
          maxLength={64}
          className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-center font-body text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/40"
        />
        <button
          type="submit"
          className="group relative w-full overflow-hidden rounded-xl px-4 py-3 font-body text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--glow-rose)" }}
        >
          افتحي القلب ♥
        </button>
        <p
          className="h-5 text-center font-body text-xs text-destructive transition-opacity"
          style={{ opacity: error ? 1 : 0 }}
        >
          البيانات مش مظبوطة… حاولي تاني 🤍
        </p>
      </form>
    </div>
  );
}
