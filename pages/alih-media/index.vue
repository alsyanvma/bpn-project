<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar">
      <div class="logo">Alih Media</div>
      <ul class="nav-links">
        <li><a href="/alih-media" class="active">Alih Media</a></li>
        <li><a href="/alih-media/penyelesaian">Penyelesaian</a></li>
      </ul>
    </nav>

    <!-- Tombol Tambah di Tengah -->
    <div style="text-align: center; margin: 20px 0;">
      <button class="btn-add" @click="showAddPopup = true">+ Tambah</button>
    </div>

    <div style="margin-left: 20px; margin-top: 20px;">
      <button class="btn-back" @click="goBack">
        ← Kembali ke Rutinn
      </button>
    </div>


    <!-- Pencarian di tengah -->
    <div style="text-align: center; margin-bottom: 10px;">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Cari data..."
        style="padding: 6px 10px; font-size: 14px; width: 250px; border: 1px solid #ccc; border-radius: 5px;"
      />
    </div>

    <!-- Tabel -->
    <div class="container">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Jenis Hak</th>
              <th>No Sertifikat</th>
              <th>Kecamatan</th>
              <th>Kelurahan</th>
              <th>Nama Pemohon</th>
              <th>Petugas Pemetaan</th>
              <th>Tanggal ke Pemetaan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <!-- Jika belum ada pencarian -->
            <tr v-if="!searchTerm">
              <td colspan="8" style="text-align: center; font-style: italic;">
                Silahkan masukkan kata kunci pencarian
              </td>
            </tr>

            <!-- Jika pencarian tidak menghasilkan data -->
            <tr v-else-if="filteredData.length === 0">
              <td colspan="8" style="text-align: center; font-style: italic;">
                Data tidak tersedia
              </td>
            </tr>

            <!-- Data hasil pencarian -->
            <tr v-else v-for="(alih_media, index) in filteredData" :key="alih_media.id">
              <td>{{ alih_media.jenis_hak }}</td>
              <td>{{ alih_media.no_sertifikat }}</td>
              <td>{{ alih_media.kecamatan?.nama_kecamatan }}</td>
              <td>{{ alih_media.kelurahan?.nama_kelurahan }}</td>
              <td>{{ alih_media.nama_pemohon }}</td>
              <td>{{ alih_media.petugas_pemetaan?.nama }}</td>
              <td>{{ formatDate(alih_media.tanggal_pemetaan) }}</td>
              <td>
                <button class="btn-edit" @click="openPopup(alih_media)">Edit</button>
                <button class="btn-delete" @click="deleteItem(alih_media.id)">Hapus</button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

    <!-- Popup Edit -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <h2><strong>Edit Data</strong></h2>
        <label><strong>Jenis Hak</strong></label>
        <select v-model="editItem.jenis_hak">
          <option disabled value="">Pilih Jenis Hak</option>
          <option v-for="jenis in jenisHakList" :key="jenis.id" :value="jenis.jenis">
            {{ jenis.jenis }}
          </option>
        </select>
        <label><strong>No Sertifikat</strong></label>
        <input v-model="editItem.no_sertifikat" type="text" />
        <label><strong>Kecamatan</strong></label>
        <select v-model="editItem.kecamatan_id">
          <option disabled value="">Pilih Kecamatan</option>
          <option v-for="kec in kecamatanList" :key="kec.id" :value="kec.id">
            {{ kec.nama_kecamatan }}
          </option>
        </select>
        <label><strong>Kelurahan</strong></label>
        <select v-model="editItem.kelurahan_id">
          <option disabled value="">Pilih Kelurahan</option>
          <option v-for="kel in kelurahanList.filter(kel => kel.kecamatan_id === editItem.kecamatan_id)" :key="kel.id" :value="kel.id">
            {{ kel.nama_kelurahan }}
          </option>
        </select>
        <label><strong>Nama Pemohon</strong></label>
        <input v-model="editItem.nama_pemohon" type="text" />
        <label><strong>Petugas Pemetaan</strong></label>
        <select v-model="editItem.petugas_pemetaan_id">
          <option disabled value="">Pilih Petugas</option>
          <option v-for="petugas in petugasList" :key="petugas.id" :value="petugas.id">
            {{ petugas.nama }}
          </option>
        </select>
        <label><strong>Tanggal ke Pemetaan</strong></label>
        <input v-model="editItem.tanggal_pemetaan" type="date" />
        <label><strong>Tanggal Penyelesaian</strong></label>
        <input v-model="editItem.tanggal_penyelesaian" type="date" />
        <div class="popup-actions">
          <button @click="saveEdit">Simpan</button>
          <button @click="showPopup = false">Batal</button>
        </div>
      </div>
    </div>

    <!-- Popup Tambah -->
    <div v-if="showAddPopup" class="popup-overlay">
      <div class="popup">
        <h2><strong>Tambah Alih Media</strong></h2>
        <label><strong>Jenis Hak</strong></label>
        <select v-model="newItem.jenis_hak">
          <option disabled value="">Pilih Jenis Hak</option>
          <option v-for="jenis in jenisHakList" :key="jenis.id" :value="jenis.id">
            {{ jenis.jenis }}
          </option>
        </select>
        <label><strong>No Sertifikat</strong></label>
        <input v-model="newItem.no_sertifikat" type="text" />
        <label><strong>Kecamatan</strong></label>
        <select v-model="newItem.kecamatan_id">
          <option disabled value="">Pilih Kecamatan</option>
          <option v-for="kec in kecamatanList" :key="kec.id" :value="kec.id">
            {{ kec.nama_kecamatan }}
          </option>
        </select>
        <label><strong>Kelurahan</strong></label>
        <select v-model="newItem.kelurahan_id">
          <option disabled value="">Pilih Kelurahan</option>
          <option v-for="kel in filteredKelurahan" :key="kel.id" :value="kel.id">
            {{ kel.nama_kelurahan }}
          </option>
        </select>
        <label><strong>Nama Pemohon</strong></label>
        <input v-model="newItem.nama_pemohon" type="text" />
        <label><strong>Petugas Pemetaan</strong></label>
        <select v-model="newItem.petugas_pemetaan_id">
          <option disabled value="">Pilih Petugas</option>
          <option v-for="petugas in petugasList" :key="petugas.id" :value="petugas.id">
            {{ petugas.nama }}
          </option>
        </select>
        <label><strong>Tanggal ke Pemetaan</strong></label>
        <input v-model="newItem.tanggal_pemetaan" type="date" />
        <div class="popup-actions">
          <button @click="saveNewItem">Simpan</button>
          <button @click="showAddPopup = false">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/plugins/supabase'
