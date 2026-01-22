/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./dist/**/*.html",
    "./src/**/*.html",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales (derivados del logo)
        'brand': {
          'blue': '#1FA3D6',      // Azul principal - tecnología/industrial
          'red': '#C62828',       // Rojo acento - maquinaria/acción
          'yellow': '#F4E300',    // Amarillo seguridad - señalización
          'black': '#0B0B0B',     // Negro base - estructura/seriedad
        },
        // Colores secundarios (soporte UI)
        'neutral': {
          50: '#F5F5F5',          // Gris claro - fondos, cards
          400: '#8A8A8A',         // Gris medio - textos secundarios
          700: '#3A3A3A',         // Gris oscuro - bordes, divisores
          900: '#0B0B0B',         // Negro - texto principal
        },
        // Aliases semánticos para mejor DX
        'primary': '#1FA3D6',     // Botones primarios, enlaces
        'accent': '#C62828',      // CTAs, estados importantes
        'warning': '#F4E300',     // Indicadores, detalles (no fondos)
      },
      backgroundColor: {
        'base': '#F5F5F5',        // Fondo general del sitio
        'card': '#FFFFFF',        // Fondo de cards/componentes
        'dark': '#0B0B0B',        // Fondos oscuros (footer, header)
      },
      textColor: {
        'primary': '#0B0B0B',     // Texto principal
        'secondary': '#8A8A8A',   // Texto secundario/metadata
        'inverse': '#FFFFFF',     // Texto sobre fondos oscuros
      },
      borderColor: {
        'light': '#F5F5F5',       // Bordes sutiles
        'default': '#8A8A8A',     // Bordes estándar
        'dark': '#3A3A3A',        // Bordes prominentes
      },
    },
  },
  plugins: [],
}
