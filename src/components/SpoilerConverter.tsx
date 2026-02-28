'use client';

import { useCallback, useEffect, useId, useMemo, useState } from 'react';

import { convertToDiscordSpoiler, type WrapMode } from '@/lib/spoiler';

type Toast = Readonly<{
    kind: 'success' | 'error';
    message: string;
}>;

type ModeOption = Readonly<{
    value: WrapMode;
    label: string;
    description: string;
}>;

const MODE_OPTIONS: readonly ModeOption[] = [
    {
        value: 'char',
        label: 'Character',
        description: 'Wrap every non-space character.',
    },
    {
        value: 'word',
        label: 'Word',
        description: 'Wrap each word; normalize spaces.',
    },
    {
        value: 'text',
        label: 'Line',
        description: 'Wrap each line; preserve newlines.',
    },
];

function getModeLabel(mode: WrapMode): string {
    const option = MODE_OPTIONS.find((x) => x.value === mode);
    return option?.label ?? mode;
}

export default function SpoilerConverter() {
    const groupId = useId();

    const [input, setInput] = useState<string>('Aaaaaaaaa!!! Got you.');
    const [mode, setMode] = useState<WrapMode>('char');
    const [output, setOutput] = useState<string>('');
    const [toast, setToast] = useState<Toast | null>(null);
    const [copyLocked, setCopyLocked] = useState<boolean>(false);

    const canConvert = useMemo(() => input.trim() !== '', [input]);
    const canCopy = useMemo(
        () => output.trim() !== '' && !copyLocked,
        [copyLocked, output],
    );

    const handleConvert = useCallback(() => {
        const nextOutput = convertToDiscordSpoiler(input, mode);
        setOutput(nextOutput);
        setToast(null);
    }, [input, mode]);

    const handleCopy = useCallback(async () => {
        if (!canCopy) {
            return;
        }

        if (!('clipboard' in navigator) || typeof navigator.clipboard.writeText !== 'function') {
            setToast({
                kind: 'error',
                message: 'Clipboard not available here. Select the output and copy manually.',
            });
            return;
        }

        try {
            await navigator.clipboard.writeText(output);
            setCopyLocked(true);
            setToast({
                kind: 'success',
                message: 'Copied to clipboard.',
            });
        } catch {
            setToast({
                kind: 'error',
                message: 'Copy failed. Select the output and copy manually.',
            });
        }
    }, [canCopy, output]);

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

    return (
        <section className="rounded-2xl border border-slate-300/70 bg-white/70 p-5 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_25px_60px_rgba(0,0,0,0.12)] backdrop-blur dark:border-slate-700/60 dark:bg-[#0b0f17]/65 dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_35px_90px_rgba(0,0,0,0.55)] sm:p-7">
            <div className="flex flex-col gap-4">
                <div>
                    <div className="flex items-end justify-between gap-3">
                        <h2 className="font-[var(--font-body)] text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-200">
                            Input
                        </h2>
                        <p className="font-[var(--font-body)] text-xs text-slate-600 dark:text-slate-400">
                            Ctrl/Cmd+Enter to convert
                        </p>
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (
                                e.key === 'Enter' &&
                                (e.metaKey || e.ctrlKey) &&
                                !e.shiftKey &&
                                !e.altKey
                            ) {
                                e.preventDefault();
                                handleConvert();
                            }
                        }}
                        placeholder="Paste or type your text here..."
                        rows={4}
                        className="mt-3 w-full resize-y rounded-xl border border-slate-300/70 bg-white/70 px-4 py-3 font-[var(--font-body)] text-slate-900 placeholder:text-slate-500 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset] outline-none focus-visible:ring-2 focus-visible:ring-[#feea3b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f2] dark:border-slate-700/70 dark:bg-black/35 dark:text-slate-100 dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] dark:focus-visible:ring-offset-[#070a10]"
                    />
                </div>

                <div>
                    <p className="font-[var(--font-body)] text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-200">
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
                                        className="block cursor-pointer rounded-xl border border-slate-300/70 bg-white/70 px-4 py-3 font-[var(--font-body)] shadow-[0_1px_0_rgba(255,255,255,0.55)_inset] transition focus-within:ring-2 focus-within:ring-[#feea3b] focus-within:ring-offset-2 focus-within:ring-offset-[#faf8f2] hover:border-slate-400 peer-checked:border-[#feea3b]/80 peer-checked:bg-[#feea3b]/[0.10] dark:border-slate-700/70 dark:bg-black/20 dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] dark:focus-within:ring-offset-[#070a10] dark:hover:border-slate-600 dark:peer-checked:bg-[#feea3b]/[0.08]"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                {option.label}
                                            </span>
                                            <span
                                                className={[
                                                    'rounded-full border px-2 py-0.5 text-[11px] tracking-wide',
                                                    checked
                                                        ? 'border-[#feea3b]/50 bg-[#feea3b]/[0.14] text-[#6a5400] dark:text-[#feea3b]'
                                                        : 'border-slate-300/70 bg-white/60 text-slate-600 dark:border-slate-700/60 dark:bg-black/20 dark:text-slate-400',
                                                ].join(' ')}
                                            >
                                                {option.value.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
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
                        onClick={handleConvert}
                        disabled={!canConvert}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#feea3b] px-4 py-3 font-[var(--font-body)] text-sm font-semibold text-[#0b0f17] shadow-[0_12px_30px_rgba(254,234,59,0.18)] transition hover:brightness-[0.98] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:flex-1"
                    >
                        Convert ({getModeLabel(mode)})
                        <svg
                            aria-hidden
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 7h16M4 12h10M4 17h16"
                            />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setInput('');
                            setOutput('');
                            setToast(null);
                        }}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300/70 bg-white/60 px-4 py-3 font-[var(--font-body)] text-sm font-semibold text-slate-800 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset] transition hover:border-slate-400 active:translate-y-px dark:border-slate-700/70 dark:bg-black/25 dark:text-slate-200 dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] dark:hover:border-slate-600 sm:w-auto"
                    >
                        Clear
                    </button>
                </div>

                <div>
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="font-[var(--font-body)] text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-200">
                            Output
                        </h2>
                        <button
                            type="button"
                            onClick={() => void handleCopy()}
                            disabled={!canCopy}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/70 px-3 py-2 font-[var(--font-body)] text-xs font-semibold text-slate-800 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset] transition hover:border-slate-400 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 dark:border-slate-700/70 dark:bg-black/30 dark:text-slate-200 dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] dark:hover:border-slate-600"
                        >
                            {copyLocked ? 'Copied' : 'Copy'}
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
                                e.key.toLowerCase() === 'c' &&
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
                        className="mt-3 w-full resize-y rounded-xl border border-slate-300/70 bg-white/70 px-4 py-3 font-[var(--font-mono)] text-sm text-slate-900 placeholder:text-slate-500 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset] outline-none focus-visible:ring-2 focus-visible:ring-[#9ff4ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f2] dark:border-slate-700/70 dark:bg-black/35 dark:text-slate-100 dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] dark:focus-visible:ring-offset-[#070a10]"
                    />

                    <div className="mt-3 min-h-6" role="status" aria-live="polite">
                        {toast == null ? null : (
                            <p
                                className={[
                                    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-[var(--font-body)] text-xs font-semibold',
                                    toast.kind === 'success'
                                        ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                                        : 'border-rose-400/25 bg-rose-400/10 text-rose-200',
                                ].join(' ')}
                            >
                                <span
                                    aria-hidden
                                    className={[
                                        'h-2 w-2 rounded-full',
                                        toast.kind === 'success'
                                            ? 'bg-emerald-300'
                                            : 'bg-rose-300',
                                    ].join(' ')}
                                />
                                <span>{toast.message}</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
