"use client";

import { useRef, useState } from "react";
import { useWindowManager } from "@/components/WindowManager";

type WindowProps = {
  /** Unique id, used for stacking order and the taskbar. */
  id: string;
  /** Shown in the taskbar when the window is minimized or closed. */
  title: string;
  children: React.ReactNode;
  className?: string;
  /** Smaller chrome, for popup windows. */
  compact?: boolean;
  /** Stacking order before the window is first clicked. */
  initialZ?: number;
};

const clamp = (v: number, max: number) => Math.min(Math.max(v, 0), max);

/**
 * A retro browser window that can be dragged by its tab bar, minimized,
 * maximized and closed. Chrome is sized in em so `compact` scales it down.
 */
export function Window({
  id,
  title,
  children,
  className = "",
  compact = false,
  initialZ = 1,
}: WindowProps) {
  const wm = useWindowManager();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [maximized, setMaximized] = useState(false);
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  if (wm.hidden.some((h) => h.id === id)) return null;

  const onPointerDown = (e: React.PointerEvent) => {
    if (maximized || e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    // Clamp the pointer to the viewport so the tab bar can't be dragged out of reach.
    const x = clamp(e.clientX, window.innerWidth);
    const y = clamp(e.clientY, window.innerHeight);
    setOffset({ x: d.ox + x - d.px, y: d.oy + y - d.py });
  };

  const endDrag = () => {
    drag.current = null;
  };

  const minimize = () => wm.hide({ id, title, kind: "minimized" });
  const close = () => {
    setOffset({ x: 0, y: 0 });
    setMaximized(false);
    wm.hide({ id, title, kind: "closed" });
  };

  const style: React.CSSProperties = maximized
    ? { position: "fixed", inset: "1rem", width: "auto", height: "auto", zIndex: 999 }
    : { translate: `${offset.x}px ${offset.y}px`, zIndex: wm.z[id] ?? initialZ };

  return (
    <div
      role="dialog"
      aria-label={title}
      onPointerDownCapture={() => wm.focus(id)}
      style={style}
      className={`flex flex-col rounded-[0.6em] border border-[#d2d2d2] bg-[#ececec] px-[0.75em] pb-[0.75em] shadow-[inset_0_0_0_0.15em_#f8f8f8,0_0.25em_0.75em_rgba(0,0,0,0.08)] ${
        compact ? "text-[0.55rem]" : "text-[1rem]"
      } ${maximized ? "" : "relative"} ${className}`}
    >
      {/* tab bar: drag handle */}
      <div
        className={`relative h-[4.25em] shrink-0 touch-none select-none overflow-hidden ${
          maximized ? "" : "cursor-grab active:cursor-grabbing"
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) setMaximized((m) => !m);
        }}
      >
        <div
          aria-hidden
          className="absolute bottom-0 left-[2%] z-10 h-[3.25em] w-[28%] bg-white [clip-path:polygon(0_100%,4%_8%,8%_0,92%_0,96%_8%,100%_100%)]"
        >
          <span className="absolute right-[9%] top-[0.9em] size-[1.1em] rounded-full border-[0.15em] border-[#d6d6d6]" />
        </div>
        <div aria-hidden className="absolute bottom-0 left-[29%] h-[2.6em] w-[55%] rounded-t-[0.6em] bg-[#e2e2e2]">
          <span className="absolute left-[24%] top-[0.8em] size-[0.9em] rounded-full bg-[#ececec]" />
          <span className="absolute right-[4%] top-[0.8em] size-[0.9em] rounded-full bg-[#ececec]" />
        </div>
        <div
          className={`group/controls absolute right-[1.2em] top-[1.1em] flex ${
            compact ? "text-[1.6em]" : ""
          }`}
        >
          <Control label={`Minimize ${title}`} color="bg-[#a8a8a8]" onClick={minimize}>
            <path d="M3 6h6" />
          </Control>
          <Control
            label={`${maximized ? "Restore" : "Maximize"} ${title}`}
            color="bg-[#f4e27c]"
            onClick={() => setMaximized((m) => !m)}
          >
            <rect x="3.25" y="3.25" width="5.5" height="5.5" />
          </Control>
          <Control label={`Close ${title}`} color="bg-[#f4a3a9]" onClick={close}>
            <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" />
          </Control>
        </div>
      </div>
      {/* page */}
      <div
        className={`relative flex-1 rounded-[0.35em] bg-white text-[1rem] shadow-[inset_0_0_0.5em_rgba(0,0,0,0.1)] ${
          maximized ? "overflow-auto" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Control({
  label,
  color,
  onClick,
  children,
}: {
  label: string;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="cursor-pointer p-[0.2em]"
    >
      <span className={`block size-[0.95em] rounded-full ${color}`}>
        <svg
          viewBox="0 0 12 12"
          className="size-full opacity-0 transition-opacity group-hover/controls:opacity-100"
          fill="none"
          stroke="rgba(0,0,0,0.55)"
          strokeWidth="1.4"
          strokeLinecap="round"
          aria-hidden
        >
          {children}
        </svg>
      </span>
    </button>
  );
}
