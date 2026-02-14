/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        indianBlue: '#000080',
        saffron: '#FF9933',
        successGreen: '#138808',
        dangerRed: '#DC2626',
        amber: '#F59E0B',
        slateBg: '#F9FAFB',
        borderGray: '#E5E7EB',
      },
      fontFamily: {
        display: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        cardStrong: '0 4px 16px rgba(0, 0, 0, 0.12)',
        button: '0 4px 6px rgba(0, 0, 128, 0.2)',
        mic: '0 6px 20px rgba(255, 153, 51, 0.4)',
        header: '0 2px 8px rgba(0, 0, 0, 0.08)',
        nav: '0 -2px 10px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: 0.8 },
          '70%': { transform: 'scale(1.35)', opacity: 0 },
          '100%': { transform: 'scale(1.6)', opacity: 0 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 1.4s infinite',
        shimmer: 'shimmer 1.5s linear infinite',
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #FF9933 0%, #F59E0B 100%)',
        'gov-gradient': 'linear-gradient(135deg, #000080 0%, #1E40AF 100%)',
        'success-gradient':
          'linear-gradient(135deg, #138808 0%, #16A34A 100%)',
      },
    },
  },
  plugins: [],
}
