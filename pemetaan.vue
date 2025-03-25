<template>
  <div class="container">
    <!-- Input Pencarian -->
    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Cari..." class="search-input" />
      <input type="date" v-model="searchDate" class="date-input" />
    </div>

    <!-- Tabel -->
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>No Surat</th>
            <th>No Berkas</th>
            <th>Nama Pemohon</th>
            <th>Jenis Permohonan</th>
            <th>No 302</th>
            <th>Nama Petugas Ukur</th>
            <th>No 307</th>
            <th>Nama Petugas Pemetaan</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="loket in filteredData" :key="loket.id">
            <td>{{ loket.no_surat || '-' }}</td>
            <td>{{ loket.no_berkas || '-' }}</td>
            <td>{{ loket.nama_pemohon }}</td>
            <td>{{ loket.jenis_permohonan }}</td>
            <td>{{ loket.no302 || '-' }}</td>
            <td>{{ loket.nama_petugas || '-' }}</td>
            <td>{{ loket.no307 || '-' }}</td>
            <td>{{ loket.petugas_pemetaan || 'Tidak Ditemukan' }}</td>
            <td>{{ loket.tanggal || '-' }}</td>
            <td>
              <button @click="editItem(loket)" class="btn-edit">Edit</button>
            </td>
          </tr>
          <tr v-if="filteredData.length === 0">
            <td colspan="10" class="no-data">Tidak ada data tersedia</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Edit -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h2 class="popup-title">Edit Pemetaan</h2>
        
        <label class="label">No 307</label>
        <input v-model="editData.no307" class="input" />

        <select v-model="editData.petugas_pemetaan" class="input">
          <option v-for="petugas_pemetaan in daftarPetugasPemetaan" :key="petugas_pemetaan.id" :value="petugas_pemetaan.nama">
            {{ petugas_pemetaan.nama }}
          </option>
        </select>

        <div class="popup-actions">
          <button @click="showPopup = false" class="btn-cancel">Batal</button>
          <button @click="simpanEdit" class="btn-save">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '@/plugins/supabase';

const dataPemetaan = ref([]);
const daftarPetugas = ref([]);
const daftarPetugasPemetaan = ref([]);
const showPopup = ref(false);
const searchQuery = ref('');
const searchDate = ref('');
const editData = ref({
  id: null,
  no307: '',
  petugas_pemetaan: null
});

// ✅ **Fungsi Fetch Data Loket (Pemetaan)**
const fetchPemetaan = async () => {
  const { data, error } = await supabase.from('loket').select('*');
  if (error) {
    console.error('Gagal mengambil data pemetaan:', error.message);
    return;
  }
  dataPemetaan.value = data;
};

// ✅ **Fungsi Fetch Petugas**
const fetchPetugas = async () => {
  const { data, error } = await supabase.from('petugas').select('id, nama');
  if (error) {
    console.error('Error fetching petugas:', error.message);
  } else {
    daftarPetugas.value = data;
    console.log('Daftar Petugas:', daftarPetugas.value);
  }
};

// ✅ **Fungsi Fetch Petugas Pemetaan**
const fetchPetugasPemetaan = async () => {
  const { data, error } = await supabase.from('petugas_pemetaan').select('*');
  if (error) {
    console.error('Gagal mengambil data petugas:', error.message);
    return;
  }
  daftarPetugasPemetaan.value = data;
};

// ✅ **Fungsi Edit Item**
const editItem = (item) => {
  editData.value = {
    id: item.id,
    no307: item.no307 || '',
    petugas_pemetaan: item.petugas_pemetaan || null
  };
  showPopup.value = true;
};

// ✅ **Fungsi Simpan Edit**
const simpanEdit = async () => {
  if (!editData.value.id) {
    console.error('Tidak ada data yang diedit.');
    return;
  }

  const { error } = await supabase
    .from('loket') // Sesuaikan dengan tabel utama
    .update({
      no307: editData.value.no307,
      petugas_pemetaan: editData.value.petugas_pemetaan
    })
    .match({ id: editData.value.id });

  if (error) {
    console.error('Gagal menyimpan data:', error.message);
    return;
  }

  showPopup.value = false;
  await fetchPemetaan(); // ✅ Refresh data setelah update
};

// ✅ **Fungsi Filter Data Pemetaan**
const filteredData = computed(() => {
  return dataPemetaan.value.filter((item) => {
    const query = searchQuery.value.toLowerCase();
    const queryMatch = query
      ? (String(item.nama_pemohon) || '').toLowerCase().includes(query) ||
        (String(item.jenis_permohonan) || '').toLowerCase().includes(query) ||
        (String(item.no_surat) || '').toLowerCase().includes(query) ||
        (String(item.no_berkas) || '').toLowerCase().includes(query)
      : true;

    const dateMatch = searchDate.value
      ? new Date(item.tanggal).toISOString().split('T')[0] === searchDate.value
      : true;

    return queryMatch && dateMatch;
  });
});

// ✅ **Fetch data saat komponen dimuat**
onMounted(async () => {
  await fetchPetugas();
  await fetchPetugasPemetaan();
  await fetchPemetaan(); // 🔥 Tambahkan ini agar tidak error
});
</script>




<style scoped lang="css">
/* Pastikan CSS ada di sini */


  /* Styling tetap sama seperti sebelumnya */
  .container {
    width: 100%;
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  /* Pencarian */
  .search-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .search-input, .date-input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
  
  /* Tabel */
  .table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  .table th,
  .table td {
    padding: 12px;
    text-align: center;
    border: none;
  }
  
  .table th {
    background-color: #a59e98;
    color: white;
    font-weight: bold;
  }
  
  .table td {
    background-color: #f9f9f9;
  }
  
  /* Jika tidak ada data */
  .no-data {
    text-align: center;
    padding: 15px;
    font-style: italic;
    color: #888;
  }
  
  /* Tombol Edit */
  .btn-edit {
    background-color: #f39c12;
    color: white;
    padding: 8px 15px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .btn-edit:hover {
    background-color: #e67e22;
  }
  
  /* Popup */
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popup-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 350px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  /* Popup Actions */
  .popup-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .btn-cancel {
    background-color: #95a5a6;
  }
  
  .btn-save {
    background-color: #2ecc71;
  }
  </style>
  