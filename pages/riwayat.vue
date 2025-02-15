<template>
    <div class="container">
      <div class="header">
        <h1 class="title">Riwayat Surat dan Loket</h1>
      </div>
  
      <!-- Tabel Riwayat -->
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>No Erkas</th>
              <th>Nama Pengirim</th>
              <th>Jenis Surat</th>
              <th>Tanggal Surat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in riwayat" :key="item.id" class="table-row">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.no_erkas }}</td>
              <td>{{ item.pengirim }}</td>
              <td>{{ item.jenis_surat }}</td>
              <td>{{ item.tanggal_surat }}</td>
              <td>
                <span class="status" :class="getStatusClass(item.status)">{{ item.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RiwayatPage',
    data() {
      return {
        riwayat: [
          { id: 1, no_erkas: '12345', pengirim: 'Budi Santoso', jenis_surat: 'Resmi', tanggal_surat: '2025-02-01', status: 'Diproses' },
          { id: 2, no_erkas: '67890', pengirim: 'Siti Aisyah', jenis_surat: 'Penting', tanggal_surat: '2025-02-05', status: 'Selesai' },
          { id: 3, no_erkas: '54321', pengirim: 'Ahmad Ridwan', jenis_surat: 'Internal', tanggal_surat: '2025-02-10', status: 'Menunggu' }
        ]
      };
    },
    methods: {
      getStatusClass(status) {
        switch (status) {
          case 'Selesai':
            return 'status-complete';
          case 'Diproses':
            return 'status-progress';
          case 'Menunggu':
            return 'status-pending';
          default:
            return '';
        }
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
  
  .table th,
  .table td {
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
  
  .status {
    padding: 8px 15px;
    border-radius: 8px;
    font-weight: bold;
    display: inline-block;
  }
  
  .status-complete {
    background-color: #28a745;
    color: white;
  }
  
  .status-progress {
    background-color: #ffc107;
    color: black;
  }
  
  .status-pending {
    background-color: #dc3545;
    color: white;
  }
  </style>
  