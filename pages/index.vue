<template>
  <div class="p-4 space-y-10">
    <div class="flex justify-end mb-4">
      <select v-model="selectedApp" @change="navigateApp" class="px-3 py-2 border rounded-lg text-sm shadow">
        <option disabled value="">Pilih Aplikasi</option>
        <option value="rutin">Rutin</option>
        <option value="alih">Alih - Media</option>
      </select>
    </div>

    <h1 class="text-xl font-bold text-center">📊 Statistik</h1>

    <h2 class="text-lg font-semibold text-center">LAYANAN RUTIN</h2>

    <div class="text-center text-sm mt-2 text-gray-600">
      Total permohonan: {{ totalPermohonan }}
    </div>

    <div class="custom-layout">
      <div v-for="(item, index) in rekapJenis" :key="index" class="chart-item">
        <canvas :id="`pieChart-${index}`" width="140" height="140" />
        <div class="text-xs leading-tight text-center mt-1">
          <div class="font-semibold">{{ item.jenis }}</div>
          <div class="text-[11px]">TOTAL: {{ item.total }}</div>
        </div>
      </div>
    </div>

    <h2 class="text-base font-semibold mt-8">📈 Progres Harian</h2>
    <canvas id="chartHarian" height="80" />

    <h2 class="text-base font-semibold mt-8">👷‍♂️ Klasemen Petugas Ukur</h2>
    <canvas id="chartPetugas" height="130" />

    <h2 class="text-base font-semibold mt-8">📍 Klasemen Petugas Pemetaan</h2>
    <canvas id="chartPemetaan" height="130" />

    <h2 class="text-base font-semibold mt-8">📦 Data Alih Media Terkirim</h2>
    <canvas id="chartAlihMedia" height="80" />
  </div>
  <!-- Penyelesaian Layanan Rutin -->
  <h2 class="text-base font-semibold mt-8">📝 Penyelesaian Layanan Rutin</h2>
    <div class="overflow-x-auto">
    <table class="min-w-full mt-4 text-sm shadow rounded-lg overflow-hidden mx-auto w-fit">
      <thead class="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider rounded-t-lg">
        <tr>
          <th class="px-4 py-3 text-left">No Berkas</th>
          <th class="px-4 py-3 text-left">Status</th>
          <th class="px-4 py-3 text-left">Tanggal</th>
          <th class="px-4 py-3 text-left">Tanggal Selesai</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="item in loketSelesai" :key="item.id" class="hover:bg-gray-50">
          <td class="px-4 py-2 whitespace-nowrap">{{ item.no_berkas }}</td>
          <td class="px-4 py-2 text-green-700 font-semibold">Selesai</td>
          <td class="px-4 py-2">{{ item.tanggal }}</td>
          <td class="px-4 py-2">{{ item.tanggal_penyelesaian || '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>


  <!-- Penyelesaian Alih Media -->
  <h2 class="text-base font-semibold mt-8">📦 Penyelesaian Alih Media</h2>
    <div class="overflow-x-auto">
    <table class="min-w-full mt-4 text-sm shadow rounded-lg overflow-hidden mx-auto w-fit">
      <thead class="thead-alih">
        <tr>
          <th class="px-4 py-3 text-left">Jenis Hak</th>
          <th class="px-4 py-3 text-left">No Sertifikat</th>
          <th class="px-4 py-3 text-left">Kecamatan</th>
          <th class="px-4 py-3 text-left">Kelurahan</th>
          <th class="px-4 py-3 text-left">Tanggal</th>
          <th class="px-4 py-3 text-left">Status</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="item in alihMediaSelesai" :key="item.id" class="hover:bg-gray-50">
          <td class="px-4 py-2 whitespace-nowrap">{{ item.jenis_hak }}</td>
          <td class="px-4 py-2">{{ item.no_sertifikat }}</td>
          <td class="px-4 py-2">{{ item.kecamatan.nama_kecamatan }}</td>
          <td class="px-4 py-2">{{ item.kelurahan.nama_kelurahan }}</td>
          <td class="px-4 py-2">{{ item.tanggal_penyelesaian }}</td>
          <td class="px-4 py-2 text-green-700 font-semibold">Selesai</td>
        </tr>
      </tbody>
    </table>
  </div>



</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import Chart from 'chart.js/auto'
import { supabase } from '@/plugins/supabase'

const selectedApp = ref('')
const router = useRouter()
const loketSelesai = ref([])
const alihMediaSelesai = ref([])
const rekapJenis = ref([])
const rekapPetugas = ref([])
const rekapPemetaan = ref([])
const chartData = ref([])
const chartAlihMedia = ref([])

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    router.push('/login') // Kembali ke login kalau belum login
  }
})


