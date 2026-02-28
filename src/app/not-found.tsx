import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-4 py-14">
            <div className="w-full max-w-xl rounded-2xl border border-slate-300/70 bg-white/70 p-7 text-center shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_25px_60px_rgba(0,0,0,0.12)] backdrop-blur dark:border-slate-700/60 dark:bg-[#0b0f17]/65 dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_35px_90px_rgba(0,0,0,0.55)]">
                <p className="font-[var(--font-body)] text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                    404
                </p>
                <h1 className="mt-4 font-[var(--font-display)] text-4xl leading-[0.95] text-slate-950 sm:text-5xl dark:text-slate-50">
                    Tape snapped.
                </h1>
                <p className="mt-3 font-[var(--font-body)] text-sm leading-relaxed text-slate-700 sm:text-base dark:text-slate-300">
                    That page does not exist. Head back to the converter and keep spoilers safely
                    sealed.
                </p>
                <div className="mt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-[#feea3b] px-5 py-3 font-[var(--font-body)] text-sm font-semibold text-[#0b0f17] shadow-[0_12px_30px_rgba(254,234,59,0.18)] transition hover:brightness-[0.98] active:translate-y-px"
                    >
                        Back to converter
                    </Link>
                </div>
            </div>
        </main>
    );
}
