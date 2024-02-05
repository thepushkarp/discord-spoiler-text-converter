import React from 'react';

const Footer = () => {
    return (
        <footer className="dark:text-white text-black text-center p-4 mt-auto bottom-0 w-full">
            <p>
                <a
                    href="https://github.com/thepushkarp/discord-spoiler-text-converter"
                    noreferrer="true"
                    noopener="true"
                    target="blank"
                    className="text-blue-600 dark:text-blue-300 hover:underline"
                >
                    Discord Spoiler Text Converter
                </a>{' '}
                built with ❤️ by{' '}
                <a
                    href="https://thepushkarp.com/"
                    noreferrer="true"
                    noopener="true"
                    target="blank"
                    className="text-blue-600 dark:text-blue-300 hover:underline"
                >
                    Pushkar Patel
                </a>
            </p>
        </footer>
    );
};

export default Footer;
