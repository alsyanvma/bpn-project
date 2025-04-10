<template>
    <div>
      <!-- Navbar -->
      <nav class="navbar">
        <div class="logo">Alih Media</div>
        <ul class="nav-links">
          <li><a href="/alih-media" class="active">Alih Media</a></li>
          <li><a href="/penyelesaian">Penyelesaian</a></li>
        </ul>
      </nav>
  
      <!-- Tombol Tambah di Tengah -->
      <div style="text-align: center; margin: 20px 0;">
        <button class="btn-add" @click="showAddPopup = true">+ Tambah</button>
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
              <tr v-for="(alih_media, index) in filteredData" :key="alih_media.id">
                <td>{{ alih_media.jenis_hak }}</td>
                <td>{{ alih_media.no_sertifikat }}</td>
                <td>{{ alih_media.kecamatan?.nama_kecamatan }}</td>
                <td>{{ alih_media.kelurahan?.nama_kelurahan }}</td>
                <td>{{ alih_media.nama_pemohon }}</td>
                <td>{{ alih_media.petugas_pemetaan }}</td>
                <td>{{ formatDate(alih_media.tanggal_pemetaan) }}</td>
                <td>
                  <button class="btn-edit" @click="openPopup(alih_media)">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Popup Edit -->
      <div v-if="showPopup" class="popup-overlay">
        <div class="popup">
          <h2><strong>Edit Penyelesaian</strong></h2>
          <label><strong>Keterangan</strong></label>
          <input v-model="editItem.keterangan" type="text" />
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
            <option v-for="jenis in jenisHakList" :key="jenis.id" :value="jenis.jenis">{{ jenis.jenis }}</option>
          </select>
  
          <label><strong>No Sertifikat</strong></label>
          <input v-model="newItem.no_sertifikat" type="text" />
  
            <!-- KECAMATAN -->
            <label><strong>Kecamatan</strong></label>
            <select v-model="newItem.kecamatan_id">
            <option disabled value="">Pilih Kecamatan</option>
            <option v-for="kec in kecamatanList" :key="kec.id" :value="kec.id">
                {{ kec.nama_kecamatan }}
            </option>
            </select>


            <!-- KELURAHAN -->
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
          <select v-model="newItem.petugas_pemetaan">
            <option disabled value="">Pilih Petugas</option>
            <option v-for="petugas in petugasList" :key="petugas.id" :value="petugas.nama">{{ petugas.nama }}</option>
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
  
  const alihMediaData = ref([])
  const jenisHakList = ref([])
  const kecamatanList = ref([])
  const kelurahanList = ref([])
  const petugasList = ref([])
  
  const showPopup = ref(false)
  const showAddPopup = ref(false)
  const searchTerm = ref('')
  
  const editItem = ref({})
  const newItem = ref({
    jenis_hak: '',
    no_sertifikat: '',
    kecamatan_id: '',
    kelurahan_id: '',
    nama_pemohon: '',
    petugas_pemetaan: '',
    tanggal_pemetaan: '',
    keterangan: '',
    tanggal_penyelesaian: ''
  })
  
  // Ambil data utama
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('alih_media')
      .select(`
        *,
        kecamatan: kecamatan_id (nama_kecamatan),
        kelurahan: kelurahan_id (nama_kelurahan),
        petugas: petugas_pemetaan (nama)
      `)
    if (!error) alihMediaData.value = data
  }
  
  // Dropdown data
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
  
  // Filter kelurahan berdasarkan kecamatan
  const filteredKelurahan = computed(() => {
    return kelurahanList.value.filter(kel => kel.kecamatan_id === newItem.value.kecamatan_id)
  })
  
  // Open popup edit
  const openPopup = (item) => {
    editItem.value = { ...item }
    showPopup.value = true
  }
  
  // Simpan edit data
  const saveEdit = async () => {
    const { id, keterangan, tanggal_penyelesaian } = editItem.value
    await supabase.from('alih_media').update({ keterangan, tanggal_penyelesaian }).eq('id', id)
    showPopup.value = false
    fetchData()
  }
  
  // Simpan data baru
  // Simpan data baru
const saveNewItem = async () => {
  // Ubah tanggal kosong menjadi null agar tidak error di Supabase
  const cleanItem = {
  jenis_hak: parseInt(newItem.value.jenis_hak) || null,
  no_sertifikat: newItem.value.no_sertifikat,
  kecamatan_id: parseInt(newItem.value.kecamatan_id) || null,
  kelurahan_id: parseInt(newItem.value.kelurahan_id) || null,
  nama_pemohon: newItem.value.nama_pemohon,
  petugas_pemetaan: parseInt(newItem.value.petugas_pemetaan) || null,
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
      petugas_pemetaan: '',
      tanggal_pemetaan: '',
      keterangan: '',
      tanggal_penyelesaian: ''
    }
    fetchData()
  } else {
    console.error('Gagal menyimpan data:', error)
  }
}

  
  // Format tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }
  
  onMounted(() => {
    fetchData()
    fetchDropdownData()
  })
  
  const filteredData = computed(() => {
    if (!searchTerm.value) return alihMediaData.value
    return alihMediaData.value.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    )
  })
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
  
  .container {
    max-width: 100%;
    margin-top: 50px;
    padding: 0 0px;
  }
  
  h1 {
    margin-bottom: 20px;
  }
  
  /* Table */
  .table-container table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background-color: #34495e;
    color: white;
  }
  
  td, th {
    padding: 12px;
    border: 1px solid #ccc;
    text-align: center;
  }
  
  .btn-edit {
    padding: 6px 12px;
    background-color: #3498db;
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
    background-color: #2980b9; /* Warna Simpan */
  }
  
  .popup-actions button:last-child {
    background-color: #e74c3c; /* Warna Batal */
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
  