<template>
  <div class="surat-table-container">
    <div class="search-container">
      <div class="search-wrapper">
        <input type="text" v-model.trim="searchQuery" placeholder="Cari Surat..." class="search-input" />
        <div class="date-wrapper">
          <input type="date" v-model="searchDate" class="date-input" />
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

          <div class="form-group">
          <label for="namaPetugas">Pilih Petugas:</label>
          <select id="namaPetugas" v-model="editData.nama_petugas" class="select-input">
            <option value="">Pilih Petugas</option>
            <option v-for="petugas in petugasList" :key="petugas.id" :value="petugas.nama">
              {{ petugas.nama }}
            </option>
          </select>
        </div>

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
            <th>Nama Petugas</th>
            <th>No 302</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <!-- Jika belum melakukan pencarian -->
          <tr v-if="!searchPerformed">
            <td colspan="8" style="text-align: center; padding: 20px; color: #777; ">
              Silakan lakukan pencarian untuk menampilkan data
            </td>
          </tr>
          <!-- Jika pencarian sudah dilakukan tapi tidak ada data yang cocok -->
          <tr v-else-if="filteredSuratList.length === 0">
            <td colspan="8" style="text-align: center; padding: 20px; color: #777;">
              Tidak ada data tersedia
            </td>
          </tr>
          <!-- Menampilkan data jika ada hasil pencarian -->
          <tr v-for="(loket, index) in filteredSuratList" :key="index">
            <td :class="{ 'empty-cell': !loket.no_surat }">{{ loket.no_surat || 'Kosong' }}</td>
            <td :class="{ 'empty-cell': !loket.no_berkas }">{{ loket.no_berkas || 'Kosong' }}</td>
            <td :class="{ 'empty-cell': !loket.nama_pemohon }">{{ loket.nama_pemohon || 'Kosong' }}</td>
            <td :class="{ 'empty-cell': !loket.jenis_permohonan }">{{ loket.jenis_permohonan || 'Kosong' }}</td>
            <td :class="{ 'empty-cell': !loket.nama_petugas }">{{ loket.nama_petugas || 'Kosong' }}</td>
            <td :class="{ 'empty-cell': !loket.no302 }">{{ loket.no302 || 'Kosong' }}</td>
            <td :class="{ 'empty-cell': !loket.tanggal }">{{ formatTanggal(loket.tanggal) }}</td>


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
const petugasList = ref([]);
const searchQuery = ref('');
const searchDate = ref('');
const showSuratPopup = ref(false);
const editData = ref({ no_surat: '', nama_petugas: '', no_berkas: '' });
const searchPerformed = ref(false);

const formatTanggal = (tanggalStr) => {
  if (!tanggalStr) return 'Kosong';
  const date = new Date(tanggalStr);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
};


const fetchLoket = async () => {
  try {
    const { data, error } = await supabase.from('loket').select('*');
    if (error) throw error;
    loketList.value = data || [];
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

onMounted(async () => {
  await fetchPetugas();
  await fetchLoket();
});
const filteredSuratList = computed(() => {
  if (!searchQuery.value.trim() && !searchDate.value) {
    searchPerformed.value = false;
    return [];
  }
  searchPerformed.value = true;

  const query = searchQuery.value.toLowerCase();

  return loketList.value.filter(loket => {
    const tanggalFormatted = loket.tanggal
      ? new Date(loket.tanggal).toISOString().split('T')[0]
      : '';

    const matchesText =
      (loket.no_surat && String(loket.no_surat).toLowerCase().includes(query)) ||
      (loket.no_berkas && String(loket.no_berkas).toLowerCase().includes(query)) ||
      (loket.nama_pemohon && String(loket.nama_pemohon).toLowerCase().includes(query)) ||
      (loket.jenis_permohonan && String(loket.jenis_permohonan).toLowerCase().includes(query)) ||
      (loket.no302 && String(loket.no302).toLowerCase().includes(query)) ||
      (loket.nama_petugas && loket.nama_petugas.toLowerCase().includes(query));

    const matchesDate = searchDate.value
      ? tanggalFormatted === searchDate.value
      : true;

    return matchesText && matchesDate;
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
    console.log('Data yang akan diperbarui:', editData.value);

    // Pastikan yang disimpan adalah nama petugas, bukan ID
    const { error } = await supabase
      .from('loket')
      .update({
        no_surat: editData.value.no_surat,
        nama_petugas: editData.value.nama_petugas // Simpan sebagai teks
      })
      .eq('no_berkas', editData.value.no_berkas);

    if (error) throw error;

    console.log('Update berhasil!');
    alert('Data berhasil diperbarui!');
    closeSuratPopup();
    await fetchLoket(); // Refresh data setelah update
  } catch (error) {
    console.error('Error updating data:', error);
    alert(`Terjadi kesalahan: ${error.message}`);
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

.empty-cell {
  color: #ff0000;
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

.empty-cell {
  font-weight: bold;
  text-align: center;
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

.surat-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.surat-table th,
.surat-table td {
  padding: 12px 15px;
  text-align: left;
}

.surat-table th {
  background-color: #a59e98;
  color: white;
  font-weight: bold;
}

.surat-table td {
  background-color: #ccc;
}

.surat-table tr:nth-child(even) td {
  background-color: #ccc;
}

.surat-table tr:hover td {
  background-color: #dfdbd6;
  cursor: pointer;
}

.surat-table td {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #dac4c4;
}


.table-wrapper {
  overflow-x: auto;
}

.loket-table-container {
  width: 100%;
  margin: 0;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  font-family: 'Roboto', sans-serif;
}

.add-btn {
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

.add-btn:hover {
  background-color: #370874;
}

.search-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.surat-table-container {
  width: 100%;
  padding: 20px;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.search-wrapper {
  display: flex;
  gap: 10px;
}

.search-input,
.date-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.extra-input {
  margin-top: 8px;
  padding: 8px;
  width: 300px;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

.table-wrapper {
  overflow-x: auto;
}

.loket-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.loket-table th,
.loket-table td {
  padding: 12px 15px;
  text-align: left;
}

.loket-table th {
  background-color: #a59e98;
  color: white;
  font-weight: bold;
}

.loket-table td {
  background-color: #ecf0f1;
}

.loket-table tr:nth-child(even) td {
  background-color: #f9f9f9;
}

.loket-table tr:hover td {
  background-color: #dfdbd6;
  cursor: pointer;
}

.loket-table td {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.edit-btn {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #fcb62c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn {
  background-color: #f53621;
  color: white;
}

.edit-btn:hover {
  background-color: #e67e22;
}

/* Popup Styling */
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

.popup-container h3 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.form-actions {
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
