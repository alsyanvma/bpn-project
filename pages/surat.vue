<template>
  <div class="surat-table-container">
    <h2>Data Surat</h2>

    <!-- Tombol Tambah Surat -->
    <button @click="openAddSuratPopup" class="add-btn">Tambah Surat</button>

    <!-- Pencarian Surat -->
    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Cari Surat..." @input="filterSurat" class="search-input" />
    </div>

    <!-- Popup Form untuk Menambah Surat -->
    <div v-if="showSuratPopup" class="popup-overlay" @click="closeSuratPopup">
      <div class="popup-container" @click.stop>
        <h3>{{ editSuratData.value ? 'Edit Surat' : 'Tambah Surat' }}</h3>
        <form @submit.prevent="submitSuratForm">
          <div class="form-group">
            <label for="suratNoSurat">No Surat:</label>
            <input type="text" id="suratNoSurat" v-model="editSuratData.value.no_surat" required />
          </div>

          <div class="form-group">
            <label for="suratNamaPetugas">Nama Petugas:</label>
            <input type="text" id="suratNamaPetugas" v-model="editSuratData.value.nama_petugas" required />
          </div>

          <div class="form-group">
            <label for="suratNoBerkas">No Berkas:</label>
            <input type="text" id="suratNoBerkas" v-model="editSuratData.value.no_berkas" readonly />
          </div>

          <div class="form-group">
            <label for="suratNamaPemohon">Nama Pemohon:</label>
            <input type="text" id="suratNamaPemohon" v-model="editSuratData.value.nama_pemohon" required />
          </div>

          <div class="form-group">
            <label for="suratJenisPermohonan">Jenis Permohonan:</label>
            <input type="text" id="suratJenisPermohonan" v-model="editSuratData.value.jenis_permohonan" required />
          </div>

          <div class="form-group">
            <label for="suratNo302">No 302:</label>
            <input type="number" id="suratNo302" v-model="editSuratData.value.no_302" required />
          </div>

          <div class="form-group">
            <label for="suratTanggal">Tanggal:</label>
            <input type="date" id="suratTanggal" v-model="editSuratData.value.tanggal" required />
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">Simpan</button>
            <button type="button" class="cancel-btn" @click="closeSuratPopup">Batal</button>
          </div>
        </form>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="surat-table">
        <thead>
          <tr>
            <th>No Surat</th>
            <th>No Berkas</th>
            <th>Nama Pemohon</th>
            <th>Jenis Permohonan</th>
            <th>No 302</th>
            <th>Tanggal</th>
            <th>Nama Petugas</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(surat, index) in filteredSuratList" :key="surat.no_surat">
            <td>{{ surat.no_surat }}</td>
            <td>{{ surat.no_berkas }}</td>
            <td>{{ surat.nama_pemohon }}</td>
            <td>{{ surat.jenis_permohonan }}</td>
            <td>{{ surat.no_302 }}</td>
            <td>{{ surat.tanggal }}</td>
            <td>{{ surat.nama_petugas }}</td>
            <td>
              <button @click="editSurat(surat)" class="edit-btn">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabaseClient } from '@supabase/auth-helpers-vue';

const $supabase = useSupabaseClient();
const suratList = ref([]);
const loketList = ref([]);
const newSurat = ref({
  no_berkas: '',
  nama_pemohon: '',
  jenis_permohonan: '',
  no_302: '',
  tanggal: '',
  no_surat: ''
});
const editingSurat = ref(null);

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    const { data: formSuratData } = await $supabase.from('form_surat').select('*');
    suratList.value = formSuratData || [];

    const { data: loketData } = await $supabase.from('loket_sp').select('*');
    loketList.value = loketData || [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function saveSurat() {
  try {
    // Cek apakah no_berkas sudah ada di loket_sp
    let { data: loketExist } = await $supabase
      .from('loket_sp')
      .select('*')
      .eq('no_berkas', newSurat.value.no_berkas);

    let loketId;
    if (loketExist.length === 0) {
      // Simpan ke loket_sp jika belum ada
      const { data: loketData, error: loketError } = await $supabase
        .from('loket_sp')
        .insert([{
          no_berkas: newSurat.value.no_berkas,
          nama_pemohon: newSurat.value.nama_pemohon,
          jenis: newSurat.value.jenis_permohonan,
          no_302: newSurat.value.no_302,
          tanggal: newSurat.value.tanggal
        }])
        .select();
      
      if (loketError) throw loketError;
      loketId = loketData[0].id;
    } else {
      loketId = loketExist[0].id;
    }

    // Simpan ke form_surat
    const { error: suratError } = await $supabase.from('form_surat').insert([{
      no_surat: newSurat.value.no_surat,
      nama_pemohon: newSurat.value.nama_pemohon,
      loket_sp_id: loketId
    }]);

    if (suratError) throw suratError;
    
    alert('Data berhasil disimpan!');
    newSurat.value = { no_berkas: '', nama_pemohon: '', jenis_permohonan: '', no_302: '', tanggal: '', no_surat: '' };
    await fetchData();
  } catch (error) {
    console.error('Error saving surat:', error);
  }
}
</script>
<style scoped>
/* Styling for the component */
.surat-table-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.add-btn {
  display: block;
  width: 180px;
  margin: 20px auto;
  padding: 12px;
  background-color: #e67e22;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

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

.table-wrapper {
  overflow-x: auto;
}

.surat-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.surat-table th,
.surat-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.surat-table th {
  background-color: #f2f2f2;
}

.surat-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.edit-btn {
  background-color: #3498db;
  color: white;
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
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
}

.popup-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.submit-btn,
.cancel-btn {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.submit-btn {
  background-color: #2ecc71;
  color: white;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}
</style>
