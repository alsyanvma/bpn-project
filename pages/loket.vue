<template>
  <div class="loket-table-container">
    <!-- Tombol Tambah Loket -->
    <button @click="openLoketPopup" class="add-btn">Tambah Loket</button>
    <!-- Pencarian Loket -->
    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Cari Loket..." @input="filterLoket" class="search-input"/>
    </div>
    <!-- Popup Form untuk Menambah Loket -->
    <div v-if="showLoketPopup" class="popup-overlay" @click="closeLoketPopup">
  <div class="popup-container" @click.stop>
        <h3>Tambah Loket</h3>
        <form @submit.prevent="submitLoketForm">
          <div class="form-group">
            <label for="loketFileNumber">No Berkas:</label>
            <input type="text" id="loketFileNumber" v-model="newLoket.no_berkas" required />
          </div>

          <div class="form-group">
            <label for="loketApplicantName">Nama Pemohon:</label>
            <input type="text" id="loketApplicantName" v-model="newLoket.nama_pemohon" required />
          </div>

          <div class="form-group">
          <label for="loketRequestType">Jenis Permohonan:</label>
          <select id="loketRequestType" v-model="newLoket.jenis_permohonan" required>
            <option value="" disabled>Pilih Jenis Permohonan</option>
            <option v-for="(item, index) in permohonanList" :key="index" :value="item.permohonan">
              {{ item.permohonan }}
            </option>
          </select>
          </div>
          <div class="form-group">
            <label for="loketNo302">No 302:</label>
            <input type="text" id="loketNo302" v-model="newLoket.no302" required />
          </div>

          <div class="form-group">
            <label for="loketDate302">Tanggal:</label>
            <input type="date" id="loketDate302" v-model="newLoket.tanggal" required />
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">Simpan</button>
            <button type="button" class="cancel-btn" @click="closeLoketPopup">Batal</button>
          </div>
        </form>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="loket-table">
        <thead>
          <tr>
            <th>No Berkas</th>
            <th>Nama Pemohon</th>
            <th>Jenis Permohonan</th>
            <th>No 302</th>
            <th>Tanggal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(loket, index) in filteredLoketList" :key="loket.id">
            <td>{{ loket.no_berkas }}</td>
            <td>{{ loket.nama_pemohon }}</td>
            <td>{{ loket.jenis_permohonan }}</td>
            <td>{{ loket.no302 }}</td>
            <td>{{ loket.tanggal }}</td>
            <td>
              <button @click="editLoket(loket)" class="edit-btn">Edit</button>
              <button @click="deleteLoket(loket.id)" class="delete-btn">Hapus</button>
              
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { supabase } from '@/plugins/supabase';

const loketList = ref([]);           
const filteredLoketList = ref([]);   
const searchQuery = ref('');
const showLoketPopup = ref(false);
const showEditPopup = ref(false);
const notification = ref('');

const permohonanList = ref([]); // 🆕 Data dari tabel permohonan

const newLoket = ref({
  id: null,
  no_berkas: '',
  nama_pemohon: '',
  jenis_permohonan: '',  // Akan diambil dari dropdown
  no302: '',
  tanggal: ''
});

const payload = {
  no_berkas: String(newLoket.value.no_berkas || '').trim(),
  nama_pemohon: String(newLoket.value.nama_pemohon || '').trim(),
  jenis_permohonan: String(newLoket.value.jenis_permohonan || '').trim(),
  no302: newLoket.value.no302 ? Number(newLoket.value.no302) : null, // Jika INTEGER, konversi ke angka
  tanggal: newLoket.value.tanggal
};

console.log('Payload:', payload); // Debugging
const { error } = await supabase.from('loket').insert([payload]);
console.log('Supabase error:', error);

// 🚀 Cek status login saat halaman dimuat
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    router.push('/login');  
  } else {
    fetchLoket();
    fetchPermohonan();  // 🆕 Ambil data permohonan saat halaman dimuat
  }
});

