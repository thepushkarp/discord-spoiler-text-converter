import { useState, useMemo } from 'react';

function SpoilerSegment({ text }) {
    const [revealed, setRevealed] = useState(false);

    if (!text || text === ' ') {
        return <span>{text}</span>;
    }

    return (
        <span
            onClick={() => setRevealed(!revealed)}
            className={`
                inline cursor-pointer rounded transition-all duration-200
                ${
                    revealed
                        ? 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100'
                        : 'bg-slate-400 dark:bg-slate-500 text-transparent hover:bg-slate-500 dark:hover:bg-slate-400'
                }
            `}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setRevealed(!revealed);
                }
            }}
            aria-label={
                revealed ? `Revealed: ${text}` : 'Click to reveal spoiler'
            }
        >
            {text}
        </span>
    );
}

export function SpoilerPreview({ inputText, wrapType }) {
    const [allRevealed, setAllRevealed] = useState(false);

    const segments = useMemo(() => {
        if (!inputText.trim()) return [];

        const text = inputText.trim().replace(/\s+/g, ' ');

        switch (wrapType) {
            case 'char':
                return [...text].map((char, i) => ({
                    text: char,
                    key: `char-${i}`,
                    isSpoiler: char !== ' ',
                }));
            case 'word':
                return text.split(' ').flatMap((word, i, arr) => {
                    const items = [
                        { text: word, key: `word-${i}`, isSpoiler: true },
                    ];
                    if (i < arr.length - 1) {
                        items.push({
                            text: ' ',
                            key: `space-${i}`,
                            isSpoiler: false,
                        });
                    }
                    return items;
                });
            case 'text':
            default:
                return [{ text, key: 'full', isSpoiler: true }];
        }
    }, [inputText, wrapType]);

    if (!inputText.trim()) {
        return (
            <div
                className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4
                            text-slate-400 dark:text-slate-500 text-center italic
                            border border-slate-200 dark:border-slate-700
                            transition-colors duration-300"
            >
                Type something above to see the preview
            </div>
        );
    }

    return (
        <div
            className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden
                        border border-slate-200 dark:border-slate-700
                        transition-colors duration-300"
        >
            <div
                className="flex items-center justify-between px-4 py-2
                            bg-slate-200 dark:bg-slate-700
                            border-b border-slate-300 dark:border-slate-600"
            >
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Live Preview
                </span>
                <button
                    onClick={() => setAllRevealed(!allRevealed)}
                    className="text-xs text-indigo-600 dark:text-indigo-400
                               hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                    {allRevealed ? 'Hide all' : 'Reveal all'}
                </button>
            </div>

            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-medium text-slate-800 dark:text-slate-100">
                                Preview Bot
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                Today at 12:00 PM
                            </span>
                        </div>
                        <div className="text-slate-700 dark:text-slate-200 leading-relaxed">
                            {allRevealed ? (
                                <span>{inputText.trim()}</span>
                            ) : (
                                segments.map((segment) =>
                                    segment.isSpoiler ? (
                                        <SpoilerSegment
                                            key={segment.key}
                                            text={segment.text}
                                        />
                                    ) : (
                                        <span key={segment.key}>
                                            {segment.text}
                                        </span>
                                    ),
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpoilerPreview;
