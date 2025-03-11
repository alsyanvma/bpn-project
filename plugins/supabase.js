import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wkdrasssmmjpchxsgdua.supabase.co'; // Ganti dengan URL Supabase Anda
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZHJhc3NzbW1qcGNoeHNnZHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0Njg0NjQsImV4cCI6MjA1NjA0NDQ2NH0.eOZPhW3JchXxrUSBDYCEwuZeDJ9ulrKBJvr75svxHy8'; // Ganti dengan kunci Anon Anda

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase; // ✅ Pastikan ekspor sebagai default