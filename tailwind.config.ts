import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0b",
        panel: "#111114",
        border: "#1f1f24",
        ink: "#e6e6e8",
        mute: "#8a8a93",
        accent: "#7dd3fc"
      }
    }
  },
  plugins: []
};

export default config;
