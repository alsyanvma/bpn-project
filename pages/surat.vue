<template>
  <div class="surat-table-container">
    <div class="search-container">
  <div class="search-wrapper">
    <input
      type="text"
      v-model.trim="searchQuery"
      placeholder="Cari Surat..."
      class="search-input"
    />
    <div class="date-wrapper">
      <input
        type="date"
        v-model="searchDate"
        class="date-input"
      />
        </div>
      </div>
    </div>
    <div v-if="showSuratPopup" class="popup-overlay" @click="closeSuratPopup">
      <div class="popup-container animate-popup" @click.stop>
        <h3>Edit Surat</h3>
        <form @submit.prevent="submitSuratForm">
          <div class="form-group">
            <label for="loketNoSurat">No Surat:</label>
            <input type="text" id="loketNoSurat" v-model="editData.no_surat" required />
          </div>
          
          <label for="namaPetugas">Nama Petugas:</label>
          <select v-model="editData.nama_petugas">
            <option value=""> Pilih Petugas </option>
            <option v-for="petugas in petugasList" :key="petugas.id" :value="petugas.id">
              {{ petugas.nama }}
            </option>
          </select>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn">Simpan</button>
            <button type="button" class="cancel-btn" @click="closeSuratPopup">Batal</button>
          </div>
        </form>
      </div>
    </div>

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
          <tr v-if="searchPerformed && filteredSuratList.length === 0">
            <td colspan="8" class="no-data">Data tidak ada</td>
          </tr>
          <tr v-for="(loket, index) in filteredSuratList" :key="index">
            <td>{{ loket.no_surat || '-' }}</td>
            <td>{{ loket.no_berkas || '-' }}</td>
            <td>{{ loket.nama_pemohon || '-' }}</td>
            <td>{{ loket.jenis_permohonan || '-' }}</td>
            <td>{{ loket.no302 || '-' }}</td>
            <td>{{ loket.tanggal || '-' }}</td>
            <td>{{ getNamaPetugas(loket.nama_petugas) || '-' }}</td>
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
import { ref, onMounted, computed, nextTick } from 'vue';
import { supabase } from '@/plugins/supabase';

const loketList = ref([]);
const petugasList = ref([]);
const searchQuery = ref('');
const searchDate = ref('');
const showSuratPopup = ref(false);
const editData = ref({ no_surat: '', nama_petugas: '', no_berkas: '' });
const searchPerformed = ref(false);

definePageMeta({
  middleware: 'auth'
});

const fetchLoket = async () => {
  try {
    const { data, error } = await supabase.from('loket').select('*');
    if (error) throw error;
    loketList.value = data || [];
    await nextTick();
  } catch (error) {
    console.error('Error fetching loket:', error);
  }
};

const fetchPetugas = async () => {
  try {
    const { data, error } = await supabase.from('petugas').select('id, nama');
    if (error) throw error;
    petugasList.value = data || [];
  } catch (error) {
    console.error('Error fetching petugas:', error);
  }
};

const getNamaPetugas = (idPetugas) => {
  const petugas = petugasList.value.find(p => p.id == idPetugas);
  return petugas ? petugas.nama : 'Tidak Ditemukan';
};

onMounted(async () => {
  await fetchPetugas();
  await fetchLoket();
});

const filteredSuratList = computed(() => {
  if (!searchQuery.value.trim() && !searchDate.value) return [];
  searchPerformed.value = true;

  const query = searchQuery.value.toLowerCase();
  return loketList.value.filter(loket => {
    return (
      (loket.no_surat && String(loket.no_surat).toLowerCase().includes(query)) ||
      (loket.no_berkas && String(loket.no_berkas).toLowerCase().includes(query)) ||
      (loket.nama_pemohon && String(loket.nama_pemohon).toLowerCase().includes(query)) ||
      (loket.jenis_permohonan && String(loket.jenis_permohonan).toLowerCase().includes(query)) ||
      (loket.no302 && String(loket.no302).toLowerCase().includes(query)) ||
      (loket.tanggal && String(loket.tanggal).toLowerCase().includes(query)) ||
      (loket.nama_petugas && String(getNamaPetugas(loket.nama_petugas)).toLowerCase().includes(query)) ||
      (searchDate.value && loket.tanggal === searchDate.value)
    );
  });
});

const editSurat = (loket) => {
  editData.value = {
    no_surat: loket.no_surat || '',
    nama_petugas: loket.nama_petugas || '',
    no_berkas: loket.no_berkas
  };
  showSuratPopup.value = true;
};

const closeSuratPopup = () => {
  showSuratPopup.value = false;
};

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

    // **Cari Index Data di loketList dan Update Langsung**
    const index = loketList.value.findIndex(loket => loket.no_berkas === editData.value.no_berkas);
    if (index !== -1) {
      loketList.value[index].no_surat = editData.value.no_surat;
      loketList.value[index].nama_petugas = editData.value.nama_petugas;
    }

    // **Pastikan UI memperbarui tampilan setelah data diperbarui**
    await nextTick();

    alert('Data berhasil diperbarui!');
    closeSuratPopup();
  } catch (error) {
    console.error('Error updating data:', error);
    alert('Terjadi kesalahan saat menyimpan data');
  }
};
</script>
<style scoped>
.no-data {
  text-align: center;
  font-size: 16px;
  color: #888;
  margin-top: 10px;
}

.date-input {
  padding: 10px;
  margin-left: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.surat-table-container {
  width: 100%;
  padding: 20px;
}

.search-container {
  text-align: center;
  margin-bottom: 30px;
}

.search-input {
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.table-wrapper {
  overflow-x: auto;
}

/* ============================= */
/*  Hapus garis tabel dan buat lebih rapi  */
/* ============================= */
.loket-table {
  width: 100%;
  border-collapse: separate; /* Ubah dari collapse ke separate */
  border-spacing: 0; /* Hapus jarak antar sel */
}

/* Hapus border di th dan td */
.loket-table th, .loket-table td {
  padding: 12px; /* Tambahkan padding agar lebih rapi */
  text-align: left;
  border: none; /* Hapus garis pembatas */
}

/* Warna background header */
.loket-table th {
  background-color: #a59e98;
  color: white;
  font-weight: bold;
}

/* Warna alternatif untuk baris */
.loket-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.loket-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

/* Efek hover untuk interaktif */
.loket-table tr:hover td {
  background-color: #dfdbd6;
  cursor: pointer;
}

/* ============================= */
/*  Desain tombol edit lebih menarik  */
/* ============================= */
.edit-btn {
  padding: 8px 14px;
  background-color: #f39c12;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
}

.edit-btn:hover {
  background-color: #e67e22;
  transform: scale(1.05);
}

/* ============================= */
/*  Popup Form Edit Nama Petugas  */
/* ============================= */
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
  border-radius: 10px;
  width: 450px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.popup-container h3 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

/* ============================= */
/*  Desain tombol di popup lebih menarik  */
/* ============================= */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-btn, .cancel-btn {
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
  width: 48%;
}

.submit-btn {
  background-color: #28a745;
  color: white;
  border: none;
}

.submit-btn:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
  border: none;
}

.cancel-btn:hover {
  background-color: #c82333;
  transform: scale(1.05);
}

/* Animasi munculnya popup */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

</style>
