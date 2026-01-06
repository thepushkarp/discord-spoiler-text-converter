import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { SpoilerPreview } from './components/SpoilerPreview';

const wrapCharsWithBars = (str) =>
    [...str].map((char) => (char === ' ' ? ' ' : `||${char}||`)).join('');

const wrapWordsWithBars = (str) =>
    str
        .split(' ')
        .map((word) => `||${word}||`)
        .join(' ');

const wrapTextWithBars = (str) => `||${str}||`;

const options = [
    {
        value: 'char',
        label: 'Per Character',
        func: wrapCharsWithBars,
        shortcut: '1',
    },
    {
        value: 'word',
        label: 'Per Word',
        func: wrapWordsWithBars,
        shortcut: '2',
    },
    {
        value: 'text',
        label: 'Entire Text',
        func: wrapTextWithBars,
        shortcut: '3',
    },
];

const DISCORD_LIMIT = 2000;
const NITRO_LIMIT = 4000;

function WrapText() {
    const [inputText, setInputText] = useState('');
    const [wrapType, setWrapType] = useState('char');
    const [copyStatus, setCopyStatus] = useState('idle');
    const inputRef = useRef(null);

    const outputText = useMemo(() => {
        const text = inputText.trim();
        if (!text) return '';

        const normalizedText =
            wrapType !== 'text' ? text.replace(/\s+/g, ' ') : text;
        const option = options.find((o) => o.value === wrapType);
        return option ? option.func(normalizedText) : '';
    }, [inputText, wrapType]);

    const charCount = outputText.length;
    const isOverLimit = charCount > DISCORD_LIMIT;
    const isOverNitro = charCount > NITRO_LIMIT;

    const copyToClipboard = useCallback(async () => {
        if (!outputText) return;

        try {
            await navigator.clipboard.writeText(outputText);
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            setCopyStatus('error');
            console.error('Copy failed:', err);
            setTimeout(() => setCopyStatus('idle'), 2000);
        }
    }, [outputText]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                copyToClipboard();
            }

            if (e.key === 'Escape') {
                setInputText('');
                inputRef.current?.focus();
            }

            if ((e.ctrlKey || e.metaKey) && ['1', '2', '3'].includes(e.key)) {
                e.preventDefault();
                const option = options.find((o) => o.shortcut === e.key);
                if (option) setWrapType(option.value);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [copyToClipboard]);

    const handleInputChange = (e) => {
        let text = e.target.value;
        text = text.replace(/\s/g, ' ');
        setInputText(text);
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 space-y-6
                            border border-slate-200 dark:border-slate-700
                            shadow-sm animate-slide-up transition-colors duration-300"
            >
                <div className="space-y-2">
                    <label
                        htmlFor="spoiler-input"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                        Your Text
                    </label>
                    <textarea
                        ref={inputRef}
                        id="spoiler-input"
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder="Type or paste your text here..."
                        className="w-full p-4 rounded-xl
                                   bg-slate-50 dark:bg-slate-900
                                   border border-slate-200 dark:border-slate-600
                                   text-slate-800 dark:text-slate-100
                                   placeholder-slate-400 dark:placeholder-slate-500
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                                   transition-all duration-200 resize-none min-h-[100px]"
                        aria-describedby="input-hint"
                        rows={3}
                    />
                    <p
                        id="input-hint"
                        className="text-xs text-slate-500 dark:text-slate-400"
                    >
                        Press <kbd className="kbd">Esc</kbd> to clear
                    </p>
                </div>

                <fieldset className="space-y-3">
                    <legend className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                        Wrap Mode
                    </legend>
                    <div
                        role="radiogroup"
                        aria-label="Select wrap type"
                        className="flex flex-col sm:flex-row gap-2 sm:gap-3"
                    >
                        {options.map((option) => (
                            <label
                                key={option.value}
                                className={`
                                    flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                    cursor-pointer transition-all duration-200 border
                                    ${
                                        wrapType === option.value
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300'
                                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                                    }
                                `}
                            >
                                <input
                                    type="radio"
                                    name="wrapType"
                                    value={option.value}
                                    checked={wrapType === option.value}
                                    onChange={(e) =>
                                        setWrapType(e.target.value)
                                    }
                                    className="sr-only"
                                    aria-checked={wrapType === option.value}
                                />
                                <span className="font-medium">
                                    {option.label}
                                </span>
                                <kbd className="kbd text-[10px] hidden sm:inline">
                                    {option.shortcut}
                                </kbd>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="spoiler-output"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                        >
                            Spoiler Output
                        </label>
                        <div
                            className={`text-xs font-mono ${
                                isOverNitro
                                    ? 'text-red-600 dark:text-red-400'
                                    : isOverLimit
                                      ? 'text-amber-600 dark:text-amber-400'
                                      : 'text-slate-500 dark:text-slate-400'
                            }`}
                            aria-live="polite"
                        >
                            {charCount.toLocaleString()}/
                            {DISCORD_LIMIT.toLocaleString()}
                            {isOverLimit && !isOverNitro && (
                                <span className="ml-1">(Nitro OK)</span>
                            )}
                            {isOverNitro && (
                                <span className="ml-1">(Too long!)</span>
                            )}
                        </div>
                    </div>
                    <textarea
                        id="spoiler-output"
                        value={outputText}
                        readOnly
                        className="w-full p-4 rounded-xl
                                   bg-slate-100 dark:bg-slate-950
                                   border border-slate-200 dark:border-slate-700
                                   text-slate-800 dark:text-slate-100 font-mono text-sm
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                                   transition-all duration-200 resize-none min-h-[80px]"
                        aria-label="Converted spoiler text"
                        aria-live="polite"
                        rows={3}
                    />
                </div>

                <button
                    onClick={copyToClipboard}
                    disabled={!outputText}
                    className={`
                        w-full py-3 px-6 rounded-xl font-semibold
                        flex items-center justify-center gap-2
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2
                        focus:ring-offset-white dark:focus:ring-offset-slate-800
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                            copyStatus === 'copied'
                                ? 'bg-emerald-500 text-white focus:ring-emerald-500'
                                : copyStatus === 'error'
                                  ? 'bg-red-500 text-white focus:ring-red-500'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500'
                        }
                    `}
                    aria-label={
                        copyStatus === 'copied'
                            ? 'Copied!'
                            : copyStatus === 'error'
                              ? 'Copy failed'
                              : 'Copy to clipboard'
                    }
                >
                    {copyStatus === 'copied' ? (
                        <>
                            <CheckIcon />
                            <span>Copied!</span>
                        </>
                    ) : copyStatus === 'error' ? (
                        <>
                            <XIcon />
                            <span>Failed to copy</span>
                        </>
                    ) : (
                        <>
                            <ClipboardIcon />
                            <span>Copy to Clipboard</span>
                            <kbd className="kbd ml-2 hidden sm:inline">
                                Enter
                            </kbd>
                        </>
                    )}
                </button>

                <div role="status" aria-live="polite" className="sr-only">
                    {copyStatus === 'copied' && 'Text copied to clipboard'}
                    {copyStatus === 'error' && 'Failed to copy text'}
                </div>
            </div>

            <div
                className="animate-slide-up"
                style={{ animationDelay: '100ms' }}
            >
                <SpoilerPreview inputText={inputText} wrapType={wrapType} />
            </div>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 space-y-1 animate-fade-in">
                <p>
                    <kbd className="kbd">Ctrl</kbd>+
                    <kbd className="kbd">1/2/3</kbd> switch modes
                    {' | '}
                    <kbd className="kbd">Ctrl</kbd>+
                    <kbd className="kbd">Enter</kbd> copy
                    {' | '}
                    <kbd className="kbd">Esc</kbd> clear
                </p>
            </div>
        </div>
    );
}

function ClipboardIcon() {
    return (
        <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
            />
        </svg>
    );
}

function XIcon() {
    return (
        <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );
}

export default WrapText;
