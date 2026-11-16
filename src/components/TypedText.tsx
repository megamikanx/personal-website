"use client";

import { useEffect, useState } from "react";

type TypedTextProps = {
  text: string;
  /** Text read by screen readers (defaults to `text`). */
  label?: string;
  /** Delay before typing starts, in ms. */
  startDelay?: number;
  /** Average time per character, in ms. */
  speed?: number;
};

/** Types `text` out once on mount, with a blinking caret. */
export function TypedText({ text, label = text, startDelay = 400, speed = 90 }: TypedTextProps) {
  const chars = Array.from(text);
  const [count, setCount] = useState(0);
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      timers.push(setTimeout(() => {
        setCount(chars.length);
        setShowCaret(false);
      }, 0));
    } else {
      let t = startDelay;
      for (let i = 1; i <= chars.length; i++) {
        // slight jitter so it feels hand-typed; pause a little after commas
        t += speed * (0.6 + Math.random() * 0.8) + (chars[i - 2] === "," ? speed * 2 : 0);
        timers.push(setTimeout(() => setCount(i), t));
      }
      timers.push(setTimeout(() => setShowCaret(false), t + 2500));
    }

    return () => timers.forEach(clearTimeout);
  }, [chars.length, startDelay, speed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <span className="sr-only">{label}</span>
      <span aria-hidden className="relative inline-block">
        {/* invisible full text reserves the final size, so nothing shifts while typing */}
        <span className="typed-placeholder invisible">{text}</span>
        <span className="typed-text absolute inset-0">
          {chars.slice(0, count).join("")}
          {showCaret && (
            <span className="ml-[0.05em] inline-block h-[0.85em] w-[0.06em] translate-y-[0.08em] animate-blink bg-current" />
          )}
        </span>
      </span>
      {/* without JavaScript, just show the text */}
      <noscript>
        <style>{".typed-placeholder{visibility:visible}.typed-text{display:none}"}</style>
      </noscript>
    </>
  );
}
