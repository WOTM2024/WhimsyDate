/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./screens/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light_bg: "#D9D9D9",
        light_border: "#4C25A2",
        light_text: "#4C25A2",
        light_button_background: "#4C25A2",
        light_button_text: "#D9D9D9",
      },
    },
  },
  plugins: [],
};
