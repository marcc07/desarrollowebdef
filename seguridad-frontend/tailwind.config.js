/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Usar la clase `dark` en el elemento raíz
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Evitar conflictos con Bootstrap
  corePlugins: {
    preflight: false, // Desactivar reset de Tailwind para no interferir con Bootstrap
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3c72',
          light: '#2a5298',
        },
        secondary: {
          DEFAULT: '#f39c12',
          dark: '#e67e22',
        },
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out',
        'slide-up': 'slide-up 1s ease-out',
        'slide-in-left': 'slide-in-left 0.8s ease-out',
        'slide-in-right': 'slide-in-right 0.8s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

