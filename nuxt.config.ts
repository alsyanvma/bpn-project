export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ['bootstrap/dist/css/bootstrap.min.css'],

  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js',
          defer: true,
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL || '',  // Mendapatkan URL Supabase dari variabel lingkungan
      SUPABASE_KEY: process.env.SUPABASE_KEY || '',  // Mendapatkan Supabase Key dari variabel lingkungan
    },
  },

  plugins: [
    '~/plugins/supabase', // Menambahkan plugin Supabase
  ],
});
