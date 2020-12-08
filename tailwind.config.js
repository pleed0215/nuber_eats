const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/{*.ts, *.tsx}", "./public/index.html"],
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
    extend: {},
  },
  plugins: [],
};
