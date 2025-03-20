/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'weather-primary': '#264653',
        'weather-secondary': '#2a9d8f',
        'weather-accent': '#e9c46a',
        'weather-text': '#f1faee',
        'weather-danger': '#e76f51',
      },
      fontFamily: {
        'clock': ['Orbitron', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'weather-fade': 'weatherFade 0.5s ease-in',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        weatherFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    require("daisyui"),
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-morphism': {
          background: 'rgba(255, 255, 255, 0.15)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
        '.glass-morphism-dark': {
          background: 'rgba(0, 0, 0, 0.25)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.2)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
  daisyui: {
    themes: [
      {
        'weather-light': {
          'primary': '#2563eb',
          'secondary': '#0ea5e9',
          'accent': '#f59e0b',
          'neutral': '#3d4451',
          'base-100': '#ffffff',
          'info': '#3abff8',
          'success': '#36d399',
          'warning': '#fbbd23',
          'error': '#f87272',
        },
        'weather-dark': {
          'primary': '#38bdf8',
          'secondary': '#818cf8',
          'accent': '#fbbf24',
          'neutral': '#1e293b',
          'base-100': '#0f172a',
          'info': '#0ea5e9',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444',
        },
      }
    ],
    darkTheme: "weather-dark",
  },
}
