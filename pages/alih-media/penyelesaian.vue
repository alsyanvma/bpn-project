<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar">
      <div class="logo">Alih Media</div>
      <ul class="nav-links">
        <li><a href="/alih-media">Alih Media</a></li>
        <li><a href="/alih-media/penyelesaian" class="active">Penyelesaian</a></li>
      </ul>
    </nav>

    <!-- Pencarian -->
    <div class="search-container">
    <input
        v-model="searchTerm"
        type="text"
        placeholder="Cari data..."
        class="search-input"
    />
    </div>


    <!-- Tabel Data Penyelesaian -->
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
              <th>Keterangan</th>
              <th>Tanggal Penyelesaian</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <!-- Jika belum ada pencarian -->
            <tr v-if="!searchTerm">
              <td colspan="10" style="text-align: center; font-style: italic;">
                Silahkan masukkan kata kunci pencarian
              </td>
            </tr>
            <!-- Jika pencarian tidak menghasilkan data -->
            <tr v-else-if="filteredData.length === 0">
              <td colspan="10" style="text-align: center; font-style: italic;">
                Data tidak tersedia
              </td>
            </tr>
            <!-- Data hasil pencarian -->
            <tr v-for="(item, index) in filteredData" :key="item.id">
              <td>{{ item.jenis_hak }}</td>
              <td>{{ item.no_sertifikat }}</td>
              <td>{{ item.kecamatan?.nama_kecamatan }}</td>
              <td>{{ item.kelurahan?.nama_kelurahan }}</td>
              <td>{{ item.nama_pemohon }}</td>
              <td>{{ item.petugas_pemetaan?.nama }}</td>
              <td>{{ formatDate(item.tanggal_pemetaan) }}</td>
              <td>{{ item.keterangan_relasi?.keterangan || '-' }}</td>
              <td>{{ item.tanggal_penyelesaian ? formatDate(item.tanggal_penyelesaian) : '-' }}</td>
              <td>
                <button class="btn-edit" @click="openPopup(item)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Popup Edit Penyelesaian -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <h2><strong>Edit Penyelesaian</strong></h2>
        
        <!-- Dropdown Keterangan dari Supabase -->
        <label><strong>Keterangan</strong></label>
        <select v-model="editItem.keterangan_id">
        <option disabled value="">Pilih Keterangan</option>
        <option
            v-for="option in keteranganOptions"
            :key="option.id"
            :value="option.id"
        >
            {{ option.keterangan }}
        </option>
        </select>



  
        <label><strong>Tanggal Penyelesaian</strong></label>
        <!-- Jika belum diisi, input tetap kosong -->
        <input v-model="editItem.tanggal_penyelesaian" type="date" placeholder=""/>
  
        <div class="popup-actions">
          <button @click="saveEdit">Simpan</button>
          <button @click="showPopup = false">Batal</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/plugins/supabase'

const alihMediaData = ref([])
const jenisHakList = ref([])
const kecamatanList = ref([])
const kelurahanList = ref([])
const petugasList = ref([])
// Tambahkan referensi untuk opsi keterangan
const keteranganOptions = ref([])

const showPopup = ref(false)
const searchTerm = ref('')

const editItem = ref({})

// Data utama halaman penyelesaian hanya perlu ditampilkan.
// Di halaman ini, user hanya dapat mengedit field keterangan dan tanggal_penyelesaian.
const fetchData = async () => {
    const { data, error } = await supabase
    .from('alih_media')
    .select(`
        *,
        kecamatan: kecamatan_id (id, nama_kecamatan),
        kelurahan: kelurahan_id (id, nama_kelurahan),
        petugas_pemetaan: petugas_pemetaan_id (id, nama),
        keterangan_relasi: keterangan_id (id, keterangan)
    `)

  if (!error) alihMediaData.value = data
  else console.error('Gagal mengambil data:', error)
}

// Ambil data dropdown untuk berbagai field
const fetchDropdownData = async () => {
  const jenisHak = await supabase.from('jenis_hak').select('id, jenis');
  if (!jenisHak.error) jenisHakList.value = jenisHak.data;
  else console.error('Error mengambil data jenis hak:', jenisHak.error);

  const kecamatan = await supabase.from('kecamatan').select('id, nama_kecamatan');
  if (!kecamatan.error) kecamatanList.value = kecamatan.data;
  else console.error('Error mengambil data kecamatan:', kecamatan.error);

  const kelurahan = await supabase.from('kelurahan').select('id, nama_kelurahan, kecamatan_id');
  if (!kelurahan.error) kelurahanList.value = kelurahan.data;
  else console.error('Error mengambil data kelurahan:', kelurahan.error);

  const petugas = await supabase.from('petugas_pemetaan').select('id, nama');
  if (!petugas.error) petugasList.value = petugas.data;
  else console.error('Error mengambil data petugas:', petugas.error);

  // Ambil opsi keterangan dari Supabase
  const keteranganRes = await supabase.from('keterangan_options').select('id, keterangan');
  if (!keteranganRes.error) {
    keteranganOptions.value = keteranganRes.data;
    console.log('Data Keterangan:', keteranganOptions.value); // Log data keterangan
  } else {
    console.error('Error mengambil opsi keterangan:', keteranganRes.error);
  }
}


// Filter pencarian: hanya tampilkan data jika ada kata kunci pencarian
const filteredData = computed(() => {
  if (!searchTerm.value) return []
  return alihMediaData.value.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  )
})

// Membuka popup edit untuk penyelesaian
const openPopup = (item) => {
  editItem.value = {
    id: item.id,
    keterangan_id: item.keterangan_id || '',
    tanggal_penyelesaian: item.tanggal_penyelesaian || ''
  };
  showPopup.value = true;
};


// Simpan edit penyelesaian
const saveEdit = async () => {
  const { id, keterangan_id, tanggal_penyelesaian } = editItem.value
  await supabase.from('alih_media').update({
    keterangan_id,
    tanggal_penyelesaian
  }).eq('id', id)

  showPopup.value = false
  fetchData()
}

onMounted(() => {
  fetchData();
  fetchDropdownData();
  console.log('Data Keterangan:', keteranganOptions.value); // Cek apakah data keterangan muncul di sini
});


// Format tanggal (jika tanggal kosong, kembalikan string kosong)
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const fetchKeteranganData = async () => {
  const { data, error } = await supabase.from('keterangan').select('id, keterangan_text');
  if (!error) {
    keteranganOptions.value = data;
  } else {
    console.error('Gagal mengambil data keterangan:', error);
  }
}


</script>a

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

/* Container */
html, body, .container, .table-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Untuk efek pembatas warna, beri latar belakang dan padding pada container tabel */
.table-container {
  background-color: #ecf0f1;
  padding: 5px;
}

.container {
  max-width: 100%;
  margin-top: 50px;
  padding: 0 0px;
}

/* Table */
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
  border: none;
}

/* Efek zebra striping */
tbody tr:nth-child(odd) {
  background-color: #fff;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Efek hover */
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

.search-container {
  text-align: center;
  margin: 30px 0 20px 0; /* Atas kanan bawah kiri */
}


.search-input {
  padding: 6px 10px;
  font-size: 14px;
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

  .table-container {
    overflow-x: auto;
  }

  .table-container table {
    min-width: 700px;
  }
}
</style>
