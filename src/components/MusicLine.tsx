"use client";

import { useEffect, useRef, useState } from "react";
import { TypedText } from "@/components/TypedText";
import type { Track } from "@/lib/playlist";

/* Minimal types for Spotify's iFrame API: https://developer.spotify.com/documentation/embeds */
type PlaybackUpdate = { isPaused: boolean; isBuffering: boolean; duration: number; position: number };
type SpotifyController = {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  addListener: (event: "ready" | "playback_update", cb: (e: { data: PlaybackUpdate }) => void) => void;
};
type SpotifyIFrameAPI = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width?: number | string; height?: number | string },
    cb: (controller: SpotifyController) => void,
  ) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
  }
}

const SCRIPT_SRC = "https://open.spotify.com/embed/iframe-api/v1";

/** "first and foremost, let's play some music" + a minimal player whose progress bar is the line. */
export function MusicLine({ tracks }: { tracks: Track[] }) {
  const embedRef = useRef<HTMLDivElement>(null);
  const controller = useRef<SpotifyController | null>(null);
  const playWhenReady = useRef(false);
  const userPaused = useRef(false);
  const wasPlaying = useRef(false);
  const indexRef = useRef(0);
  const nextRef = useRef<() => void>(() => {});

  const [typed, setTyped] = useState(false);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<PlaybackUpdate>({
    isPaused: true,
    isBuffering: false,
    duration: 0,
    position: 0,
  });

  // Load Spotify's player once, hidden off-screen; our buttons drive it.
  useEffect(() => {
    if (!tracks.length || !embedRef.current) return;
    const host = embedRef.current;
    const target = document.createElement("div");
    host.appendChild(target);

    window.onSpotifyIframeApiReady = (api) => {
      api.createController(target, { uri: tracks[0].uri, width: 300, height: 80 }, (c) => {
        controller.current = c;
        setReady(true);
        c.addListener("ready", () => {
          if (playWhenReady.current) {
            playWhenReady.current = false;
            c.play();
          }
        });
        c.addListener("playback_update", ({ data }) => {
          setState(data);
          if (!data.isPaused) wasPlaying.current = true;
          // Track finished on its own: Spotify pauses at the end (and may reset to 0).
          const ended =
            data.isPaused &&
            wasPlaying.current &&
            !userPaused.current &&
            data.duration > 0 &&
            (data.position === 0 || data.position >= data.duration - 1000);
          if (ended) {
            wasPlaying.current = false;
            nextRef.current();
          }
        });
      });
    };

    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      host.innerHTML = "";
      controller.current = null;
    };
  }, [tracks]);

  const playTrack = (i: number) => {
    const c = controller.current;
    if (!c) return;
    const n = (i + tracks.length) % tracks.length;
    indexRef.current = n;
    setIndex(n);
    setStarted(true);
    userPaused.current = false;
    wasPlaying.current = false;
    setState((s) => ({ ...s, position: 0, duration: 0 }));
    playWhenReady.current = true;
    c.loadUri(tracks[n].uri);
  };
  useEffect(() => {
    nextRef.current = () => playTrack(indexRef.current + 1);
  });

  const togglePlay = () => {
    const c = controller.current;
    if (!c) return;
    if (!started) {
      setStarted(true);
      userPaused.current = false;
      c.play();
    } else if (state.isPaused) {
      userPaused.current = false;
      c.resume();
    } else {
      userPaused.current = true;
      c.pause();
    }
  };

  const previous = () => {
    // like an mp3 player: restart the song unless we're near its start
    if (state.position > 3000 && controller.current) controller.current.seek(0);
    else playTrack(indexRef.current - 1);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!controller.current || !started || !state.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    controller.current.seek((fraction * state.duration) / 1000);
  };

  const progress = state.duration ? Math.min(state.position / state.duration, 1) : 0;
  const playing = started && !state.isPaused;
  const track = tracks[index];

  return (
    <div className="flex flex-col gap-3 font-narrow text-xl lg:flex-row lg:items-center lg:gap-[1.9rem] lg:text-[1.5rem]">
      <p className="shrink-0 leading-none">
        <TypedText
          text="first and foremost, let’s play some music"
          persistCaret={false}
          onDone={() => setTyped(true)}
        />
      </p>

      <div
        className={`flex flex-1 items-center gap-3 transition-opacity duration-700 lg:gap-[0.9rem] ${
          typed ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* the line is the progress bar; click it to seek */}
        <div className="relative flex-1 self-stretch">
          <div
            onClick={seek}
            aria-hidden
            className={`group absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 lg:h-[1rem] ${
              started ? "cursor-pointer" : ""
            }`}
          >
            <div
              className={`absolute left-0 right-0 top-1/2 h-px origin-left -translate-y-1/2 bg-black transition-transform duration-700 ease-out ${
                typed ? "scale-x-100" : "scale-x-0"
              }`}
            />
            <div
              className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-black"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          {started && track && (
            <p
              className="absolute inset-x-0 top-[calc(50%+0.5rem)] truncate font-pixel text-sm leading-none lg:text-[0.875rem]"
              aria-live="polite"
            >
              ♪ {track.title} — {track.artist}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 lg:gap-[0.25rem]">
          <PlayerButton label="Previous song" onClick={previous} disabled={!ready}>
            <path d="M6 5v14M19 5 9 12l10 7z" />
          </PlayerButton>
          <PlayerButton label={playing ? "Pause" : "Play"} onClick={togglePlay} disabled={!ready}>
            {playing ? <path d="M8 5v14M16 5v14" /> : <path d="M7 4.5v15L19.5 12z" />}
          </PlayerButton>
          <PlayerButton label="Next song" onClick={() => playTrack(index + 1)} disabled={!ready}>
            <path d="M18 5v14M5 5l10 7-10 7z" />
          </PlayerButton>
        </div>
      </div>

      {/* Spotify's player does the actual playback; it's kept off-screen. */}
      <div
        ref={embedRef}
        aria-hidden
        className="pointer-events-none fixed -left-[1000px] top-0 h-[80px] w-[300px] opacity-0"
      />
    </div>
  );
}

function PlayerButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-8 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/60 disabled:cursor-default disabled:opacity-40 lg:size-[2rem]"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4 lg:size-[1rem]"
        fill="black"
        stroke="black"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        aria-hidden
      >
        {children}
      </svg>
    </button>
  );
}
