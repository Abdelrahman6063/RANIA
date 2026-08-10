import { useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";

const SRC = "/music.mp3";

/** Floating music toggle — loops the project's music track. */
export function MusicPlayer() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio(SRC);
    a.loop = true;
    a.volume = 0.5;
    ref.current = a;
    return () => {
      a.pause();
      ref.current = null;
    };
  }, []);

  const toggle = async () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "إيقاف الأغنية" : "تشغيل الأغنية"}
      className="fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
      style={{
        background: "var(--gradient-gold)",
        boxShadow: "var(--glow-rose)",
        color: "var(--ink)",
      }}
    >
      {playing ? (
        <Pause className="h-5 w-5" />
      ) : (
        <Music className="h-5 w-5 animate-heart-pulse" />
      )}
    </button>
  );
}
