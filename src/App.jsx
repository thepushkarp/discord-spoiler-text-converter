import { Helmet } from 'react-helmet-async';
import WrapText from './WrapText';
import Footer from './Footer';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
    const [isDark, toggleDark] = useDarkMode();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Helmet>
                <title>Discord Spoiler Text Converter</title>
                <meta
                    name="description"
                    content="Convert your text to Discord Spoiler Text in an instant. Wrap by character, word, or entire text."
                />
                <meta
                    property="og:title"
                    content="Discord Spoiler Text Converter"
                />
                <meta
                    property="og:description"
                    content="Convert your text to Discord Spoiler Text in an instant"
                />
                <meta property="og:image" content="/logo512.png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Discord Spoiler Text Converter"
                />
                <meta
                    name="twitter:description"
                    content="Convert your text to Discord Spoiler Text in an instant"
                />
                <meta name="twitter:image" content="/logo512.png" />
            </Helmet>

            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={toggleDark}
                    className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800
                               text-slate-600 dark:text-slate-300
                               hover:bg-slate-300 dark:hover:bg-slate-700
                               transition-all duration-200 border border-slate-300 dark:border-slate-700"
                    aria-label={
                        isDark ? 'Switch to light mode' : 'Switch to dark mode'
                    }
                >
                    {isDark ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>

            <main className="flex flex-col items-center justify-start min-h-screen py-8 px-4">
                <header className="text-center mb-8 animate-fade-in">
                    <h1 className="heading text-slate-800 dark:text-slate-100">
                        Discord Spoiler
                    </h1>
                    <h1 className="heading text-slate-700 dark:text-slate-200">
                        Text Converter
                    </h1>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        Wrap your text in Discord spoiler tags instantly. Click
                        the preview to reveal!
                    </p>
                </header>

                <WrapText />

                <Footer />
            </main>
        </div>
    );
}

function SunIcon() {
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
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
        </svg>
    );
}

function MoonIcon() {
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
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
        </svg>
    );
}

export default App;