definePageMeta({ middleware: 'auth' });

// 🚀 Ambil data loket dari Supabase
const fetchLoket = async () => {
  try {
    const { data, error } = await supabase.from('loket').select('*');
    if (error) throw error;
    loketList.value = data || [];
  } catch (error) {
    console.error('Error fetching loket:', error);
  }
};

// 🚀 Ambil data permohonan dari Supabase
const fetchPermohonan = async () => {
  try {
    const { data, error } = await supabase.from('permohonan').select('permohonan');
    if (error) throw error;
    permohonanList.value = data || [];
  } catch (error) {
    console.error('Error fetching permohonan:', error);
  }
};

// 🔍 Filter Data Loket
const filterLoket = () => {
  const query = searchQuery.value.toLowerCase();
  if (!query) {
    filteredLoketList.value = [];
  } else {
    filteredLoketList.value = loketList.value.filter(item =>
      String(item.no_berkas).toLowerCase().includes(query) ||
      String(item.nama_pemohon).toLowerCase().includes(query) ||
      String(item.jenis_permohonan).toLowerCase().includes(query) ||
      String(item.no302).toLowerCase().includes(query)
    );
  }
};

// Pantau perubahan pada searchQuery
watch(searchQuery, filterLoket);

// 📌 Fungsi Tambah/Edit Data ke Supabase
const submitLoketForm = async () => {
  try {
    if (!newLoket.value.no_berkas || !newLoket.value.nama_pemohon || !newLoket.value.jenis_permohonan || !newLoket.value.no302 || !newLoket.value.tanggal) {
      alert('Harap isi semua field sebelum menyimpan.');
      return;
    }

    const payload = {
      no_berkas: String(newLoket.value.no_berkas || '').trim(),
      nama_pemohon: String(newLoket.value.nama_pemohon || '').trim(),
      jenis_permohonan: String(newLoket.value.jenis_permohonan || '').trim(),
      no302: String(newLoket.value.no302 || '').trim(),
      tanggal: newLoket.value.tanggal
    };

    let error;
    if (newLoket.value.id) {
      ({ error } = await supabase.from('loket').update(payload).eq('id', newLoket.value.id));
      const index = loketList.value.findIndex(loket => loket.id === newLoket.value.id);
      if (index !== -1) {
        loketList.value[index] = { ...newLoket.value };
      }
    } else {
      ({ error } = await supabase.from('loket').insert([payload]));
      await fetchLoket();
    }

    if (error) throw error;

    closeLoketPopup();
    clearNewLoketForm();
    showNotification('Data berhasil disimpan!');
    filterLoket();
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Terjadi kesalahan saat menyimpan data.');
  }
};

// ✅ Fungsi Hapus Data
const deleteLoket = async (id) => {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    try {
      const { error } = await supabase.from('loket').delete().eq('id', id);
      if (error) throw error;

      loketList.value = loketList.value.filter(loket => loket.id !== id);
      filterLoket();
      showNotification('Data berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Terjadi kesalahan saat menghapus data');
    }
  }
};

// 📌 Fungsi Edit Loket
const editLoket = (loket) => {
  newLoket.value = { ...loket };   
  showEditPopup.value = true;
  showLoketPopup.value = true;
};

// 📌 Notifikasi
const showNotification = (message) => {
  notification.value = message;
  setTimeout(() => {
    notification.value = '';
  }, 3000);
};

// 📌 Fungsi Buka & Tutup Popup
const openLoketPopup = () => {
  clearNewLoketForm();
  showEditPopup.value = false;
  showLoketPopup.value = true;
};

const closeLoketPopup = () => {
  showLoketPopup.value = false;
};

// 📌 Reset Form
const clearNewLoketForm = () => {
  newLoket.value = { id: null, no_berkas: '', nama_pemohon: '', jenis_permohonan: '', no302: '', tanggal: '' };
};
</script>



<style scoped>
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
  text-align: center;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
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
.delete-btn{
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

.submit-btn, .cancel-btn {
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

