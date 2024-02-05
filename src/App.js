import React from 'react';
import { Helmet } from 'react-helmet';
import WrapText from './WrapText';

function App() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-white dark:bg-slate-900">
            <Helmet>
                <title>Discord Spoiler Text Converter</title>
                <meta
                    name="description"
                    content="Convert your text to Discord Spoiler Text in an instant"
                />
                <meta
                    property="og:title"
                    content="Discord Spoiler Text Converter"
                />
                <meta
                    property="og:description"
                    content="Convert your text to Discord Spoiler Text in an instant"
                />
                <meta property="og:image" content="/public/logo512.png" />
                <meta
                    name="twitter:title"
                    content="Discord Spoiler Text Converter"
                />
                <meta
                    name="twitter:description"
                    content="Convert your text to Discord Spoiler Text in an instant"
                />
                <meta name="twitter:image" content="/public/logo512.png" />
                <meta name="twitter:card" content="/public/logo512.png" />
            </Helmet>
            <div className="flex flex-col items-center heading my-8">
                <span>Discord Spoiler</span>
                <span>Text Converter</span>
            </div>
            <WrapText />
        </div>
    );
}

export default App;
