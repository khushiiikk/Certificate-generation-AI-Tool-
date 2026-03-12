/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        certificate: {
          green: "#2D5A27",
          orange: "#E87D1E",
          dark: "#1A1A1A",
        }
      },
      fontFamily: {
        serif: ['Times New Roman', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
