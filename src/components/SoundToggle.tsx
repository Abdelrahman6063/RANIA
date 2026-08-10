import { useEffect, useState } from "react";
import { isMusicOn, loadMusicPref, startMusic, stopMusic } from "@/lib/sound";

/** زرار واضح لتشغيل الموسيقى — من غير autoplay (المتصفحات بتمنعه على الموبايل). */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  const [pref, setPref] = useState(false);

  useEffect(() => {
    setPref(loadMusicPref());
    return () => stopMusic();
  }, []);

  function toggle() {
    if (isMusicOn()) {
      stopMusic();
      setOn(false);
    } else {
      startMusic();
      setOn(true);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={on ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
      className={`flex items-center gap-2 rounded-full border border-accent/30 bg-white/5 px-4 py-2 text-xs tracking-widest text-accent/90 transition hover:bg-accent/10 ${
        !on && pref ? "animate-float-soft" : ""
      }`}
    >
      <span className="text-base leading-none">{on ? "♪" : "♫"}</span>
      <span>{on ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}</span>
    </button>
  );
}
