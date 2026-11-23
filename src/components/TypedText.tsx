"use client";

import { useEffect, useRef, useState } from "react";

type TypedTextProps = {
  text: string;
  /** Text read by screen readers (defaults to `text`). */
  label?: string;
  /** Delay before typing starts, in ms. */
  startDelay?: number;
  /** Average time per character, in ms. */
  speed?: number;
  /** Keep the caret blinking after typing finishes (otherwise it disappears). */
  persistCaret?: boolean;
  /** Called once the whole text has been typed. */
  onDone?: () => void;
};

/** Types `text` out once on mount, followed by a blinking caret. */
export function TypedText({
  text,
  label = text,
  startDelay = 300,
  speed = 55,
  persistCaret = true,
  onDone,
}: TypedTextProps) {
  const chars = Array.from(text);
  const [count, setCount] = useState(0);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let t = 0;
    if (!reduceMotion) {
      t = startDelay;
      for (let i = 1; i < chars.length; i++) {
        // slight jitter so it feels hand-typed; pause a little after commas
        t += speed * (0.6 + Math.random() * 0.8) + (chars[i - 2] === "," ? speed * 2 : 0);
        timers.push(setTimeout(() => setCount(i), t));
      }
      t += speed;
    }
    timers.push(
      setTimeout(() => {
        setCount(chars.length);
        onDoneRef.current?.();
      }, t),
    );

    return () => timers.forEach(clearTimeout);
  }, [chars.length, startDelay, speed]); // eslint-disable-line react-hooks/exhaustive-deps

  const showCaret = persistCaret || count < chars.length;

  return (
    <>
      <span className="sr-only">{label}</span>
      <span aria-hidden className="relative inline-block">
        {/* invisible full text reserves the final size, so nothing shifts while typing */}
        <span className="typed-placeholder invisible">{text}</span>
        <span className="typed-text absolute inset-0">
          {chars.slice(0, count).join("")}
          {/* negative margin: the caret takes no width, so it never wraps to a new line */}
          {showCaret && (
            <span className="-mr-[0.11em] ml-[0.05em] inline-block h-[0.85em] w-[0.06em] translate-y-[0.08em] bg-current motion-safe:animate-blink" />
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
