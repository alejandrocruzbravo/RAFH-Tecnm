/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode palette
        primary: {
          light: '#e0f2fe',
          DEFAULT: '#0284c7',
          dark: '#0c4a6e',
        },
        // Dark mode palette (adapting existing colors)
        dark: {
          bg: '#14161A', //1a1a1a
          surface: '#16161A', //2a2a2a
          border: '#3A404B', //3a3a3a
        }
      },
      fontFamily: {
        custom: ['Montserrat', 'sans-serif'],
        audiowide: ['Audiowide', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
