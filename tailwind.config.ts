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
        // CMF by Nothing Phone 1 Design System
        cmf: {
          black: "#0A0A0A",
          "gray-900": "#1A1A1A",
          "gray-800": "#2A2A2A",
          "gray-700": "#3A3A3A",
          "gray-600": "#4A4A4A",
          "gray-300": "#CCCCCC",
          white: "#FFFFFF",
          orange: "#FF7A1A",
          green: "#37FF8B",
          "blue-glow": "#00D4FF",
          "purple-glow": "#B947FF",
        },
        // Semantic colors
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
        // Legacy support
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
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      fontFamily: {
        nothing: ["SF Pro Display", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
      },
      backdropBlur: {
        xs: "2px",
        "4xl": "72px",
      },
      boxShadow: {
        "glow-orange": "0 0 32px rgba(255, 122, 26, 0.35)",
        "glow-green": "0 0 32px rgba(55, 255, 139, 0.35)",
        "glow-blue": "0 0 32px rgba(0, 212, 255, 0.35)",
        "glow-purple": "0 0 32px rgba(185, 71, 255, 0.35)",
        "inner-soft": "inset 0 1px 4px rgba(255,255,255,0.06), inset 0 -2px 8px rgba(0,0,0,0.35)",
        "neon-orange": "0 0 5px #FF7A1A, 0 0 10px #FF7A1A, 0 0 15px #FF7A1A",
        "neon-green": "0 0 5px #37FF8B, 0 0 10px #37FF8B, 0 0 15px #37FF8B",
        glass: "0 8px 32px rgba(0, 0, 0, 0.12)",
        "elevation-1": "0 2px 4px rgba(0,0,0,0.1)",
        "elevation-2": "0 4px 8px rgba(0,0,0,0.15)",
        "elevation-3": "0 8px 16px rgba(0,0,0,0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "glow-pulse": "glowPulse 2s infinite",
        "neon-pulse": "neonPulse 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "bounce-gentle": "bounceGentle 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(255, 122, 26, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(255, 122, 26, 0.6)" },
        },
        neonPulse: {
          "0%": { boxShadow: "0 0 5px #FF7A1A, 0 0 10px #FF7A1A" },
          "100%": { boxShadow: "0 0 10px #FF7A1A, 0 0 20px #FF7A1A, 0 0 30px #FF7A1A" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
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
