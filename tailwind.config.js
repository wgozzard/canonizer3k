/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        background: 'rgb(var(--background-start-rgb))',
        foreground: 'rgb(var(--foreground-rgb))',
      },
      fontFamily: {
        'press-start': ['var(--font-press-start)'],
        'orbitron': ['var(--font-orbitron)'],
        'mono': ['Courier Prime', 'monospace'],
      },
      animation: {
        'scan': 'scan-line 4s linear infinite',
        'flicker': 'vhs-flicker 0.3s infinite',
        'pulse': 'neon-pulse 2s infinite',
      },
    },
  },
  plugins: [],
}
