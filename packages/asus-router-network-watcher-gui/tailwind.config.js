/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'hustle-yellow': '#FFD700',
        'hustle-blue': '#212549F7B912',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

