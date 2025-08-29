import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic via CSS vars
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // CMF accents (Phone 1)
        "nothing-orange": "#FF7A1A",
        "nothing-green": "#37FF8B",
        "glass-bg": "rgba(255, 255, 255, 0.06)",
        "glass-border": "rgba(255, 255, 255, 0.12)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
      },
      fontFamily: {
        nothing: ["SF Pro Display", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-orange": "0 0 24px rgba(255, 122, 26, 0.45)",
        "glow-green": "0 0 24px rgba(55, 255, 139, 0.45)",
        "inner-soft": "inset 0 1px 4px rgba(255,255,255,0.06), inset 0 -2px 8px rgba(0,0,0,0.35)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.35s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "glow-pulse": "glowPulse 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 6px rgba(255, 122, 26, 0.35)" },
          "50%": { boxShadow: "0 0 22px rgba(255, 122, 26, 0.6)" },
        },
      },
    },
  },
  plugins: [
    function (api: { addUtilities: (utils: Record<string, any>) => void }) {
      const { addUtilities } = api
      addUtilities({
        ".bg-glass": {
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        },
      });
    },
  ],
  darkMode: ["class"],
};

export default config;
