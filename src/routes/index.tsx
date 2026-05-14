import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Settings, Upload, Music, Pause, Play } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

type SpeedKey = "1" | "2" | "3";

const DEFAULTS: Record<SpeedKey, number> = { "1": 6, "2": 3, "3": 1.5 };
const LABELS: Record<SpeedKey, string> = {
  "1": "Speed 1 (Slow ~0.3x)",
  "2": "Speed 2 (Normal ~0.7x)",
  "3": "Speed 3 (Fast ~1.2x)",
};

function Index() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [speed, setSpeed] = useState<SpeedKey>("2");
  const [durations, setDurations] = useState<Record<SpeedKey, number>>(() => {
    if (typeof window === "undefined") return DEFAULTS;
    try {
      const s = localStorage.getItem("rot-durations");
      return s ? { ...DEFAULTS, ...JSON.parse(s) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("rot-durations", JSON.stringify(durations));
    } catch {}
  }, [durations]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !audioUrl) return;
    if (playing) a.play().catch(() => {});
    else a.pause();
  }, [playing, audioUrl]);

  const onImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setImgUrl(URL.createObjectURL(f));
  };
  const onAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAudioUrl(URL.createObjectURL(f));
  };

  const duration = durations[speed];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <style>{`
        @keyframes spin360 { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        .spin-img { animation: spin360 var(--dur, 3s) linear infinite; }
        .spin-paused { animation-play-state: paused; }
      `}</style>

      <header className="p-6 text-center">
        <h1 className="text-2xl font-semibold tracking-wide">Rotating Image</h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        {imgUrl ? (
          <div
            className="relative rounded-full overflow-hidden border border-white/10"
            style={{ width: "min(70vw, 70vh)", height: "min(70vw, 70vh)" }}
          >
            <img
              src={imgUrl}
              alt="rotating"
              className={`spin-img w-full h-full object-cover ${playing ? "" : "spin-paused"}`}
              style={{ ["--dur" as any]: `${duration}s` }}
            />
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-3 border border-dashed border-white/30 rounded-full w-72 h-72 justify-center hover:bg-white/5 transition">
            <Upload className="w-8 h-8" />
            <span className="text-sm text-white/70">Click to import image</span>
            <input type="file" accept="image/*" className="hidden" onChange={onImg} />
          </label>
        )}
      </main>

      {audioUrl && <audio ref={audioRef} src={audioUrl} loop />}

      <footer className="p-6 flex flex-col gap-4">
        <div className="flex justify-center gap-3">
          {(["1", "2", "3"] as SpeedKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setSpeed(k)}
              className={`px-5 py-2 rounded-full border text-sm transition ${
                speed === k
                  ? "bg-white text-black border-white"
                  : "border-white/30 hover:border-white/70"
              }`}
            >
              Speed {k}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-white/20 hover:bg-white/10 text-sm"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" /> Settings
          </button>

          <div className="flex items-center gap-2">
            {imgUrl && (
              <button
                onClick={() => setPlaying((p) => !p)}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-white/20 hover:bg-white/10 text-sm"
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {playing ? "Pause" : "Play"}
              </button>
            )}
            <label className="flex items-center gap-2 px-3 py-2 rounded-md border border-white/20 hover:bg-white/10 text-sm cursor-pointer">
              <Music className="w-4 h-4" />
              {audioUrl ? "Change MP3" : "Import MP3"}
              <input type="file" accept="audio/mp3,audio/mpeg" className="hidden" onChange={onAudio} />
            </label>
            {imgUrl && (
              <label className="flex items-center gap-2 px-3 py-2 rounded-md border border-white/20 hover:bg-white/10 text-sm cursor-pointer">
                <Upload className="w-4 h-4" />
                Change image
                <input type="file" accept="image/*" className="hidden" onChange={onImg} />
              </label>
            )}
          </div>
        </div>
      </footer>

      {showSettings && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="bg-neutral-900 border border-white/15 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-1">Rotation Duration</h2>
            <p className="text-xs text-white/60 mb-4">
              Seconds for one full 360° rotation at each speed.
            </p>
            <div className="flex flex-col gap-3">
              {(["1", "2", "3"] as SpeedKey[]).map((k) => (
                <label key={k} className="flex items-center justify-between gap-3 text-sm">
                  <span>{LABELS[k]}</span>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={durations[k]}
                    onChange={(e) =>
                      setDurations((d) => ({
                        ...d,
                        [k]: Math.max(0.1, parseFloat(e.target.value) || 0.1),
                      }))
                    }
                    className="w-24 bg-black border border-white/20 rounded px-2 py-1 text-white"
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setDurations(DEFAULTS)}
                className="px-3 py-2 text-sm border border-white/20 rounded hover:bg-white/10"
              >
                Reset
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-3 py-2 text-sm bg-white text-black rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
