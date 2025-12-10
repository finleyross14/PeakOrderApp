/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primaryRed: "#d62828",
        accentYellow: "#fcbf49"
      }
    }
  },
  plugins: []
};
