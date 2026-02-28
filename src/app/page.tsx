import Footer from '@/components/Footer';
import SpoilerConverter from '@/components/SpoilerConverter';

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center px-4 py-10 sm:py-14">
            <div className="w-full max-w-3xl">
                <div className="rise-in">
                    <div className="inline-flex items-center gap-3 rounded-full border border-slate-700/60 bg-[#0b0f17]/55 px-4 py-2 text-[11px] font-[var(--font-body)] uppercase tracking-[0.32em] text-slate-200 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-[#feea3b] shadow-[0_0_0_3px_rgba(254,234,59,0.12)]" />
                        <span className="whitespace-nowrap">Spoiler Tape</span>
                        <span className="text-slate-400">Discord Markdown</span>
                    </div>
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-6 font-[var(--font-display)] text-5xl leading-[0.92] text-slate-50 sm:text-6xl">
                    Discord Spoiler
                    <span className="mt-2 block">
                        <span className="tape-shimmer rounded-lg bg-gradient-to-r from-[#feea3b] via-[#9ff4ff] to-[#feea3b] bg-clip-text text-transparent">
                            Text Converter
                        </span>
                    </span>
                </h1>

                <p className="rise-in rise-in-delay-2 mt-4 max-w-prose font-[var(--font-body)] text-sm leading-relaxed text-slate-300 sm:text-base">
                    Wrap characters, words, or full lines into Discord&apos;s spoiler syntax{' '}
                    <span className="rounded-md border border-slate-700/60 bg-black/30 px-2 py-1 font-[var(--font-mono)] text-[0.95em] text-slate-100">
                        ||like this||
                    </span>
                    .
                </p>

                <div className="rise-in rise-in-delay-3 mt-8">
                    <SpoilerConverter />
                </div>

                <Footer />
            </div>
        </main>
    );
}