const totalPermohonan = computed(() =>
  rekapJenis.value.reduce((sum, j) => sum + j.total, 0)
)

const navigateApp = () => {
  if (selectedApp.value === 'rutin') {
    router.push('/')
  } else if (selectedApp.value === 'alih') {
    router.push('/alih-media')
  }
}

onMounted(async () => {
  // Cek session login
  const { data: { session }, error } = await supabase.auth.getSession()

  if (!session || error) {
    router.push('/login')
    return
  }

  const { data: loket } = await supabase.from('loket').select('*')

  const jenisMap = {}
  const harianMap = {}
  const petugasMap = {}
  const pemetaanMap = {}
  const fetchUser = async () => {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    router.push('/login')
  }
}
const router = useRouter()

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    router.push('/login') // kalau belum login, lempar ke /login
  }
})

  loket.forEach(item => {
    const jenis = item.jenis_permohonan || 'Tidak diketahui'
    const tanggal = item.tanggal?.slice(0, 10)
    const petugas = item.nama_petugas || 'Tidak Diisi'
    const pemetaan = item.petugas_pemetaan || 'Tidak Diisi'
    const isSelesai = Object.values(item).every(v => v !== null && v !== '')

    if (!jenisMap[jenis]) {
      jenisMap[jenis] = { jenis, total: 0, selesai: 0, proses: 0 }
    }
    jenisMap[jenis].total++
    isSelesai ? jenisMap[jenis].selesai++ : jenisMap[jenis].proses++

    if (tanggal) {
      if (!harianMap[tanggal]) harianMap[tanggal] = 0
      harianMap[tanggal]++
    }

    if (!petugasMap[petugas]) petugasMap[petugas] = 0
    petugasMap[petugas]++

    if (!pemetaanMap[pemetaan]) pemetaanMap[pemetaan] = 0
    pemetaanMap[pemetaan]++
  })

  rekapJenis.value = Object.values(jenisMap)
  rekapPetugas.value = Object.entries(petugasMap).map(([nama, jumlah]) => ({ nama, jumlah }))
  rekapPemetaan.value = Object.entries(pemetaanMap).map(([nama, jumlah]) => ({ nama, jumlah }))
  chartData.value = Object.entries(harianMap).map(([tanggal, jumlah]) => ({ tanggal, jumlah }))

  // Ambil data alih media
  const { data: alihMedia } = await supabase
    .from('alih_media')
    .select(`
      *,
      kecamatan: kecamatan_id ( nama_kecamatan ),
      kelurahan: kelurahan_id ( nama_kelurahan )
    `)

  // Hitung chart alih media per tanggal
  const alihMediaMap = {}
  alihMedia.forEach(item => {
    const tanggal = item.tanggal_penyelesaian?.slice(0, 10)
    if (tanggal) {
      if (!alihMediaMap[tanggal]) alihMediaMap[tanggal] = 0
      alihMediaMap[tanggal]++
    }
  })
  chartAlihMedia.value = Object.entries(alihMediaMap).map(([tanggal, jumlah]) => ({ tanggal, jumlah }))

  // Filter data selesai
  loketSelesai.value = loket.filter(item =>
    Object.values(item).every(v => v !== null && v !== '')
  )

  alihMediaSelesai.value = alihMedia.filter(item =>
    item.jenis_hak &&
    item.no_sertifikat &&
    item.kecamatan?.nama_kecamatan &&
    item.kelurahan?.nama_kelurahan &&
    item.tanggal_penyelesaian
  )

  await nextTick()

  // Pie chart per jenis permohonan
  rekapJenis.value.forEach((item, index) => {
    const ctx = document.getElementById(`pieChart-${index}`)
    if (item.total > 0 && ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Selesai', 'Dalam Proses'],
          datasets: [{
            data: [item.selesai, item.proses],
            backgroundColor: ['#1E90FF', '#8B0000'],
            borderColor: '#fff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: false,
          plugins: { legend: { display: false } }
        }
      })
    }
  })

  // Grafik Harian
  const ctxHarian = document.getElementById('chartHarian')
  new Chart(ctxHarian, {
    type: 'line',
    data: {
      labels: chartData.value.map(d => d.tanggal),
      datasets: [{
        label: 'Jumlah Permohonan per Hari',
        data: chartData.value.map(d => d.jumlah),
        borderColor: '#cc3300',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  })

  // Grafik Petugas Ukur
  const ctxPetugas = document.getElementById('chartPetugas')
  const gradPetugas = ctxPetugas.getContext('2d').createLinearGradient(0, 0, 0, 400)
  gradPetugas.addColorStop(0, '#000000')
  gradPetugas.addColorStop(1, '#8B0000')

  new Chart(ctxPetugas, {
    type: 'bar',
    data: {
      labels: rekapPetugas.value.map(p => p.nama),
      datasets: [{
        label: 'Jumlah Permohonan',
        data: rekapPetugas.value.map(p => p.jumlah),
        backgroundColor: gradPetugas,
        borderRadius: 6,
        barThickness: 100
      }]
    },
    options: {
      indexAxis: 'x',
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { display: false } }
    }
  })
  definePageMeta({
  middleware: 'auth'
})


  // Grafik Petugas Pemetaan
  const ctxPemetaan = document.getElementById('chartPemetaan')
  const gradPemetaan = ctxPemetaan.getContext('2d').createLinearGradient(0, 0, 0, 400)
  gradPemetaan.addColorStop(0, '#000000')
  gradPemetaan.addColorStop(1, '#8B0000')

  new Chart(ctxPemetaan, {
    type: 'bar',
    data: {
      labels: rekapPemetaan.value.map(p => p.nama),
      datasets: [{
        label: 'Jumlah Permohonan',
        data: rekapPemetaan.value.map(p => p.jumlah),
        backgroundColor: gradPemetaan,
        borderRadius: 6,
        barThickness: 100
      }]
    },
    options: {
      indexAxis: 'x',
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { display: false } }
    }
  })

  // Grafik Garis Alih Media
  const ctxAlihMedia = document.getElementById('chartAlihMedia')
  new Chart(ctxAlihMedia, {
    type: 'line',
    data: {
      labels: chartAlihMedia.value.map(d => d.tanggal),
      datasets: [{
        label: 'Jumlah Data Terkirim',
        data: chartAlihMedia.value.map(d => d.jumlah),
        borderColor: '#FFA500',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
})
</script>


<style scoped>
.thead-alih {
  background: #ff0909; /* biru gelap */
  color: rgb(0, 0, 0);
}

table {
  border-collapse: collapse;
  width: 100%;
  border: 2px solid #000;
  font-size: 1rem; /* Tambahan ukuran font */
}

th, td {
  border: 1px solid #000;
  padding: 12px 16px; /* Tambah padding untuk ruang lebih */
  text-align: left;
  font-size: 1rem; /* Ukuran font di dalam sel */
}

thead {
  font-size: 1rem;
}

@media (min-width: 768px) {
  table {
    width: 90%; /* agar lebih lebar dari w-fit */
    margin: 0 auto;
  }
}


/* Tetap pertahankan gaya zebra untuk kenyamanan baca */
tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

tbody tr:hover {
  background-color: #f1f5f9;
}

/* Untuk header */
thead {
  background-color: #ec4300;
  color: #000;
}

.thead-alih {
  background-color: #ff0909;
  color: #000;
}



.custom-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.chart-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.chart-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.15);
}

.chart-item:nth-child(1),
.chart-item:nth-child(2) {
  flex: 0 0 45%;
  margin-bottom: 1rem;
}

.chart-item:nth-child(n+3) {
  flex: 0 0 30%;
}

h1 {
  font-size: 1.75rem;
  color: #8B0000;
  text-shadow: 1px 1px 1px #ccc;
}

h2 {
  text-align: center;
  color: #333;
  margin-top: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 4px;
}

canvas {
  border-radius: 10px;
}
</style>
