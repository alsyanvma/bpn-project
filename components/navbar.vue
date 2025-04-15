<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { supabase } from '@/plugins/supabase';

const route = useRoute();
const router = useRouter();
const user = ref(null);

// Cek apakah user sudah login
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  user.value = session?.user || null;

  supabase.auth.onAuthStateChange((_, session) => {
    user.value = session?.user || null;
  });
});

// Fungsi logout
const logout = async () => {
  await supabase.auth.signOut();
  user.value = null;
  router.push('/login');
};
</script>

<template>
  <header v-if="route.path !== '/login'" class="header-container">
    <!-- Logo dan nama aplikasi -->
    <div class="logo-container text-center">
      <picture>
        <img src="/assets/img/logo.png" alt="logo Loket SP" class="img-fluid logo-image" width="80" height="80" />
      </picture>
      <div class="app-name">BADAN PERTANAHAN NASIONAL</div>
    </div>

    <!-- Navbar, tampil kalau bukan di halaman alih-media & penyelesaian -->
    <nav v-if="route.path !== '/alih-media' && route.path !== '/alih-media/penyelesaian'" class="navbar navbar-expand-lg">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/">Beranda</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/loket">Loket</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/surat">Surat Tugas</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/pemetaan">Pemetaan</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/penyelesaian-produk">Penyelesaian Produk</nuxt-link>
          </li>
        </ul>

        <!-- Tombol Logout -->
        <button v-if="user" @click="logout" class="btn btn-danger logout-btn">
          <i class="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f7f7f7;
  padding: 10px 10px;
}

.logo-container {
  text-align: center;
  margin-bottom: 10px;
}

.logo-image {
  margin-bottom: 10px;
}

.app-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.navbar {
  background-color: #2e4259;
  color: #ffffff;
  padding: 10px 0;
  width: 100%;
}

.navbar-toggler {
  border: none;
}

.navbar-nav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

.nav-item {
  margin: 0 15px;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
}

.nav-link:hover {
  color: #dfe6ee;
}

.logout-btn {
  margin-left: 10px;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 5px;
}
</style>
