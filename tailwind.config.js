/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                discord: {
                    dark: '#36393f',
                    darker: '#2f3136',
                    darkest: '#202225',
                    blurple: '#5865f2',
                    'blurple-dark': '#4752c4',
                    green: '#57f287',
                    yellow: '#fee75c',
                    fuchsia: '#eb459e',
                    red: '#ed4245',
                    text: '#dcddde',
                    'text-muted': '#72767d',
                    spoiler: '#1e1f22',
                },
            },
            fontFamily: {
                discord: [
                    'gg sans',
                    'Noto Sans',
                    'Helvetica Neue',
                    'Helvetica',
                    'Arial',
                    'sans-serif',
                ],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
                'spoiler-reveal': 'spoilerReveal 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseGlow: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(88, 101, 242, 0.2)',
                    },
                    '50%': { boxShadow: '0 0 40px rgba(88, 101, 242, 0.4)' },
                },
                spoilerReveal: {
                    '0%': { filter: 'blur(4px)', opacity: '0.5' },
                    '100%': { filter: 'blur(0)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
