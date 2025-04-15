<template>
  <div class="p-4 space-y-10">
    <h1 class="text-xl font-bold text-center">📊 Statistik Jenis Permohonan</h1>

    <h2 class="text-lg font-semibold text-center">LAYANAN RUTIN</h2>
    <div class="custom-layout">
      <div
        v-for="(item, index) in rekapJenis"
        :key="index"
        class="chart-item"
      >
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
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { supabase } from '@/plugins/supabase'
import Chart from 'chart.js/auto'

const rekapJenis = ref([])
const rekapPetugas = ref([])
const rekapPemetaan = ref([])
const chartData = ref([])

onMounted(async () => {
  const { data: loket } = await supabase.from('loket').select('*')

  const jenisMap = {}
  const harianMap = {}
  const petugasMap = {}
  const pemetaanMap = {}

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

  await nextTick()

  // Pie Chart
  rekapJenis.value.forEach((item, index) => {
    if (item.total > 0) {
      const ctx = document.getElementById(`pieChart-${index}`)
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
        backgroundColor: '#fde0dd',
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
  gradPetugas.addColorStop(0, '#000000') // hitam atas
  gradPetugas.addColorStop(1, '#8B0000') // merah gelap bawah

  new Chart(ctxPetugas, {
    type: 'bar',
    data: {
      labels: rekapPetugas.value.map(p => p.nama),
      datasets: [{
        label: 'Jumlah Permohonan',
        data: rekapPetugas.value.map(p => p.jumlah),
        backgroundColor: gradPetugas,
        borderRadius: 6,
        barThickness: 150
      }]
    },
    options: {
      indexAxis: 'x',
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false }
      }
    }
  })

  // Grafik Petugas Pemetaan
  const ctxPemetaan = document.getElementById('chartPemetaan')
  const gradPemetaan = ctxPemetaan.getContext('2d').createLinearGradient(0, 0, 0, 400)
  gradPemetaan.addColorStop(0, '#000000') // hitam atas
  gradPemetaan.addColorStop(1, '#8B0000') // merah gelap bawah

  new Chart(ctxPemetaan, {
    type: 'bar',
    data: {
      labels: rekapPemetaan.value.map(p => p.nama),
      datasets: [{
        label: 'Jumlah Permohonan',
        data: rekapPemetaan.value.map(p => p.jumlah),
        backgroundColor: gradPemetaan,
        borderRadius: 6,
        barThickness: 150
      }]
    },
    options: {
      indexAxis: 'x',
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false }
      }
    }
  })
})
</script>

<style scoped>
.custom-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.chart-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
}

.chart-item:nth-child(1),
.chart-item:nth-child(2) {
  flex: 0 0 45%;
  margin-bottom: 1rem;
}

.chart-item:nth-child(n+3) {
  flex: 0 0 30%;
}
</style>
