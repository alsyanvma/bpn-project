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
            <th>Nama Petugas Ukur</th>
            <th>Nama Petugas Pemetaan</th>
            <th>No 302</th>
            <th>Tanggal Berkas</th>
            <th>Tanggal di Serahkan ke Pemetaan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
        <template v-if="searchQuery || searchDate">
          <tr v-for="loket in filteredData" :key="loket.id">
            <td :class="{ kosong: !loket.no_surat }">{{ loket.no_surat || 'Kosong' }}</td>
            <td :class="{ kosong: !loket.no_berkas }">{{ loket.no_berkas || 'Kosong' }}</td>
            <td :class="{ kosong: !loket.nama_pemohon }">{{ loket.nama_pemohon || 'Kosong' }}</td>
            <td :class="{ kosong: !loket.jenis_permohonan }">{{ loket.jenis_permohonan || 'Kosong' }}</td>
            <td :class="{ kosong: !loket.nama_petugas }">{{ loket.nama_petugas || 'Kosong' }}</td>
            <td :class="{ kosong: !loket.petugas_pemetaan }">{{ loket.petugas_pemetaan || 'Kosong' }}</td>
            <td :class="{ kosong: !loket.no302 }">{{ loket.no302 || 'Kosong' }}</td>
            <td :class="{ kosong: !loket.tanggal }">
              {{ loket.tanggal ? formatTanggal(loket.tanggal) : 'Kosong' }}
            </td>
            <td :class="{ kosong: !loket.tanggalp }">
              {{ loket.tanggalp ? formatTanggal(loket.tanggalp) : 'Kosong' }}
            </td>
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
        <h2 class="popup-title">Edit Pemetaan</h2>

        <div class="form-group">
          <label class="label">Tanggal di Serahkan ke Pemetaan:</label>
          <input type="date" v-model="editData.tanggalp" class="date-input-field" />
        </div>

        <div class="form-group">
          <label class="label">Nama Petugas Pemetaan:</label>
          <select v-model="editData.petugas_pemetaan" class="select-input">
            <option value="">Pilih Petugas</option>
            <option
              v-for="petugas in daftarPetugasPemetaan"
              :key="petugas.id"
              :value="petugas.nama"
            >
              {{ petugas.nama }}
            </option>
          </select>
        </div>

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

// ✅ **Fetch Data Loket (Pemetaan)**
const fetchPemetaan = async () => {
  const { data, error } = await supabase.from('loket').select('*');
  if (error) {
    console.error('Gagal mengambil data pemetaan:', error.message);
    return;
  }
  console.log('Data Loket:', data); // Tambahkan ini untuk debug
  dataPemetaan.value = data;
};

const formatTanggal = (tanggal) => {
  const bulanSingkat = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const dateObj = new Date(tanggal);
  const hari = dateObj.getDate();
  const bulan = bulanSingkat[dateObj.getMonth()];
  const tahun = dateObj.getFullYear();
  return `${hari} ${bulan} ${tahun}`;
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

const editData = ref({
  id: null,
  tanggalp: '',
  petugas_pemetaan: null
});


// ✅ **Fungsi Edit Item**
const editItem = (item) => {
  editData.value = {
  id: item.id,
  tanggalp: item.tanggalp || '',
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
      tanggalp: editData.value.tanggalp,
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
  const query = searchQuery.value.toLowerCase().trim();
  const date = searchDate.value;

  return dataPemetaan.value.filter((item) => {
    // Ambil semua field, pastikan dijadikan string dengan fallback
    const fields = [
      item.no_surat ?? '',
      item.no_berkas ?? '',
      item.nama_pemohon ?? '',
      item.jenis_permohonan ?? '',
      item.nama_petugas ?? '',
      item.petugas_pemetaan ?? '',
      item.no302 ?? '',
    ];

    const combined = fields.map(val => val.toString().toLowerCase()).join(' ');

    const matchQuery = query ? combined.includes(query) : true;

    const matchDate = date
      ? item.tanggal && new Date(item.tanggal).toISOString().split('T')[0] === date
      : true;

    return matchQuery && matchDate;
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

.kosong {
  background-color: #fff3cd; /* kuning muda */
  color: #d8000c; /* merah */
  font-weight: bold;
}


.select-input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 18px;
}

.date-input-field {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  color: #333;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
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
