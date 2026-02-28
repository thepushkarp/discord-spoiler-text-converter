"use client";

import { useState } from "react";

export default function InlineSpoilerExample() {
  const [revealed, setRevealed] = useState<boolean>(false);

  return (
    <button
      type="button"
      onClick={() => setRevealed((previous) => !previous)}
      aria-label={revealed ? "Hide example spoiler" : "Reveal example spoiler"}
      aria-pressed={revealed}
      className={[
        "inline rounded-md border px-2 py-1 font-[var(--font-mono)] text-[0.95em] transition",
        revealed
          ? "border-[#5865f2]/40 bg-[#5865f2]/30 text-[#f2f3f5]"
          : "border-slate-700/60 bg-[#202225] text-transparent hover:bg-[#1a1b1e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a10]",
      ].join(" ")}
    >
      like this
    </button>
  );
}
