const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        half: "50vh",
      },
      colors: {
        lime: colors.lime,
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["disabled"],
    },
  },
  plugins: [],
};
