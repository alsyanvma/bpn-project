<template>
  <div class="surat-table-container">
    <h2>Data Surat</h2>

    <!-- 🔍 Input Pencarian -->
    <div class="search-container">
      <input
        type="text"
        v-model.trim="searchQuery"
        placeholder="Cari Surat..."
        class="search-input"
      />
    </div>

    <!-- 📝 Popup Edit Surat -->
    <div v-if="showSuratPopup" class="popup-overlay" @click="closeSuratPopup">
      <div class="popup-container animate-popup" @click.stop>
        <h3>Edit Surat</h3>
        <form @submit.prevent="submitSuratForm">
          <div class="form-group">
            <label for="loketNoSurat">No Surat:</label>
            <input type="text" id="loketNoSurat" v-model="editData.no_surat" required />
          </div>

          <div class="form-group">
            <label for="loketNamaPetugas">Nama Petugas:</label>
            <input type="text" id="loketNamaPetugas" v-model="editData.nama_petugas" required />
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">Simpan</button>
            <button type="button" class="cancel-btn" @click="closeSuratPopup">Batal</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 📋 Tabel Surat -->
    <div class="table-wrapper">
      <table class="loket-table">
        <thead>
          <tr>
            <th>No Surat</th>
            <th>No Berkas</th>
            <th>Nama Pemohon</th>
            <th>Jenis Permohonan</th>
            <th>No 302</th>
            <th>Tanggal</th>
            <th>Nama Petugas</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(loket, index) in filteredSuratList" :key="index">
            <td>{{ loket.no_surat || '-' }}</td>
            <td>{{ loket.no_berkas }}</td>
            <td>{{ loket.nama_pemohon }}</td>
            <td>{{ loket.jenis_permohonan }}</td>
            <td>{{ loket.no302 || '-' }}</td>
            <td>{{ loket.tanggal }}</td>
            <td>{{ loket.nama_petugas || '-' }}</td>
            <td>
              <button @click="editSurat(loket)" class="edit-btn">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '@/plugins/supabase';

const loketList = ref([]);
const searchQuery = ref('');
const showSuratPopup = ref(false);
const editData = ref({ no_surat: '', nama_petugas: '', no_berkas: '' });

const fetchLoket = async () => {
  try {
    const { data, error } = await supabase.from('loket').select('*');
    if (error) throw error;
    loketList.value = data || [];
  } catch (error) {
    console.error('Error fetching loket:', error);
  }
};
onMounted(fetchLoket);

// 🔍 Filter Pencarian Real-Time
const filteredSuratList = computed(() => {
  return loketList.value.filter(loket => {
    return Object.values(loket).some(val =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

// ✏ Edit Surat (Buka Popup)
const editSurat = (loket) => {
  editData.value = {
    no_surat: loket.no_surat || '',
    nama_petugas: loket.nama_petugas || '',
    no_berkas: loket.no_berkas
  };
  showSuratPopup.value = true;
};

// ❌ Tutup Popup
const closeSuratPopup = () => {
  showSuratPopup.value = false;
};

// ✅ Simpan Perubahan ke Supabase
const submitSuratForm = async () => {
  try {
    const { error } = await supabase
      .from('loket')
      .update({
        no_surat: editData.value.no_surat,
        nama_petugas: editData.value.nama_petugas
      })
      .eq('no_berkas', editData.value.no_berkas);

    if (error) throw error;

    // 🔄 Update tabel tanpa reload
    const index = loketList.value.findIndex(item => item.no_berkas === editData.value.no_berkas);
    if (index !== -1) {
      loketList.value[index].no_surat = editData.value.no_surat;
      loketList.value[index].nama_petugas = editData.value.nama_petugas;
    }

    alert('Data berhasil diperbarui!');
    closeSuratPopup();
  } catch (error) {
    console.error('Error updating data:', error);
    alert('Terjadi kesalahan saat menyimpan data');
  }
};
</script>

<style scoped>
.surat-table-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #2c3e50;
}

/* 🔍 Search Bar */
.search-container {
  text-align: center;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* 📋 Table */
.table-wrapper {
  overflow-x: auto;
}

.loket-table {
  width: 100%;
  border-collapse: collapse;
}

.loket-table th, .loket-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.loket-table th {
  background-color: #e67e22;
  color: white;
}

/* ✏ Tombol Edit */
.edit-btn {
  padding: 6px 12px;
  background-color: #f39c12;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.edit-btn:hover {
  background-color: #e67e22;
}

/* 📝 Popup Edit */
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
}

.popup-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  animation: fadeIn 0.3s ease-in-out;
}

/* ✨ Animasi Popup */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ✅ Tombol Simpan & Batal */
.submit-btn {
  background-color: #27ae60;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #2ecc71;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #c0392b;
}
</style>
