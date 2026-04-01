/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['"Cinzel"', '"Copperplate Gothic Light"', 'Copperplate', 'serif'],
        sans:   ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        game: {
          bg:           '#010B2E',
          bgMid:        '#040E40',
          panel:        '#020D38',
          panelLight:   '#071850',
          border:       '#00AAFF',
          borderBright: '#00CCFF',
          borderDim:    '#0055AA',
          gold:         '#FFD700',
          goldDim:      '#C9A800',
          cyan:         '#00CCFF',
          cyanDim:      '#0088CC',
          correct:      '#00E676',
          wrong:        '#FF1744',
          orange:       '#FF8C00',
          orangeBright: '#FFA500',
          text:         '#FFFFFF',
          textDim:      '#8AADCC',
          safetyNet:    '#FFD700',
        },
      },
      keyframes: {
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(255, 140, 0, 0.6)' },
          '50%':      { boxShadow: '0 0 24px 8px rgba(255, 140, 0, 0.9)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        floatIn: {
          '0%':   { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-8px)' },
          '40%':      { transform: 'translateX(8px)' },
          '60%':      { transform: 'translateX(-6px)' },
          '80%':      { transform: 'translateX(6px)' },
        },
        ladder_highlight: {
          '0%':   { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        pulse_glow:       'pulse_glow 1.2s ease-in-out infinite',
        shimmer:          'shimmer 2s linear infinite',
        floatIn:          'floatIn 0.5s ease-out forwards',
        scaleIn:          'scaleIn 0.4s ease-out forwards',
        shake:            'shake 0.5s ease-in-out',
        ladder_highlight: 'ladder_highlight 3s linear infinite',
      },
    },
  },
  plugins: [],
};
