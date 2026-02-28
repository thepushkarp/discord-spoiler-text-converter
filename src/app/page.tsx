import Footer from "@/components/Footer";
import InlineSpoilerExample from '@/components/InlineSpoilerExample';
import SpoilerConverter from "@/components/SpoilerConverter";

export default function HomePage() {
  return (
      <main className="flex min-h-screen flex-col items-center px-4 py-10 sm:py-14">
          <div className="w-full max-w-3xl">
              <h1 className="rise-in rise-in-delay-1 mt-6 font-[var(--font-display)] text-5xl leading-[0.92] text-slate-50 sm:text-6xl">
                  Discord Spoiler
                  <span className="mt-2 block">
                      <span className="tape-shimmer rounded-lg bg-gradient-to-r from-[#feea3b] via-[#9ff4ff] to-[#feea3b] bg-clip-text text-transparent">
                          Text Converter
                      </span>
                  </span>
              </h1>

              <p className="rise-in rise-in-delay-2 mt-4 max-w-prose font-[var(--font-body)] text-sm leading-relaxed text-slate-300 sm:text-base">
                  Wrap characters, words, or full lines into Discord&apos;s spoiler
                  syntax <InlineSpoilerExample />
              </p>

              <div className="rise-in rise-in-delay-3 mt-8">
                  <SpoilerConverter />
              </div>

              <Footer />
          </div>
      </main>
  );
}
