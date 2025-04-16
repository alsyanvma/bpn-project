<template>
    <div class="container">
      <!-- Pencarian -->
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
                <th>No 307</th>
                <th>Tanggal Berkas</th>
                <th>Tanggal Pemetaan</th>
                <th>Tanggal Penyelesaian</th>
                <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
            <template v-if="searchQuery || searchDate">
            <tr v-for="item in filteredData" :key="item.id">
              <td :class="{ 'empty-cell': !item.no_surat }">{{ item.no_surat || 'Kosong' }}</td>
              <td :class="{ 'empty-cell': !item.no_berkas }">{{ item.no_berkas || 'Kosong' }}</td>
              <td :class="{ 'empty-cell': !item.nama_pemohon }">{{ item.nama_pemohon || 'Kosong' }}</td>
              <td :class="{ 'empty-cell': !item.jenis_permohonan }">{{ item.jenis_permohonan || 'Kosong' }}</td>
              <td :class="{ 'empty-cell': !item.nama_petugas }">{{ item.nama_petugas || 'Kosong' }}</td>
              <td :class="{ 'empty-cell': !item.petugas_pemetaan }">{{ item.petugas_pemetaan || 'Kosong' }}</td>
              <td :class="{ 'empty-cell': !item.no302 }">{{ item.no302 || 'Kosong' }}</td>
              <td :class="{ 'empty-cell': !item.no307 }">{{ item.no307 || 'Kosong' }}</td>
              <td :class="{ 'empty-cell': !item.tanggal }">
                {{ formatTanggalSingkat(item.tanggal) }}
              </td>
              <td :class="{ 'empty-cell': !item.tanggalp }">
                {{ formatTanggalSingkat(item.tanggalp) }}
              </td>
              <td :class="{ 'empty-cell': !item.tanggal_penyelesaian }">
                {{ formatTanggalSingkat(item.tanggal_penyelesaian) }}
              </td>



                <td>
                <button class="btn-edit" @click="editItem(item)">Edit</button>
                </td>
            </tr>
            <tr v-if="filteredData.length === 0">
                <td colspan="12" class="no-data">Tidak ada data tersedia</td>
            </tr>
            </template>
            <tr v-else>
            <td colspan="12" class="no-data">Silakan lakukan pencarian untuk menampilkan data</td>
            </tr>
        </tbody>
        </table>
      </div>
  
      <!-- Popup Edit -->
      <div v-if="showPopup" class="popup-overlay">
        <div class="popup-container large">
          <h2 class="popup-title">Edit Penyelesaian Produk</h2>
  
          <div class="form-group">
            <label class="label">No 307:</label>
            <input type="text" v-model="editData.no307" class="input-field" />
          </div>
  
          <div class="form-group">
            <label class="label">Tanggal Penyelesaian:</label>
            <input type="date" v-model="editData.tanggal_penyelesaian" class="input-field" />
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
  
  const dataPenyelesaian = ref([]);
  const searchQuery = ref('');
  const searchDate = ref('');
  const showPopup = ref(false);
  
  const editData = ref({
    id: null,
    no307: '',
    tanggal_penyelesaian: ''
  });
  
  const formatTanggalSingkat = (tanggal) => {
  if (!tanggal) return 'Kosong';
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(tanggal).toLocaleDateString('id-ID', options);
};


  // Ambil data dari Supabase
  const fetchPenyelesaian = async () => {
    const { data, error } = await supabase.from('loket').select('*');
    if (error) {
      console.error('Gagal mengambil data:', error.message);
      return;
    }
    dataPenyelesaian.value = data;
  };
  
  // Filter data berdasarkan input
  const filteredData = computed(() => {
  return dataPenyelesaian.value.filter((item) => {
    const query = searchQuery.value.toLowerCase();
    const tanggalLoket = item.tanggal ? new Date(item.tanggal).toISOString().split('T')[0] : '';
    const tanggalp = item.tanggalp ? new Date(item.tanggalp).toISOString().split('T')[0] : '';
    const tanggalPenyelesaian = item.tanggal_penyelesaian ? new Date(item.tanggal_penyelesaian).toISOString().split('T')[0] : '';

    // Cek semua kolom teks
    const matchQuery = !searchQuery.value || [
      item.no_surat,
      item.no_berkas,
      item.nama_pemohon,
      item.jenis_permohonan,
      item.no302,
      item.nama_petugas,
      item.petugas_pemetaan,
      item.no307
    ].some(field =>
      (field || '').toString().toLowerCase().includes(query)
    );

    // Cek semua kolom tanggal
    const matchDate =
      !searchDate.value ||
      tanggalLoket === searchDate.value ||
      tanggalp === searchDate.value ||
      tanggalPenyelesaian === searchDate.value;

    return matchQuery && matchDate;
  });
});

  
  // Buka Popup Edit
  const editItem = (item) => {
    editData.value = {
      id: item.id,
      no307: item.no307 || '',
      tanggal_penyelesaian: item.tanggal_penyelesaian || ''
    };
    showPopup.value = true;
  };
  
  // Simpan hasil edit
  const simpanEdit = async () => {
    const { id, no307, tanggal_penyelesaian } = editData.value;
  
    const { error } = await supabase
      .from('loket')
      .update({ no307, tanggal_penyelesaian })
      .match({ id });
  
    if (error) {
      console.error('Gagal menyimpan:', error.message);
      return;
    }
  
    showPopup.value = false;
    await fetchPenyelesaian();
  };
  
  onMounted(() => {
    fetchPenyelesaian();
  });
  </script>
  
  <style scoped lang="css">
  /* Style sesuai file sebelumnya */
  .container {
    width: 100%;
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
  }
  
  .input-field {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  color: #333;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  color: #333;
  box-sizing: border-box;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}


.search-input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  color: #333;
}

.empty-cell {
  font-weight: bold;
  color: #ff0000;
}

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
  
  .table th {
    background-color: #a59e98;
    color: white;
    font-weight: bold;
    padding: 12px;
    text-align: center;
  }
  
  .table td {
    background-color: #ecf0f1;
    padding: 12px;
    text-align: center;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  
  .table tr:nth-child(even) td {
    background-color: #f9f9f9;
  }
  
  .table tr:hover td {
    background-color: #dfdbd6;
    cursor: pointer;
  }
  
  .no-data {
    text-align: center;
    padding: 15px;
    font-style: italic;
    color: #a59e98;
  }
  
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
    width: 400px;
    max-width: 100%;
  }
  
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
  