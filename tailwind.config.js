/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#0d0f14',
        surface: '#13161e',
        surface2: '#1a1e2a',
        border: '#232838',
        accent: '#4f6ef7',
        accent2: '#7c4dff',
        accent3: '#00d4a0',
        accent4: '#f7934c',
        accent5: '#f74f6e',
        text1: '#e8eaf2',
        text2: '#8a90a8',
        text3: '#555c78',
      },
    },
  },
  plugins: [],
}
