/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./dist/**/*.html",
    "./src/**/*.html",
    "./public/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1FA3D6',    // Azul principal
          accent: '#C62828',     // Rojo acento
          warning: '#F4E300',    // Amarillo seguridad
          base: '#0B0B0B',       // Negro base
          soft: '#F5F5F5',       // Soporte claro
          muted: '#8A8A8A',      // Soporte gris
          deep: '#3A3A3A'        // Soporte oscuro
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 10px 40px -20px rgba(31, 163, 214, 0.25)',
        'card-strong': '0 18px 50px -20px rgba(31, 163, 214, 0.35)',
        'sm-card': '0 2px 8px -1px rgba(0, 0, 0, 0.1)'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite'
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)'
      }
    }
  },
  plugins: []
};
