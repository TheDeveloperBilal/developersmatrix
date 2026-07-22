import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Existing CSS variable-based colors (for inner pages / UI components)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Redesign brand palette (for homepage + new header/footer)
        brand: {
          50: "#f5f2ff",
          100: "#ede9fe",
          200: "#ddd4fe",
          300: "#c3b2fd",
          400: "#a587fa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        ink: {
          50: "#f8f9fb",
          100: "#f1f3f7",
          200: "#e4e7ee",
          300: "#cfd5e0",
          400: "#97a1b3",
          500: "#647084",
          600: "#4b5568",
          700: "#3d4557",
          800: "#232a3a",
          900: "#141a26",
          950: "#0b0f18",
        },
      },
      fontFamily: {
        sora: ["var(--font-sora)", "ui-sans-serif", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 26, 38, 0.04), 0 8px 24px -12px rgba(20, 26, 38, 0.12)",
        "card-hover":
          "0 2px 4px rgba(20, 26, 38, 0.05), 0 16px 40px -16px rgba(76, 29, 149, 0.22)",
        menu: "0 4px 6px -2px rgba(20, 26, 38, 0.04), 0 24px 64px -16px rgba(20, 26, 38, 0.18)",
        glow: "0 0 0 1px rgba(124, 58, 237, 0.08), 0 24px 64px -24px rgba(124, 58, 237, 0.35)",
      },
      maxWidth: {
        shell: "84rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "menu-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        marquee: "marquee 42s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "menu-in": "menu-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
