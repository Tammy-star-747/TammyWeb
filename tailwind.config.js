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
