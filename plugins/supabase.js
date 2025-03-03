import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin(nuxtApp => {
  // Mengambil URL dan Key Supabase dari config
  const supabaseUrl = nuxtApp.$config.public.SUPABASE_URL;
  const supabaseKey = nuxtApp.$config.public.SUPABASE_KEY;

  // Mengecek apakah URL dan Key Supabase tersedia
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing!');
    return;
  }

  // Membuat instance Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Menyuntikkan instance Supabase ke dalam aplikasi
  nuxtApp.provide('supabase', supabase);

  // Optional: Log untuk memastikan Supabase telah ter-inject dengan benar
  console.log('Supabase client initialized');
});
