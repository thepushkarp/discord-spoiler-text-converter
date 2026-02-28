export default function Footer() {
    return (
        <footer className="mt-10 border-t border-slate-200/80 pt-6 text-center font-[var(--font-body)] text-sm text-slate-600 dark:border-slate-800/60 dark:text-slate-400">
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                <a
                    href="https://github.com/thepushkarp/discord-spoiler-text-converter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-900 underline decoration-slate-400/70 underline-offset-4 transition hover:decoration-[#feea3b] dark:text-slate-200 dark:decoration-slate-500/60"
                >
                    Discord Spoiler Text Converter
                </a>
                <span aria-hidden className="text-slate-400 dark:text-slate-600">
                    /
                </span>
                <span>built by</span>
                <a
                    href="https://thepushkarp.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-900 underline decoration-slate-400/70 underline-offset-4 transition hover:decoration-[#9ff4ff] dark:text-slate-200 dark:decoration-slate-500/60"
                >
                    Pushkar Patel
                </a>
            </p>
        </footer>
    );
}
