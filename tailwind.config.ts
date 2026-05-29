import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        soil: "#6C4E31",
        cocoa: "#4B352A",
        jungle: "#0D5C3F",
        leaf: "#56A35C",
        lime: "#A7D948",
        ocean: "#103D60",
        sky: "#DFF5FF",
        sand: "#F1E5C5",
        ember: "#F28C28"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.1), 0 18px 60px rgba(16,61,96,0.25)",
        tropical: "0 30px 80px rgba(13,92,63,0.24)"
      },
      backgroundImage: {
        "mesh-balu":
          "radial-gradient(circle at 20% 20%, rgba(167,217,72,0.18), transparent 30%), radial-gradient(circle at 80% 15%, rgba(242,140,40,0.18), transparent 26%), radial-gradient(circle at 50% 90%, rgba(16,61,96,0.22), transparent 34%)"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
        marqueeSlow: "marqueeSlow 16s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" }
        },
        marqueeSlow: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
