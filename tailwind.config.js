/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {
      colors: {
        'custom-purple': {
          50: '#F7F6FD', 
          100: '#EEEEFB',
          200: '#D5D4F5',
          300: '#BCB9EF',
          400: '#8a85e4',
          500: '#5851d8',
          600: '#4F49C2',
          700: '#353182',
          800: '#282461',
          900: '#1A1841'
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'questrial': ['Questrial', 'sans-serif'],
        'tahoma': ['Tahoma', 'sans-serif']
      }
    }
  },
  plugins: [],
}
