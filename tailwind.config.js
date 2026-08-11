/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cepsa: {
          clay: "#B17F59",
          clayHover: "#986743",
          clayLight: "#F0E8E1",
          clayBorder: "#E5D7CD",
          dark: "#0B0B0B",
          slateDark: "#171717",
          cream: "#F8F5F0",
          sand: "#F0EAE1",
          gold: "#B17F59"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Outfit"', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
