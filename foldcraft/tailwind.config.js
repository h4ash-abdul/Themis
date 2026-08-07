/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Clash Grotesk', 'sans-serif'],
      },
      colors: {
        navy: {
          900: '#021626',
          800: '#113954',
          700: '#1A4D6E',
        },
        accent: {
          orange: '#FE4C1C',
          orangeHover: '#FE7049',
          blue: '#C7D3E2',
          lightBlue: '#BBDEF8',
          lime: '#D6F994',
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
