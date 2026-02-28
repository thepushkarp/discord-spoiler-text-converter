"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";

import { convertToDiscordSpoiler, type WrapMode } from "@/lib/spoiler";

type Toast = Readonly<{
  message: string;
}>;

type ModeOption = Readonly<{
  value: WrapMode;
  label: string;
  description: string;
}>;

const MODE_OPTIONS: readonly ModeOption[] = [
  {
    value: "char",
    label: "Character",
    description: "Wrap every non-space character.",
  },
  {
    value: "word",
    label: "Word",
    description: "Wrap each word; normalize spaces.",
  },
  {
    value: "text",
    label: "Line",
    description: "Wrap each line; preserve newlines.",
  },
];

type PreviewSegment = Readonly<
  | {
      kind: "text";
      value: string;
    }
  | {
      kind: "spoiler";
      value: string;
      index: number;
    }
>;

function parsePreviewSegments(markdown: string): PreviewSegment[] {
  if (markdown === "") {
    return [];
  }

  const segments: PreviewSegment[] = [];
  const regex = /\|\|([\s\S]*?)\|\|/gu;
  let spoilerIndex = 0;
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while (true) {
    match = regex.exec(markdown);
    if (match == null) {
      break;
    }

    const start = match.index;
    if (start > lastIndex) {
      segments.push({
        kind: "text",
        value: markdown.slice(lastIndex, start),
      });
    }

    segments.push({
      kind: "spoiler",
      value: match[1] ?? "",
      index: spoilerIndex,
    });
    spoilerIndex += 1;
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < markdown.length) {
    segments.push({
      kind: "text",
      value: markdown.slice(lastIndex),
    });
  }

  return segments;
}

