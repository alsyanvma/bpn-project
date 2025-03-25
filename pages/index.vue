<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import { createClient } from '@supabase/supabase-js';

definePageMeta({
  middleware: 'auth'
});
// 🚀 Cek status login saat halaman dimuat
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    router.push('/login');  // Redirect ke login jika belum masuk
  } else {
    fetchLoket();  // Hanya fetch data jika sudah login
  }
});

definePageMeta({
  middleware: 'auth' // 🔥 Middleware auth agar halaman hanya bisa diakses jika user sudah login
});

// Registrasi Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement);

// Lazy Load Chart
const BarChart = defineAsyncComponent(() => import('vue-chartjs').then(m => m.Bar));
const LineChart = defineAsyncComponent(() => import('vue-chartjs').then(m => m.Line));

// Inisialisasi Supabase
const supabaseUrl = 'https://wkdrasssmmjpchxsgdua.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZHJhc3NzbW1qcGNoeHNnZHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0Njg0NjQsImV4cCI6MjA1NjA0NDQ2NH0.eOZPhW3JchXxrUSBDYCEwuZeDJ9ulrKBJvr75svxHy8';
const supabase = createClient(supabaseUrl, supabaseKey);

const chartData = ref({ labels: [], datasets: [] });

const fetchStatistics = async () => {
  const { data, error } = await supabase.from('loket').select('*');
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  const fields = {
    'No Surat': 'no_surat',
    'No Berkas': 'no_berkas',
    'Nama Pemohon': 'nama_pemohon',
    'Jenis Permohonan': 'jenis_permohonan',
    'No 302': 'no302',
    'Nama Petugas': 'nama_petugas'
  };

  const groupedData = Object.fromEntries(Object.keys(fields).map(key => [key, 0]));
  data.forEach(entry => {
    Object.entries(fields).forEach(([label, field]) => {
      if (entry[field]) groupedData[label] += 1;
    });
  });

  const graphColors = ['#2e4259', '#2e4259', '#2e4259', '#2e4259', '#2e4259', '#2e4259'];

  chartData.value = {
    labels: Object.keys(groupedData),
    datasets: [{
      label: 'Jumlah Data',
      data: Object.values(groupedData),
      backgroundColor: graphColors,
      borderColor: graphColors.map(color => color.replace('0.6', '1')),
      borderWidth: 1
    }]
  };
};

onMounted(fetchStatistics);
</script>

<template>
 <div class="flex flex-col gap-8">
        <div class="bg-gray-50 p-6 rounded-lg shadow-md animate-slideIn">
          <h3 class="text-2xl font-semibold text-center text-gray-700 mb-4">📈 Grafik Batang</h3>
          <BarChart v-if="chartData.labels.length" :data="chartData" class="w-full"/>
          <p v-else class="text-gray-500 text-center">Tidak ada data tersedia.</p>
        </div>

        <div class="bg-gray-50 p-6 rounded-lg shadow-md animate-slideIn delay-200">
          <h3 class="text-2xl font-semibold text-center text-gray-700 mb-4">📉 Grafik Garis</h3>
          <LineChart v-if="chartData.labels.length" :data="chartData" class="w-full"/>
          <p v-else class="text-gray-500 text-center">Tidak ada data tersedia.</p>
        </div>
      </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn {
  animation: fadeIn 1s ease-out;
}

@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slideIn {
  animation: slideIn 0.8s ease-out;
}
</style>
