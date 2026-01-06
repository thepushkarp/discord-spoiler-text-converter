function Footer() {
    return (
        <footer className="mt-auto pt-12 pb-6 text-center animate-fade-in">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                <a
                    href="https://github.com/thepushkarp/discord-spoiler-text-converter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors hover:underline"
                >
                    Discord Spoiler Text Converter
                </a>{' '}
                built with <span className="text-red-500">&#9829;</span> by{' '}
                <a
                    href="https://thepushkarp.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors hover:underline"
                >
                    Pushkar Patel
                </a>
            </p>
        </footer>
    );
}

export default Footer;
