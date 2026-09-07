import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          900: "#111827",
          800: "#1f2937",
          700: "#374151",
          600: "#4b5563",
        },
        text: {
          100: "#f3f4f6",
          70: "#9ca3af",
          50: "#6b7280",
        },
        accent: "#facf9e",
        border: "#ffffff15",
      },
      borderRadius: {
        card: "16px",
      },
      keyframes: {
        ticker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        ticker: "ticker 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
