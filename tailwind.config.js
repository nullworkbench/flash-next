module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        sp: { max: "559px" },
        tab: { min: "560px", max: "959px" },
        pc: { min: "960px" },
      },
      zIndex: {
        99: 99,
      },
      minWidth: {
        sm: "25%",
        md: "50%",
        lg: "75%",
      },
      backgroundColor: {
        theme: "#e6e7ee",
      },
    },
    fontFamily: {
      jp: [
        "-apple-system",
        "BlinkMacSystemFont",
        "ヒラギノ角ゴシック",
        "Hiragino Sans",
        "YuGothic",
        "Yu Gothic",
        "Source Sans Pro",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "sans-serif",
      ],
      code: ["Courier New", "Courier", "monospace"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
