/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NDMA Government Colors
        'indian-blue': '#000080',
        'govt-blue': '#1E40AF',
        'saffron': '#FF9933',
        'indian-green': '#138808',
        'success-green': '#16A34A',
        'danger-red': '#DC2626',
        'amber': '#F59E0B',
        'gold': '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'page-title': '28px',
        'section-header': '24px',
        'card-title': '20px',
        'button': '18px',
        'body': '16px',
        'small': '14px',
        'micro': '12px',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '10px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-elevated': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'button': '0 4px 6px rgba(0, 0, 128, 0.2)',
        'voice': '0 6px 20px rgba(255, 153, 51, 0.4)',
        'bottom-nav': '0 -2px 10px rgba(0,0,0,0.1)',
        'header': '0 2px 8px rgba(0,0,0,0.08)',
      },
      height: {
        'button': '56px',
        'input': '52px',
        'icon-button': '48px',
        'voice-button': '64px',
        'bottom-nav': '72px',
        'header': '60px',
      },
      spacing: {
        'safe-top': '60px',
        'safe-bottom': '80px',
      },
      animation: {
        'pulse-ring': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

