"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type Hidden = { id: string; title: string; kind: "minimized" | "closed" };

type WindowManager = {
  hidden: Hidden[];
  z: Record<string, number>;
  focus: (id: string) => void;
  hide: (entry: Hidden) => void;
  restore: (id: string) => void;
};

const Ctx = createContext<WindowManager | null>(null);

export function useWindowManager() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Window must be inside <WindowManagerProvider>");
  return ctx;
}

/** Tracks stacking order and hidden windows, and renders the taskbar. */
export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState<Hidden[]>([]);
  const [z, setZ] = useState<Record<string, number>>({});
  const top = useRef(10);

  const focus = useCallback((id: string) => {
    setZ((prev) => (prev[id] === top.current ? prev : { ...prev, [id]: ++top.current }));
  }, []);

  const hide = useCallback((entry: Hidden) => {
    setHidden((prev) => [...prev.filter((h) => h.id !== entry.id), entry]);
  }, []);

  const restore = useCallback(
    (id: string) => {
      setHidden((prev) => prev.filter((h) => h.id !== id));
      focus(id);
    },
    [focus],
  );

  return (
    <Ctx.Provider value={{ hidden, z, focus, hide, restore }}>
      {children}
      {hidden.length > 0 && (
        <div
          role="toolbar"
          aria-label="Hidden windows"
          className="fixed bottom-4 left-4 z-[1000] flex flex-wrap gap-2 font-pixel text-lg leading-none lg:text-[1.25rem]"
        >
          {hidden.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => restore(h.id)}
              className="flex items-center gap-2 rounded-md border border-[#d2d2d2] bg-[#ececec] px-3 py-2 shadow-[0_0.25rem_0.75rem_rgba(0,0,0,0.12)] hover:bg-white"
            >
              <span aria-hidden className={h.kind === "closed" ? "opacity-50" : ""}>
                ▢
              </span>
              {h.title}
            </button>
          ))}
        </div>
      )}
    </Ctx.Provider>
  );
}
