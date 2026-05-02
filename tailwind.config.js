/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-amber': '#FCD34D',
        'neon-cyan': '#06B6D4',
        'dark-bg': '#0F172A',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(252, 211, 77, 0.3), 0 0 10px rgba(252, 211, 77, 0.1)',
          },
          '50%': {
            boxShadow: '0 0 15px rgba(252, 211, 77, 0.5), 0 0 25px rgba(252, 211, 77, 0.2)',
          },
        },
        'neon-glow': {
          '0%, 100%': {
            textShadow: '0 0 10px rgba(252, 211, 77, 0.5), 0 0 20px rgba(252, 211, 77, 0.3)',
          },
          '50%': {
            textShadow: '0 0 20px rgba(252, 211, 77, 0.8), 0 0 30px rgba(252, 211, 77, 0.5)',
          },
        },
        'float-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'border-glow': {
          '0%, 100%': {
            borderColor: 'rgba(252, 211, 77, 0.3)',
            boxShadow: '0 0 10px rgba(252, 211, 77, 0.2)',
          },
          '50%': {
            borderColor: 'rgba(252, 211, 77, 0.6)',
            boxShadow: '0 0 20px rgba(252, 211, 77, 0.4)',
          },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'neon-glow': 'neon-glow 2s ease-in-out infinite',
        'float-up': 'float-up 0.6s ease-out',
        'slide-in': 'slide-in 0.5s ease-out',
        'border-glow': 'border-glow 2s ease-in-out infinite',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
    },
  },
  plugins: [],
}
