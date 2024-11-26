/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "oohpoint-primary-1": "#1b0a37",
        "oohpoint-primary-2": "#6F4BA6",
        "oohpoint-primary-3": "#341266",

        "oohpoint-secondary-1": "000000",
        "oohpoint-secondary-2": "000000",
        "oohpoint-secondary-3": "000000",

        "oohpoint-tertiary-1": "#9139A5",
        "oohpoint-tertiary-2": "#B77DC4",
        "oohpoint-tertiary-3": "#752E85",

        "oohpoint-grey-100": "#FFFFFF",
        "oohpoint-grey-200": "#F2F0F5",
        "oohpoint-grey-300": "#B2A6C4",
        "oohpoint-grey-400": "#4F3A6F",
        "oohpoint-grey-500": "#250F45",
        "oohpoint-grey-600": "#06010D",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "design-bg": "url('/bgdesign.webp')",
        "oohpoint-primary": `linear-gradient(0deg, #441886, #441886),
        linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))`,
      },
    },
  },
  plugins: [],
};
