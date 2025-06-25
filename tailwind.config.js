/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c1e1dc',
        accent: '#a7bed3',
        danger: '#fca5a5',
        dark: '#1f2937'
      },
      boxShadow: {
        glow: '0 0 15px rgba(255,255,255,0.2)',
        'glow-lg': '0 0 25px rgba(255,255,255,0.3)'
      },
      animation: {
        twinkle: 'twinkle 2s infinite ease-in-out',
        pulseSlow: 'pulse 3s infinite',
        orbit: 'orbit 4s linear infinite',
        float: 'float 6s ease-in-out infinite'
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' }
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(20px) rotate(-360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
} 