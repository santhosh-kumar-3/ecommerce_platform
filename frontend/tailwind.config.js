/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["outfit", "system-ui", "sans-serif"],
        outfit: ["outfit"],
        "outfit-medium": ["outfit-medium"],
        "outfit-bold": ["outfit-bold"],
      },
    },
  },
  plugins: [],
};
