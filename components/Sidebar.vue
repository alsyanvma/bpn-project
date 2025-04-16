<template>
  <div>
    <!-- Sidebar -->
    <div v-if="isSidebarOpen" class="sidebar-menu">
      <!-- Header -->
      <div class="sidebar-header">
        <img :src="logo" alt="Logo Kantor Kita" />
        <h2>Kantor Kita</h2>
      </div>

      <!-- Body -->
      <div class="sidebar-body">
        <h3>Rekap Surat</h3>
        <ul>
          <!-- Surat Dropdown -->
          <li>
            <a @click="toggleSuratMenu" href="javascript:void(0)">
              <i class="bi bi-mailbox2"></i> Surat
              <i :class="{'bi bi-chevron-down': !isSuratOpen, 'bi bi-chevron-up': isSuratOpen}" class="ms-auto"></i>
            </a>
            <!-- Surat Submenu -->
            <ul v-if="isSuratOpen">
              <li>
                <router-link to="/">
                  <i class="bi bi-inbox"></i> Surat Masuk
                </router-link>
              </li>
              <li>
                <router-link to="/keseluruhan-surat">
                  <i class="bi bi-file-earmark-text"></i> Keseluruhan Surat
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Loket SP Dropdown -->
          <li>
            <a @click="toggleLoketMenu" href="javascript:void(0)">
              <i class="bi bi-mailbox2"></i> Loket SP
              <i :class="{'bi bi-chevron-down': !isLoketOpen, 'bi bi-chevron-up': isLoketOpen}" class="ms-auto"></i>
            </a>
            <!-- Loket SP Submenu -->
            <ul v-if="isLoketOpen">
              <li>
                <router-link to="/surat-masuk">
                  <i class="bi bi-inbox"></i> No Berkas
                </router-link>
              </li>
              <li>
                <router-link to="/keseluruhan-surat">
                  <i class="bi bi-file-earmark-text"></i> Keseluruhan ssss
                </router-link>
              </li>
            </ul>
          </li>

        </ul>
      </div>
      <!-- Footer -->
      <div class="sidebar-footer">
        <button @click="logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logo from '@/assets/img/a1.png';

const router = useRouter();
const isSidebarOpen = ref(true); // Sidebar in open state by default
const isSuratOpen = ref(false); // Surat menu dropdown state
const isLoketOpen = ref(false); // Loket SP menu dropdown state

// Toggle sidebar visibility
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Toggle Surat dropdown visibility
const toggleSuratMenu = () => {
  isSuratOpen.value = !isSuratOpen.value;
};

// Toggle Loket SP dropdown visibility
const toggleLoketMenu = () => {
  isLoketOpen.value = !isLoketOpen.value;
};

// Logout and navigate to login page
const logout = () => {
  alert('Anda telah logout!');
  router.push('/login');
};
</script>

<style scoped>
/* Tombol Toggle */
.toggle-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: #343152;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000;
  transition: background 0.3s ease;
}

/* Sidebar */
.sidebar-menu {
  background-color: #343152;
  padding: 20px;
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 5px rgba(255, 255, 255, 0.1);
}

/* Sidebar Header */
.sidebar-header {
  text-align: center;
  margin-bottom: 20px;
  color: white; /* Make header text white */
}

.sidebar-header img {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

/* Sidebar Body */
.sidebar-body h3 {
  margin-bottom: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  color: white; /* Make h3 text white */
}

.sidebar-body ul {
  list-style: none;
  padding: 0;
}

.sidebar-body li {
  margin-bottom: 10px;
}

.sidebar-body a {
  display: flex;
  align-items: center;
  padding: 10px;
  color: white; /* Make links text white */
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.sidebar-body i {
  margin-right: 10px;
  color: inherit !important; /* Ensure icons follow text color */
}

.sidebar-body a:hover {
  background-color: #d9d9d9;
  color: #343152; /* Change text color on hover to maintain readability */
}

/* Dropdown (Surat Menu) */
.sidebar-body ul ul {
  padding-left: 20px;
  display: none; /* Hide dropdown by default */
}

.sidebar-body ul li a {
  cursor: pointer;
}

.sidebar-body ul li a:hover {
  background-color: #d9d9d9;
}

/* Show dropdown when Surat menu is open */
.sidebar-body ul li > a {
  display: flex;
  justify-content: space-between;
}

.sidebar-body ul li > a .ms-auto {
  transition: transform 0.3s ease;
}

.sidebar-body ul li > a .ms-auto.bi-chevron-down {
  transform: rotate(0deg);
}

.sidebar-body ul li > a .ms-auto.bi-chevron-up {
  transform: rotate(180deg);
}

.sidebar-body ul li ul {
  display: block; /* Show the submenu */
}

/* Sidebar Footer */
.sidebar-footer {
  margin-top: auto;
  text-align: center;
}

.sidebar-footer button {
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.sidebar-footer button:hover {
  background-color: #c0392b;
}
</style>
