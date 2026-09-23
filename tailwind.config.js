/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12"
        },
        ink: { 900: "#18181b", 700: "#3f3f46", 500: "#71717a", 400: "#a1a1aa" }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"]
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,16,20,.04), 0 4px 16px -4px rgba(16,16,20,.08)",
        card: "0 1px 3px rgba(16,16,20,.06), 0 8px 24px -12px rgba(16,16,20,.12)",
        pop: "0 12px 40px -12px rgba(16,16,20,.25)"
      },
      borderRadius: { xl2: "16px" },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideIn: { from: { opacity: "0", transform: "translateX(-12px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        shake: { "10%,90%": { transform: "translateX(-1px)" }, "20%,80%": { transform: "translateX(2px)" }, "30%,50%,70%": { transform: "translateX(-3px)" }, "40%,60%": { transform: "translateX(3px)" } }
      },
      animation: {
        fadeUp: "fadeUp .35s ease both",
        fadeIn: "fadeIn .25s ease both",
        shake: "shake .5s ease both"
      }
    }
  },
  plugins: []
};
