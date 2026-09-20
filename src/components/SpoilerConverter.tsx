"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";

import InlineSpoiler from "@/components/InlineSpoiler";
import { convertToDiscordSpoiler, type WrapMode } from "@/lib/spoiler";

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
  let spoilerIndex = 0;
  let cursor = 0;

  while (cursor < markdown.length) {
    const open = markdown.indexOf("||", cursor);
    if (open === -1) {
      segments.push({
        kind: "text",
        value: markdown.slice(cursor),
      });
      break;
    }

    if (open > cursor) {
      segments.push({
        kind: "text",
        value: markdown.slice(cursor, open),
      });
    }

    const contentStart = open + 2;
    const close = markdown.indexOf("||", contentStart + 1);
    if (close === -1) {
      segments.push({
        kind: "text",
        value: markdown.slice(open),
      });
      break;
    }

    segments.push({
      kind: "spoiler",
      value: markdown.slice(contentStart, close),
      index: spoilerIndex,
    });
    spoilerIndex += 1;
    cursor = close + 2;
  }

  return segments;
}

export default function SpoilerConverter() {
  const groupId = useId();

  const [input, setInput] = useState<string>("");
  const [mode, setMode] = useState<WrapMode>("char");
  const [copyError, setCopyError] = useState<string | null>(null);
  const [copyLocked, setCopyLocked] = useState<boolean>(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<number>>(new Set());

  const output = useMemo(() => convertToDiscordSpoiler(input, mode), [input, mode]);
  const previewSegments = useMemo(() => parsePreviewSegments(output), [output]);
  const canCopy = output.trim() !== "" && !copyLocked;
  const selectedMode = MODE_OPTIONS.find((option) => option.value === mode)!;

  const handleCopy = useCallback(async () => {
    if (!canCopy) {
      return;
    }

    const clipboard = navigator.clipboard;
    if (clipboard == null || typeof clipboard.writeText !== "function") {
      setCopyError("Clipboard unavailable. Select the spoiler text and copy manually.");
      return;
    }

    try {
      await clipboard.writeText(output);
      setCopyLocked(true);
      setCopyError(null);
    } catch {
      setCopyError("Copy failed. Select the spoiler text and copy manually.");
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
    setRevealedSpoilers(new Set());
    setCopyLocked(false);
    setCopyError(null);
  }, [output]);

  return (
    <div className="converter">
      <div>
        <div className="field-heading">
          <label htmlFor={`${groupId}-input`}>Your text</label>
          <button
            type="button"
            className="quiet-button"
            disabled={input === ""}
            onClick={() => {
              setInput("");
              setCopyError(null);
            }}
          >
            Clear
          </button>
        </div>
        <textarea
          id={`${groupId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your text here…"
          rows={4}
          className="text-field"
        />
      </div>

      <fieldset aria-describedby={`${groupId}-mode-description`}>
        <legend className="field-label mb-2">Convert by</legend>
        <div className="mode-options">
          {MODE_OPTIONS.map((option) => (
            <label key={option.value} className="mode-option">
              <input
                type="radio"
                name={groupId}
                value={option.value}
                checked={mode === option.value}
                onChange={() => setMode(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <p id={`${groupId}-mode-description`} className="muted mt-2 text-sm">
          {selectedMode.description}
        </p>
      </fieldset>

      <div>
        <div className="field-heading">
          <label htmlFor={`${groupId}-output`}>Spoiler text</label>
          <button
            type="button"
            onClick={() => void handleCopy()}
            disabled={!canCopy}
            className="primary-button copy-button"
          >
            {copyLocked ? "Copied" : "Copy"}
          </button>
        </div>
        <textarea
          id={`${groupId}-output`}
          value={output}
          readOnly
          spellCheck={false}
          placeholder="Your spoiler text appears here…"
          rows={4}
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
          className="text-field output-field"
        />
        <p
          role="status"
          aria-live="polite"
          className={copyError ? "copy-error mt-2 text-sm" : "sr-only"}
        >
          {copyError ?? (copyLocked ? "Copied" : "")}
        </p>
      </div>

      <section aria-labelledby={`${groupId}-preview`}>
        <div className="preview-heading">
          <h2 id={`${groupId}-preview`} className="field-label">
            Discord preview
          </h2>
          <p className="muted text-sm">Click a spoiler to reveal</p>
        </div>
        <div className="preview">
          {previewSegments.length === 0 ? (
            <p className="muted">Your preview appears here.</p>
          ) : (
            <p className="preview-content">
              {previewSegments.map((segment, idx) => {
                if (segment.kind === "text") {
                  return <span key={`text-${idx}`}>{segment.value}</span>;
                }
                const isRevealed = revealedSpoilers.has(segment.index);
                return (
                  <InlineSpoiler
                    key={`spoiler-${segment.index}`}
                    revealed={isRevealed}
                    onToggle={() => toggleSpoiler(segment.index)}
                  >
                    {segment.value}
                  </InlineSpoiler>
                );
              })}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
