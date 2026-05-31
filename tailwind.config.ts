import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        bg2: "var(--bg2)",
        bg3: "var(--bg3)",
        bg4: "var(--bg4)",
        text: "var(--text)",
        dim: "var(--dim)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        border: "var(--border)",
      },
      borderRadius: {
        card: "var(--radius)",
      },
      spacing: {
        gap: "var(--gap)",
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