import { useRouter } from 'vue-router'

const alihMediaData = ref([])
const jenisHakList = ref([])
const kecamatanList = ref([])
const kelurahanList = ref([])
const petugasList = ref([])

const showPopup = ref(false)
const showAddPopup = ref(false)
const searchTerm = ref('')
const router = useRouter()

const goBack = () => {
  router.push('/')
}

const editItem = ref({})
const newItem = ref({
  jenis_hak: '',
  no_sertifikat: '',
  kecamatan_id: '',
  kelurahan_id: '',
  nama_pemohon: '',
  petugas_pemetaan_id: '',
  tanggal_pemetaan: '',
  keterangan: '',
  tanggal_penyelesaian: ''
})

const fetchData = async () => {
  const { data, error } = await supabase
    .from('alih_media')
    .select(`*
      , kecamatan: kecamatan_id (id, nama_kecamatan)
      , kelurahan: kelurahan_id (id, nama_kelurahan)
      , petugas_pemetaan: petugas_pemetaan_id (id, nama)
    `)
  if (!error) alihMediaData.value = data
  else console.error('Gagal mengambil data:', error)
}

const fetchDropdownData = async () => {
  const jenisHak = await supabase.from('jenis_hak').select('id, jenis')
  if (!jenisHak.error) jenisHakList.value = jenisHak.data

  const kecamatan = await supabase.from('kecamatan').select('id, nama_kecamatan')
  if (!kecamatan.error) kecamatanList.value = kecamatan.data

  const kelurahan = await supabase.from('kelurahan').select('id, nama_kelurahan, kecamatan_id')
  if (!kelurahan.error) kelurahanList.value = kelurahan.data

  const petugas = await supabase.from('petugas_pemetaan').select('id, nama')
  if (!petugas.error) petugasList.value = petugas.data
}

const filteredKelurahan = computed(() => {
  return kelurahanList.value.filter(kel => kel.kecamatan_id === newItem.value.kecamatan_id)
})

const openPopup = (item) => {
  editItem.value = {
    id: item.id,
    jenis_hak: item.jenis_hak,
    no_sertifikat: item.no_sertifikat,
    kecamatan_id: item.kecamatan?.id || '',
    kelurahan_id: item.kelurahan?.id || '',
    nama_pemohon: item.nama_pemohon,
    petugas_pemetaan_id: item.petugas_pemetaan?.id || '',
    tanggal_pemetaan: item.tanggal_pemetaan,
    tanggal_penyelesaian: item.tanggal_penyelesaian
  }
  showPopup.value = true
}

const saveEdit = async () => {
  const { id, jenis_hak, no_sertifikat, kecamatan_id, kelurahan_id, nama_pemohon, petugas_pemetaan_id, tanggal_pemetaan, tanggal_penyelesaian } = editItem.value

  await supabase.from('alih_media').update({
    jenis_hak,
    no_sertifikat,
    kecamatan_id: parseInt(kecamatan_id) || null,
    kelurahan_id: parseInt(kelurahan_id) || null,
    nama_pemohon,
    petugas_pemetaan_id: parseInt(petugas_pemetaan_id) || null,
    tanggal_pemetaan,
    tanggal_penyelesaian
  }).eq('id', id)

  showPopup.value = false
  fetchData()
}