export default function SpoilerConverter() {
  const groupId = useId();

  const [input, setInput] = useState<string>("Aaaaaaaaa!!! Got you.");
  const [mode, setMode] = useState<WrapMode>("char");
  const [toast, setToast] = useState<Toast | null>(null);
  const [copyLocked, setCopyLocked] = useState<boolean>(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<number>>(new Set());

  const output = useMemo(() => convertToDiscordSpoiler(input, mode), [input, mode]);
  const previewSegments = useMemo(() => parsePreviewSegments(output), [output]);
  const canCopy = useMemo(() => output.trim() !== "" && !copyLocked, [copyLocked, output]);

  const handleCopy = useCallback(async () => {
    if (!canCopy) {
      return;
    }

    const clipboard = navigator.clipboard;
    if (clipboard == null || typeof clipboard.writeText !== "function") {
      setToast({
        message: "Clipboard not available here. Select the output and copy manually.",
      });
      return;
    }

    try {
      await clipboard.writeText(output);
      setCopyLocked(true);
      setToast(null);
    } catch {
      setToast({
        message: "Copy failed. Select the output and copy manually.",
      });
    }
  }, [canCopy, output]);

  const toggleSpoiler = useCallback((index: number) => {
    setRevealedSpoilers((previous) => {
      const next = new Set(previous);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!copyLocked) {
      return;
    }
    const id = window.setTimeout(() => setCopyLocked(false), 900);
    return () => window.clearTimeout(id);
  }, [copyLocked]);

  useEffect(() => {
    if (toast == null) {
      return;
    }
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    setRevealedSpoilers(new Set());
  }, [output]);

  return (
    <section className="rounded-2xl border border-slate-700/60 bg-[#0b0f17]/65 p-5 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_35px_90px_rgba(0,0,0,0.55)] backdrop-blur sm:p-7">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-[var(--font-body)] text-sm font-semibold tracking-wide text-slate-200">
              Input
            </h2>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste or type your text here..."
            rows={4}
            className="mt-3 w-full resize-y rounded-xl border border-slate-700/70 bg-black/35 px-4 py-3 font-[var(--font-body)] text-slate-100 placeholder:text-slate-500 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] outline-none focus-visible:ring-2 focus-visible:ring-[#feea3b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a10]"
          />
        </div>

        <div>
          <p className="font-[var(--font-body)] text-sm font-semibold tracking-wide text-slate-200">
            Convert by
          </p>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {MODE_OPTIONS.map((option) => {
              const id = `${groupId}-${option.value}`;
              const checked = mode === option.value;

              return (
                <div key={option.value} className="relative">
                  <input
                    id={id}
                    type="radio"
                    name={groupId}
                    value={option.value}
                    checked={checked}
                    onChange={() => setMode(option.value)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={id}
                    className="block cursor-pointer rounded-xl border border-slate-700/70 bg-black/20 px-4 py-3 font-[var(--font-body)] shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] transition focus-within:ring-2 focus-within:ring-[#feea3b] focus-within:ring-offset-2 focus-within:ring-offset-[#070a10] hover:border-slate-600 peer-checked:border-[#feea3b]/80 peer-checked:bg-[#feea3b]/[0.08]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-100">{option.label}</span>
                      <span
                        className={[
                          "rounded-full border px-2 py-0.5 text-[11px] tracking-wide",
                          checked
                            ? "border-[#feea3b]/50 bg-[#feea3b]/[0.14] text-[#feea3b]"
                            : "border-slate-700/60 bg-black/20 text-slate-400",
                        ].join(" ")}
                      >
                        {option.value.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {option.description}
                    </p>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setInput("");
              setToast(null);
            }}
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700/70 bg-black/25 px-4 py-3 font-[var(--font-body)] text-sm font-semibold text-slate-200 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] transition hover:border-slate-600 active:translate-y-px sm:w-auto"
          >
            Clear
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-[var(--font-body)] text-sm font-semibold tracking-wide text-slate-200">
              Output
            </h2>
            <button
              type="button"
              onClick={() => void handleCopy()}
              disabled={!canCopy}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-black/30 px-3 py-2 font-[var(--font-body)] text-xs font-semibold text-slate-200 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] transition hover:border-slate-600 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55"
            >
              {copyLocked ? "Copied" : "Copy"}
              <svg
                aria-hidden
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"
                />
              </svg>
            </button>
          </div>

          <textarea
            value={output}
            readOnly
            spellCheck={false}
            placeholder="Converted spoiler markdown will appear here..."
            rows={5}
            onKeyDown={(e) => {
              if (
                e.key.toLowerCase() === "c" &&
                (e.metaKey || e.ctrlKey) &&
                !e.shiftKey &&
                !e.altKey
              ) {
                const el = e.currentTarget;
                if (el.selectionStart === el.selectionEnd) {
                  e.preventDefault();
                  void handleCopy();
                }
              }
            }}
            className="mt-3 w-full resize-y rounded-xl border border-slate-700/70 bg-black/35 px-4 py-3 font-[var(--font-mono)] text-sm text-slate-100 placeholder:text-slate-500 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] outline-none focus-visible:ring-2 focus-visible:ring-[#9ff4ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a10]"
          />

          {toast == null ? null : (
            <div className="mt-2" role="status" aria-live="polite">
              <p className="inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-400/10 px-3 py-1.5 font-[var(--font-body)] text-xs font-semibold text-rose-200">
                <span aria-hidden className="h-2 w-2 rounded-full bg-rose-300" />
                <span>{toast.message}</span>
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-[var(--font-body)] text-sm font-semibold tracking-wide text-slate-200">
              Discord preview
            </h2>
            <p className="font-[var(--font-body)] text-xs text-slate-400">
              Click spoiler blocks to reveal
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-[#202225] bg-[#313338] p-4">
            {previewSegments.length === 0 ? (
              <p className="font-[var(--font-body)] text-sm text-[#b5bac1]">
                Discord preview appears here.
              </p>
            ) : (
              <p className="whitespace-pre-wrap break-words font-[var(--font-body)] text-[15px] leading-6 text-[#dbdee1]">
                {previewSegments.map((segment, idx) => {
                  if (segment.kind === "text") {
                    return <span key={`text-${idx}`}>{segment.value}</span>;
                  }

                  const isRevealed = revealedSpoilers.has(segment.index);
                  return (
                    <button
                      key={`spoiler-${segment.index}`}
                      type="button"
                      onClick={() => toggleSpoiler(segment.index)}
                      className={[
                        "mx-[1px] inline rounded px-[2px] transition",
                        isRevealed
                          ? "bg-[#5865f2]/30 text-[#f2f3f5]"
                          : "bg-[#202225] text-transparent hover:bg-[#1a1b1e] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5865f2]",
                      ].join(" ")}
                      aria-label={isRevealed ? "Hide spoiler" : "Reveal spoiler"}
                    >
                      {segment.value}
                    </button>
                  );
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
