import React from 'react';
import WrapText from './WrapText';

function App() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-white dark:bg-slate-900">
            <div className="flex flex-col items-center heading my-8">
                <span>Discord Spoiler</span>
                <span>Text Converter</span>
            </div>
            <WrapText />
        </div>
    );
}

export default App;
