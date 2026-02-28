export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-800/60 pt-6 text-center font-[var(--font-body)] text-sm text-slate-400">
      <p className="flex flex-wrap items-center justify-center gap-1">
        <span>built by</span>
        <a
          href="https://thepushkarp.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-200 underline decoration-slate-500/60 underline-offset-4 transition hover:decoration-[#9ff4ff]"
        >
          Pushkar Patel
        </a>
      </p>
    </footer>
  );
}