const saveNewItem = async () => {
  const selectedJenisHak = jenisHakList.value.find(hak => hak.id == newItem.value.jenis_hak)
  const cleanItem = {
    jenis_hak: selectedJenisHak?.jenis || '',
    no_sertifikat: newItem.value.no_sertifikat,
    kecamatan_id: parseInt(newItem.value.kecamatan_id) || null,
    kelurahan_id: parseInt(newItem.value.kelurahan_id) || null,
    nama_pemohon: newItem.value.nama_pemohon,
    petugas_pemetaan_id: parseInt(newItem.value.petugas_pemetaan_id) || null,
    tanggal_pemetaan: newItem.value.tanggal_pemetaan || null,
    keterangan: newItem.value.keterangan,
    tanggal_penyelesaian: newItem.value.tanggal_penyelesaian || null
  }

  const { error } = await supabase.from('alih_media').insert([cleanItem])
  if (!error) {
    showAddPopup.value = false
    newItem.value = {
      jenis_hak: '',
      no_sertifikat: '',
      kecamatan_id: '',
      kelurahan_id: '',
      nama_pemohon: '',
      petugas_pemetaan_id: '',
      tanggal_pemetaan: '',
      keterangan: '',
      tanggal_penyelesaian: ''
    }
    fetchData()
  } else {
    console.error('Gagal menyimpan data:', error)
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

onMounted(() => {
  fetchData()
  fetchDropdownData()
})

// Filter pencarian
const filteredData = computed(() => {
  if (!searchTerm.value) {
    return alihMediaData.value
  }

  const term = searchTerm.value.toLowerCase()

  return alihMediaData.value.filter(item => {
    return [
      item.jenis_hak,
      item.no_sertifikat,
      item.nama_pemohon,
      item.kecamatan?.nama_kecamatan,
      item.kelurahan?.nama_kelurahan,
      item.petugas_pemetaan?.nama,
      item.tanggal_pemetaan,
      item.tanggal_penyelesaian
    ].some(field => (field || '').toString().toLowerCase().includes(term))
  })
})



// Data belum input petugas
const filteredBelumInput = computed(() => {
  return filteredData.value.filter(item => !item.petugas_pemetaan)
})

// Data sudah input petugas
const filteredSudahInput = computed(() => {
  return filteredData.value.filter(item => item.petugas_pemetaan)
})

const deleteItem = async (id) => {
  const confirmDelete = confirm('Apakah Anda yakin ingin menghapus data ini?')
  if (confirmDelete) {
    const { error } = await supabase.from('alih_media').delete().eq('id', id)
    if (!error) fetchData()
    else console.error('Gagal menghapus data:', error)
  }
}
</script>



<style scoped>
/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  background: #2c3e50;
  padding: 15px 30px;
  color: #fff;
}

.logo {
  font-weight: bold;
  font-size: 20px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
}

.nav-links a.active {
  border-bottom: 2px solid #ecf0f1;
}

/* Tombol Tambah */
.btn-add {
  display: block;
  width: 180px;
  margin: 20px auto;
  padding: 12px;
  background-color: #1b1542;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-add:hover {
  background-color: #370874;
}

/* Container */
html, body, .container, .table-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Untuk efek pembatas warna, kita beri latar belakang pada container tabel */
.table-container {
  background-color: #ecf0f1;
  padding: 5px; /* Jarak di sekitar tabel sebagai "pembatas warna" */
}

/* Styling for the back button with arrow */
.btn-back {
  padding: 8px 20px;
  font-size: 16px;
  background-color: #1b1542;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-back:hover {
  background-color: #4c3c61;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.container {
  max-width: 100%;
  margin-top: 50px;
  padding: 0 0px;
}

h1 {
  margin-bottom: 20px;
}

/* Table */
/* Menggunakan border-collapse: separate + border-spacing untuk membuat jarak antar baris */
.table-container table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 5px;
}

thead {
  background-color: #34495e;
  color: white;
}

td, th {
  padding: 12px;
  text-align: center;
  border: none; /* Hilangkan border sel */
}

/* Tambahan efek zebra striping (opsional) agar baris lebih jelas */
tbody tr:nth-child(odd) {
  background-color: #fff;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Efek hover untuk baris */
tbody tr:hover {
  background-color: #f2f2f2;
}

/* Tombol Edit */
.btn-edit {
  padding: 6px 12px;
  background-color: #e67e22;
  color: white;
  border: none;
  border-radius: 5px;
}

/* Popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 400px;
  max-width: 100%;
}

.popup input,
.popup select {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
}

.popup label {
  display: block;
  margin-bottom: 5px;
}

/* Popup Actions */
.popup-actions {
  display: flex;
  justify-content: space-between;
}

.popup-actions button {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  margin: 0 5px;
}

.popup-actions button:first-child {
  background-color: #2980b9;
}

.popup-actions button:last-child {
  background-color: #e74c3c;
}

/* Responsiveness */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .nav-links {
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }

  .btn-add {
    width: 100%;
    max-width: 250px;
  }

  .popup {
    width: 90%;
    padding: 20px;
  }

  .table-container {
    overflow-x: auto;
  }

  .table-container table {
    min-width: 700px;
  }
}
</style>
