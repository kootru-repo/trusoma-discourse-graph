import type { Config } from "tailwindcss";

const config: Pick<Config, "content" | "theme" | "plugins"> = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "var(--ink)", 2: "var(--ink-2)" },
        muted: "var(--muted)",
        faint: "var(--faint)",
        line: { DEFAULT: "var(--line)", 2: "var(--line-2)" },
        panel: "var(--panel)",
        canvas: "var(--bg)",
        accent: { DEFAULT: "var(--accent)", soft: "var(--accent-soft)" },
      },
      fontFamily: { sans: "var(--sans)", mono: "var(--mono)" },
    },
  },
};

export default config;
