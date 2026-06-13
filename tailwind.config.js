/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                winBlue: {
                    light: '#0078d7',
                    dark: '#005a9e',
                },
                winBackground: '#002040',
                winAcrylic: 'rgba(20, 20, 20, 0.65)',
                winAcrylicLight: 'rgba(240, 240, 240, 0.75)',
                winGray: {
                    50: '#f3f2f1',
                    100: '#edebe9',
                    200: '#e1dfdd',
                    300: '#d2d0ce',
                    400: '#c8c6c4',
                    500: '#a19f9d',
                    600: '#605e5c',
                    700: '#323130',
                    800: '#201f1e',
                    900: '#11100f',
                },
                // Tailwind 4.x 兼容：自定義 neutral 調色板
                neutral: {
                    50: '#f9fafb',
                    55: '#f3f2f1',
                    100: '#f3f2f1',
                    150: '#e8e8e8',
                    200: '#e1dfdd',
                    250: '#d2d0ce',
                    255: '#d0ccc9',
                    300: '#d2d0ce',
                    350: '#c8c6c4',
                    400: '#c8c6c4',
                    450: '#a19f9d',
                    500: '#a19f9d',
                    505: '#8c8c8c',
                    520: '#6c6c6c',
                    600: '#605e5c',
                    650: '#555555',
                    700: '#323130',
                    705: '#2f2e2c',
                    750: '#2a2a2a',
                    800: '#201f1e',
                    803: '#1f1e1d',
                    808: '#1a1a1a',
                    850: '#111111',
                    855: '#0f0f0f',
                    900: '#11100f',
                    905: '#0a0a0a',
                    950: '#000000',
                }
            },
            fontFamily: {
                win: ['"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                winWindow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 1px 2px 0 rgba(255, 255, 255, 0.1) inset',
                winStart: '0 12px 40px 0 rgba(0, 0, 0, 0.5)',
            }
        },
    },
    plugins: [],
}
