import React, { useState } from 'react';

const wrapCharsWithBars = (str) =>
    str
        .split('')
        .map((char) => `||${char}||`)
        .join('');
const wrapWordsWithBars = (str) =>
    str
        .split(' ')
        .map((word) => `||${word}||`)
        .join(' ');
const wrapTextWithBars = (str) => `||${str}||`;

function WrapUI() {
    const [inputText, setInputText] = useState('');
    const [wrapType, setWrapType] = useState('char');
    const [outputText, setOutputText] = useState('');

    const handleChange = (e) => {
        setInputText(e.target.value);
    };

    const handleWrapTypeChange = (e) => {
        setWrapType(e.target.value);
    };

    const handleWrap = () => {
        let wrappedText = '';
        switch (wrapType) {
            case 'char':
                wrappedText = wrapCharsWithBars(inputText);
                break;
            case 'word':
                wrappedText = wrapWordsWithBars(inputText);
                break;
            case 'text':
                wrappedText = wrapTextWithBars(inputText);
                break;
            default:
                break;
        }
        setOutputText(wrappedText);
    };

    return (
        <div className="bg-gray-100 p-8 rounded-lg shadow-md w-1/3 space-y-4">
            <input
                type="text"
                value={inputText}
                onChange={handleChange}
                placeholder="Enter your text here..."
                className="w-full p-4 border rounded-md border-gray-300"
            />
            <div className="flex flex-col items-start space-y-4">
                <label className="flex items-center">
                    <input
                        type="radio"
                        value="char"
                        checked={wrapType === 'char'}
                        onChange={handleWrapTypeChange}
                        className="mr-2"
                    />
                    Character
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        value="word"
                        checked={wrapType === 'word'}
                        onChange={handleWrapTypeChange}
                        className="mr-2"
                    />
                    Word
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        value="text"
                        checked={wrapType === 'text'}
                        onChange={handleWrapTypeChange}
                        className="mr-2"
                    />
                    Entire Text
                </label>
            </div>
            <button
                onClick={handleWrap}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 active:bg-blue-800"
            >
                Wrap Text
            </button>
            <div className="border p-4 rounded-md border-gray-300">{outputText}</div>
        </div>
    );
}

export default WrapUI;
