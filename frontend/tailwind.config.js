/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            // BAUM Theme Colors
            background: '#F7F5F0',
            foreground: '#333333',
            primary: {
                DEFAULT: '#5C6E58',
                foreground: '#FFFFFF',
            },
            secondary: {
                DEFAULT: '#9E8E7E',
                foreground: '#FFFFFF',
            },
            surface: '#FFFFFF',
            border: '#E5E0D8',
            // Keep essential colors
            white: '#FFFFFF',
            black: '#000000',
            transparent: 'transparent',
            current: 'currentColor',
            // Add red for error messages
            red: {
                50: '#fef2f2',
                100: '#fee2e2',
                700: '#b91c1c',
            },
        },
        extend: {
            fontFamily: {
                sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
                serif: ['"Noto Serif JP"', 'serif'],
            },
            borderRadius: {
                'lg': '0.5rem',
                'xl': '0.75rem',
                '2xl': '1rem',
            }
        },
    },
    plugins: [],
}
