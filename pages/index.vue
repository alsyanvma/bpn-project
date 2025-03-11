<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import { createClient } from '@supabase/supabase-js';

// Registrasi Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement);

// Lazy Load Chart (menghindari error import)
const BarChart = defineAsyncComponent(() => import('vue-chartjs').then(m => m.Bar));
const LineChart = defineAsyncComponent(() => import('vue-chartjs').then(m => m.Line));

// Inisialisasi Supabase
const supabaseUrl = 'https://wkdrasssmmjpchxsgdua.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZHJhc3NzbW1qcGNoeHNnZHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0Njg0NjQsImV4cCI6MjA1NjA0NDQ2NH0.eOZPhW3JchXxrUSBDYCEwuZeDJ9ulrKBJvr75svxHy8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Variabel reaktif untuk grafik statistik
const chartData = ref({
  labels: [],
  datasets: []
});

// Fungsi untuk mengambil data statistik
const fetchStatistics = async () => {
  const { data, error } = await supabase.from('loket').select('*');
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  // Nama kolom di database (pastikan ini sesuai dengan Supabase!)
  const fields = {
    'No Surat': 'no_surat',
    'No Berkas': 'no_berkas',
    'Nama Pemohon': 'nama_pemohon',
    'Jenis Permohonan': 'jenis_permohonan',
    'No 302': 'no302',  // <- Pastikan ini sesuai dengan nama kolom di Supabase
    'Nama Petugas': 'nama_petugas'
  };

  // Inisialisasi data statistik
  const groupedData = Object.fromEntries(Object.keys(fields).map(key => [key, 0]));

  // Loop data dan hitung jumlah entri untuk setiap kategori
  data.forEach(entry => {
    Object.entries(fields).forEach(([label, field]) => {
      if (entry[field] !== null && entry[field] !== undefined) {
        groupedData[label] += 1;
      }
    });
  });

  // Menyiapkan data untuk grafik
  const graphColors = [
    'rgba(54, 162, 235, 0.6)', 
    'rgba(255, 99, 132, 0.6)', 
    'rgba(255, 206, 86, 0.6)', 
    'rgba(75, 192, 192, 0.6)', 
    'rgba(153, 102, 255, 0.6)', 
    'rgba(255, 159, 64, 0.6)'
  ];

  chartData.value = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: 'Jumlah Data',
        data: Object.values(groupedData),
        backgroundColor: graphColors,
        borderColor: graphColors.map(color => color.replace('0.6', '1')),
        borderWidth: 1
      }
    ]
  };
};

onMounted(fetchStatistics);
</script>

<template>
  <div class="container mx-auto p-6">
    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">📊 Grafik Statistik</h2>
    
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h3 class="text-xl font-semibold mb-4 text-center">📈 Grafik Data</h3>
      <BarChart v-if="chartData.labels.length" :data="chartData" class="mb-6"/>
      <LineChart v-if="chartData.labels.length" :data="chartData" />
      <p v-else class="text-gray-500 text-center">Tidak ada data tersedia.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
}
</style>
