<template>
  <div class="container">
    <!-- Input Pencarian -->
    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Cari..." class="search-input" />
      <input type="date" v-model="searchDate" class="date-input" />
    </div>

    <!-- Tabel (Tetap ada meskipun tidak ada pencarian) -->
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
          <template v-if="searchQuery || searchDate">
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
          </template>
          <tr v-else>
            <td colspan="10" class="no-data">Silakan lakukan pencarian untuk menampilkan data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Edit -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-container large">
        <h2 class="popup-title">Edit Surat</h2>

        <label class="label">No 307:</label>
        <input v-model="editData.no307" class="input" />

        <label class="label">Nama Petugas Pemetaan:</label>
        <select v-model="editData.petugas_pemetaan" class="input">
          <option v-for="petugas_pemetaan in daftarPetugasPemetaan" :key="petugas_pemetaan.id"
            :value="petugas_pemetaan.nama">
            {{ petugas_pemetaan.nama }}
          </option>
        </select>

        <div class="popup-actions">
          <button @click="simpanEdit" class="submit-btn">Simpan</button>
          <button @click="showPopup = false" class="cancel-btn">Batal</button>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '@/plugins/supabase';

const dataPemetaan = ref([]);
const daftarPetugasPemetaan = ref([]);
const showPopup = ref(false);
const searchQuery = ref('');
const searchDate = ref('');
const editData = ref({
  id: null,
  no307: '',
  petugas_pemetaan: null
});

// ✅ **Fetch Data Loket (Pemetaan)**
const fetchPemetaan = async () => {
  const { data, error } = await supabase.from('loket').select('*');
  if (error) {
    console.error('Gagal mengambil data pemetaan:', error.message);
    return;
  }
  dataPemetaan.value = data;
};

// ✅ **Fetch Petugas Pemetaan**
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
    .from('loket')
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
  await fetchPemetaan();
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
      : false;

    const dateMatch = searchDate.value
      ? new Date(item.tanggal).toISOString().split('T')[0] === searchDate.value
      : false;

    return queryMatch || dateMatch;
  });
});

// ✅ **Fetch data saat komponen dimuat**
onMounted(async () => {
  await fetchPetugasPemetaan();
  await fetchPemetaan();
});
</script>



<style scoped lang="css">
/* Styling tetap sama seperti sebelumnya */
.container {
  width: 100%;
  max-width: 100%;
  margin: 20px auto;
  padding: 20px;
}

/* Pencarian */
.search-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.search-input,
.date-input {
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
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Header tabel */
.table th {
  background-color: #a59e98;
  color: white;
  font-weight: bold;
  padding: 12px;
  text-align: center;
}

/* Isi tabel */
.table td {
  background-color: #ecf0f1;
  padding: 12px;
  text-align: center;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

/* Baris genap */
.table tr:nth-child(even) td {
  background-color: #f9f9f9;
}

/* Hover efek */
.table tr:hover td {
  background-color: #dfdbd6;
  cursor: pointer;
}

/* Jika tidak ada data */
.no-data {
  text-align: center;
  padding: 15px;
  font-style: italic;
  color: #a59e98;
  ;
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 100%;
}

/* Popup Actions */
.popup-actions {
  text-align: center;
}

.submit-btn,
.cancel-btn {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  margin: 5px;
}

.submit-btn {
  background-color: #3498db;
  color: white;
  border: none;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
}

.cancel-btn:hover {
  background-color: #c0392b;
}
</style>
