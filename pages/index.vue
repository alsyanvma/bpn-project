<template>
  <div class="flex flex-col gap-12 py-8">
    <!-- Dropdown Pilihan Aplikasi -->
    <div class="flex items-center gap-4 mb-6 px-4">
      <label for="appSelect" class="text-lg font-medium text-gray-600">Pilih Aplikasi:</label>
      <select id="appSelect" v-model="selectedApp" @change="navigateApp"
        class="transition-all duration-300 ease-in-out border border-gray-300 rounded-lg shadow-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400">
        <option value="index">Rutin</option>
        <option value="alih-media">Alih - Media</option>
      </select>
    </div>

    <!-- Judul -->
    <h2 class="text-3xl font-bold text-center text-gray-800">LAYANAN RUTIN</h2>

    <!-- Statistik Pie Chart -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      <div
        v-for="(data, jenis) in chartStatusData"
        :key="jenis"
        class="bg-white p-6 rounded-lg shadow-md animate-slideIn"
      >
        <h4 class="text-center text-xl font-semibold text-gray-700 mb-1">{{ jenis }}</h4>
        <p class="text-center text-sm text-gray-600 mb-2">Total: {{ data.selesai + data.onProgress }}</p>
        <PieChart
          :data="{
            labels: ['Selesai', 'On Progress'],
            datasets: [{
              data: [data.selesai, data.onProgress],
              backgroundColor: ['#22c55e', '#f97316']
            }]
          }"
          class="max-w-[240px] mx-auto"
        />
      </div>
    </div>

    <!-- Tabel Progres Harian -->
    <div class="w-full max-w-5xl mx-auto mt-10 px-4">
      <h3 class="text-2xl font-semibold text-gray-800 mb-4 text-center">Tabel Progres Harian</h3>
      <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <thead class="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th class="px-6 py-3 border-b text-center">Tanggal</th>
            <th class="px-6 py-3 border-b text-center">Selesai</th>
            <th class="px-6 py-3 border-b text-center">Dalam Perkembangan</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in dailyProgress"
            :key="item.tanggal"
            class="hover:bg-gray-50 text-center"
          >
            <td class="px-6 py-3 border-b">{{ item.tanggal }}</td>
            <td class="px-6 py-3 border-b text-green-600 font-semibold">{{ item.selesai }}</td>
            <td class="px-6 py-3 border-b text-orange-500 font-semibold">{{ item.onProgress }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { createClient } from '@supabase/supabase-js';

definePageMeta({ middleware: 'auth' });

const supabase = createClient(
  'https://wkdrasssmmjpchxsgdua.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZHJhc3NzbW1qcGNoeHNnZHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0Njg0NjQsImV4cCI6MjA1NjA0NDQ2NH0.eOZPhW3JchXxrUSBDYCEwuZeDJ9ulrKBJvr75svxHy8'
);

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = defineAsyncComponent(() => import('vue-chartjs').then(m => m.Pie));

const chartStatusData = ref({});
const dailyProgress = ref([]);
const router = useRouter();
const selectedApp = ref('index');

const navigateApp = () => {
  router.push(`/${selectedApp.value}`);
};

onMounted(async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (!session || error) {
    router.push('/login');
    return;
  }
  fetchStatistics();
  fetchDailyTable();
});

const fetchStatistics = async () => {
  const { data, error } = await supabase.from('loket').select('*');
  if (error) {
    console.error('Gagal ambil data:', error);
    return;
  }

  const jenisList = ['PBT', 'Pemecahan', 'Pemisahan', 'Penggabungan', 'Penataan Batas'];
  const result = {};

  jenisList.forEach(jenis => {
    result[jenis] = { selesai: 0, onProgress: 0 };
  });

  data.forEach(item => {
    const jenis = item.jenis_permohonan;
    if (!jenisList.includes(jenis)) return;

    const isSelesai = item.no_surat && item.tgl_selesai && item.petugas_ukur;
    if (isSelesai) {
      result[jenis].selesai += 1;
    } else {
      result[jenis].onProgress += 1;
    }
  });

  chartStatusData.value = result;
};

const fetchDailyTable = async () => {
  const { data, error } = await supabase.from('loket').select('*');
  if (error) {
    console.error('Gagal ambil data harian:', error);
    return;
  }

  const progressMap = {};

  data.forEach(item => {
    const tanggal = item.tanggal
      ? new Date(item.tanggal).toLocaleDateString('id-ID')
      : 'Tidak diketahui';

    if (!progressMap[tanggal]) {
      progressMap[tanggal] = { selesai: 0, onProgress: 0 };
    }

    const isSelesai = item.no_surat && item.tgl_selesai && item.petugas_ukur;
    if (isSelesai) {
      progressMap[tanggal].selesai += 1;
    } else {
      progressMap[tanggal].onProgress += 1;
    }
  });

  // ubah ke array dan urutkan berdasarkan tanggal
  dailyProgress.value = Object.entries(progressMap)
    .map(([tanggal, count]) => ({
      tanggal,
      selesai: count.selesai,
      onProgress: count.onProgress
    }))
    .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
};
</script>

<style scoped>
.animate-slideIn {
  animation: slideIn 0.6s ease forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
