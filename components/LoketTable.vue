<template>
    <div>
      <!-- Tampilkan Popup untuk menambah data Loket -->
      <div v-if="showLoketPopup" class="popup">
        <form @submit.prevent="submitLoketForm">
          <input v-model="newLoket.no_berkas" placeholder="No Berkas" required />
          <input v-model="newLoket.nama_pemohon" placeholder="Nama Pemohon" required />
          <input v-model="newLoket.jenis_permohonan" placeholder="Jenis Permohonan" required />
          <input v-model="newLoket.no302" placeholder="No 302" required />
          <input v-model="newLoket.tanggal" type="date" required />
          <button type="submit">Simpan</button>
          <button type="button" @click="closeLoketPopup">Tutup</button>
        </form>
      </div>
  
      <!-- Tampilkan Daftar Loket -->
      <table>
        <thead>
          <tr>
            <th>No Berkas</th>
            <th>Nama Pemohon</th>
            <th>Jenis Permohonan</th>
            <th>No 302</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(loket, index) in filteredLoketList" :key="index">
            <td>{{ loket.no_berkas }}</td>
            <td>{{ loket.nama_pemohon }}</td>
            <td>{{ loket.jenis_permohonan }}</td>
            <td>{{ loket.no_302 }}</td>
            <td>{{ loket.tanggal }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="openAddLoketPopup">Tambah Loket</button>
    </div>
  </template>
  
  <script>
  import { createClient } from '@supabase/supabase-js';
  
  export default {
    name: 'LoketTable',
    data() {
      return {
        showLoketPopup: false,
        searchQuery: '',
        loketList: [],  // Data Loket yang diambil dari Supabase
        newLoket: {
          no_berkas: '',
          nama_pemohon: '',
          jenis_permohonan: '',
          no302: '',
          tanggal: ''
        },
        filteredLoketList: []
      };
    },
    methods: {
      openAddLoketPopup() {
        this.showLoketPopup = true;
      },
      closeLoketPopup() {
        this.showLoketPopup = false;
      },
      async submitLoketForm() {
        try {
          const { data, error } = await this.supabase
            .from('loket_sp')  // Nama tabel Supabase
            .insert([
              {
                no_berkas: this.newLoket.no_berkas,
                nama_pemohon: this.newLoket.nama_pemohon,
                jenis_permohonan: this.newLoket.jenis_permohonan,
                no_302: this.newLoket.no302,
                tanggal: this.newLoket.tanggal
              }
            ]);
  
          if (error) {
            console.error('Error inserting data:', error);
            alert('Terjadi kesalahan saat menyimpan data');
          } else {
            // Menambahkan data yang baru ke dalam daftar
            this.loketList.push(data[0]);
            this.filterLoket();  // Mengupdate daftar yang difilter
            this.closeLoketPopup();  // Menutup popup
            this.clearNewLoketForm();  // Mengosongkan form
          }
        } catch (error) {
          console.error('Terjadi kesalahan:', error);
          alert('Terjadi kesalahan saat menyimpan data');
        }
      },
      clearNewLoketForm() {
        this.newLoket = {
          no_berkas: '',
          nama_pemohon: '',
          jenis_permohonan: '',
          no302: '',
          tanggal: ''
        };
      },
      filterLoket() {
        const query = this.searchQuery.toLowerCase();
        this.filteredLoketList = this.loketList.filter(loket => {
          return (
            loket.no_berkas.toLowerCase().includes(query) ||
            loket.nama_pemohon.toLowerCase().includes(query) ||
            loket.jenis_permohonan.toLowerCase().includes(query) ||
            loket.no_302.toLowerCase().includes(query)
          );
        });
      }
    },
    async mounted() {
      // Inisialisasi Supabase
      const supabaseUrl = 'https://xyzcompany.supabase.co'; // Ganti dengan URL Supabase Anda
      const supabaseKey = 'public-anon-key'; // Ganti dengan API key Anda
      this.supabase = createClient(supabaseUrl, supabaseKey);
  
      // Mengambil data dari Supabase
      const { data, error } = await this.supabase
        .from('loket_sp')  // Nama tabel Supabase
        .select('*');
  
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        this.loketList = data;
        this.filterLoket();  // Memfilter data yang diambil
      }
    }
  };
  </script>
  
  <style scoped>
  /* Styling untuk popup dan tabel */
  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }
  </style>
  