<template>
    <div class="container">
      <div class="header">
        <h1 class="title">Daftar Loket Surat</h1>
        <button @click="toggleForm" class="btn add-button">Tambah Loket</button>
      </div>
  
      <!-- Form Tambah Loket -->
      <div v-if="isFormVisible" class="form-container">
        <h2>Tambah Loket</h2>
        <form @submit.prevent="submitForm">
          <label for="no_erkas">No Erkas:</label>
          <input type="text" v-model="newLoket.no_erkas" id="no_erkas" required />
  
          <label for="pengirim">Nama Pengirim:</label>
          <input type="text" v-model="newLoket.pengirim" id="pengirim" required />
  
          <label for="jenis_surat">Jenis Surat:</label>
          <input type="text" v-model="newLoket.jenis_surat" id="jenis_surat" required />
  
          <label for="tanggal_surat">Tanggal Surat:</label>
          <input type="date" v-model="newLoket.tanggal_surat" id="tanggal_surat" required />
  
          <div class="form-actions">
            <button type="submit" class="btn submit">Simpan</button>
            <button type="button" @click="toggleForm" class="btn cancel">Batal</button>
          </div>
        </form>
      </div>
  
      <!-- Tabel Loket -->
      <div class="table-container" :style="{ opacity: isFormVisible ? 0.3 : 1 }">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>No Erkas</th>
              <th>Nama Pengirim</th>
              <th>Jenis Surat</th>
              <th>Tanggal Surat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(loket, index) in lokets" :key="loket.id" class="table-row">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ loket.no_erkas }}</td>
              <td>{{ loket.pengirim }}</td>
              <td>{{ loket.jenis_surat }}</td>
              <td>{{ loket.tanggal_surat }}</td>
              <td>
                <button @click="editLoket(loket)" class="btn">Edit</button>
                <button @click="deleteLoket(loket.id)" class="btn delete">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoketPage',
    data() {
      return {
        lokets: [
          { id: 1, no_erkas: '12345', pengirim: 'Budi Santoso', jenis_surat: 'Resmi', tanggal_surat: '2025-02-01' },
          { id: 2, no_erkas: '67890', pengirim: 'Siti Aisyah', jenis_surat: 'Penting', tanggal_surat: '2025-02-05' }
        ],
        isFormVisible: false,
        newLoket: {
          no_erkas: '',
          pengirim: '',
          jenis_surat: '',
          tanggal_surat: ''
        }
      };
    },
    methods: {
      toggleForm() {
        this.isFormVisible = !this.isFormVisible;
      },
      submitForm() {
        const newId = this.lokets.length + 1;
        this.lokets.push({
          id: newId,
          ...this.newLoket
        });
        this.newLoket = { no_erkas: '', pengirim: '', jenis_surat: '', tanggal_surat: '' };
        this.toggleForm();
      },
      editLoket(loket) {
        this.newLoket = { ...loket };
        this.isFormVisible = true;
      },
      deleteLoket(id) {
        this.lokets = this.lokets.filter(loket => loket.id !== id);
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .title {
    font-size: 2.4rem;
    font-weight: 600;
    color: #333;
  }
  
  .add-button {
    padding: 12px 20px;
    background-color: #007BFF;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
  }
  
  .add-button:hover {
    background-color: #0056b3;
    transform: scale(1.1);
  }
  
  .form-container {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    padding: 30px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 10;
    width: 80%;
    max-width: 600px;
  }
  
  form label {
    display: block;
    margin-top: 20px;
    font-size: 1.1rem;
    color: #555;
  }
  
  form input {
    width: 100%;
    padding: 14px;
    margin-top: 8px;
    margin-bottom: 18px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1.1rem;
    box-sizing: border-box;
  }
  
  form button {
    padding: 12px 25px;
    margin-top: 10px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 8px;
  }
  
  .submit {
    background-color: #28a745;
    color: white;
  }
  
  .submit:hover {
    background-color: #218838;
    transform: scale(1.05);
  }
  
  .cancel {
    background-color: #dc3545;
    color: white;
    margin-left: 12px;
  }
  
  .cancel:hover {
    background-color: #c82333;
    transform: scale(1.05);
  }
  
  .table-container {
    position: relative;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .table th, .table td {
    padding: 15px;
    text-align: left;
    font-size: 1.1rem;
    color: #333;
  }
  
  .table th {
    background-color: #f4f4f4;
    font-weight: 600;
  }
  
  .table-row:hover {
    background-color: #f1f1f1;
    transform: scale(1.02);
  }
  
  .btn {
    padding: 10px 18px;
    margin: 5px;
    border: none;
    cursor: pointer;
    background-color: #007BFF;
    color: white;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .btn:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
  
  .delete {
    background-color: #dc3545;
  }
  
  .delete:hover {
    background-color: #c82333;
  }
  </style>
  