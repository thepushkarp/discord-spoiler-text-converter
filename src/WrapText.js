import React, { useState } from 'react';

const wrapCharsWithBars = (str) =>
    [...str]
        .map((char) => {
            if (char === ' ') {
                return ' ';
            }
            return `||${char}||`;
        })
        .join('');
const wrapWordsWithBars = (str) =>
    str
        .split(' ')
        .map((word) => `||${word}||`)
        .join(' ');
const wrapTextWithBars = (str) => `||${str}||`;
const options = [
    {
        value: 'char',
        label: 'Character',
        func: wrapCharsWithBars,
    },
    {
        value: 'word',
        label: 'Word',
        func: wrapWordsWithBars,
    },
    {
        value: 'text',
        label: 'Entire Text',
        func: wrapTextWithBars,
    },
];

function WrapText() {
    const [inputText, setInputText] = useState('Aaaaaaaaa!!! Got you 🫵');
    const [wrapType, setWrapType] = useState('char');
    const [outputText, setOutputText] = useState('');

    const handleInputTextChange = (e) => {
        let text = e.target.value;
        text = text.replace(/\s/g, ' ');
        setInputText(text);
    };

    const handleWrapTypeChange = (e) => {
        setWrapType(e.target.value);
    };

    const handleWrap = () => {
        let textToWrap = inputText.trim();
        if (wrapType !== 'text') {
            textToWrap = textToWrap.replace(/\s+/g, ' ');
        }
        let wrappedText = '';
        const option = options.find((option) => option.value === wrapType);
        if (textToWrap && option != null) {
            wrappedText = option.func(textToWrap);
        }
        setOutputText(wrappedText);
    };

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(outputText)
            .then(() => {
                const copySpan = document.getElementById('copy-span');
                const copyButton = document.getElementById('copy-button');
                if (copySpan) {
                    copySpan.textContent = 'Copied!';
                    copyButton.disabled = true;
                    copyButton.classList.add('disabled:bg-green-700');
                    copyButton.classList.remove('disabled:opacity-50');
                    setTimeout(() => {
                        copySpan.textContent = 'Copy to Clipboard';
                        copyButton.disabled = false;
                        copyButton.classList.remove('disabled:bg-green-700');
                        copyButton.classList.add('disabled:opacity-50');
                    }, 500);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-300 p-8 rounded-lg shadow-md w-1/2 space-y-4 flex flex-col content-center items-center">
            <input
                type="text"
                value={inputText}
                onChange={handleInputTextChange}
                placeholder="Enter your text here..."
                className="w-full p-4 border rounded-md border-gray-300 overflow-auto bg-gray-200"
            />
            <div className="flex flex-col items-start w-full">
                Convert by:
                <div className="flex space-x-4">
                    {options.map((option) => (
                        <label key={option.value} className="flex items-center">
                            <input
                                type="radio"
                                value={option.value}
                                checked={wrapType === option.value}
                                onChange={handleWrapTypeChange}
                                className="mr-2"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            </div>
            <button
                onClick={handleWrap}
                className="w-full bg-blue-600 text-white py-2 rounded-md disabled:bg-gray-500 disabled:opacity-50 hover:bg-blue-700 active:bg-blue-800"
                disabled={!inputText}
            >
                Convert to Discord Spoiler Text
            </button>
            <textarea
                value={outputText}
                type="text"
                readOnly
                className="border p-4 w-full h-32 min-h-32 max-h-64 overflow-scroll rounded-md border-gray-300 bg-gray-200"
                disabled
            />
            <button
                onClick={copyToClipboard}
                className="px-3 bg-blue-600 text-white py-2 rounded-md flex flex-row justify-center disabled:bg-gray-500 disabled:opacity-50 hover:bg-blue-700 active:bg-blue-800"
                disabled={!outputText}
                id="copy-button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                    />
                </svg>
                <span id="copy-span">Copy to Clipboard</span>
            </button>
        </div>
    );
}

export default WrapText;
