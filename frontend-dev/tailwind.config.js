module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [
    './src/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Raleway', 'Arial', 'sans-serif']
      },

      colors: {
        primary: {
          default: '#FC4141',
          hover: '#c12e2e',
          'inverted-hover': '#ede3e3'
        }
      },

      screens: {
        '2xl': '1440px',
        '3xl': '1690px',
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  variants: {
    borderWidth: ['responsive', 'last'],
  },
  plugins: [],
}
