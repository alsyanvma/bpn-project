<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/plugins/supabase';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const showError = ref(false);
const blurAmount = ref(5); // Nilai blur yang bisa diubah

const login = async () => {
  if (!email.value || !password.value) {
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMessage.value = "Email atau password salah.";
      showError.value = true;
      return;
    }

    router.push('/');
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Auto-login saat halaman dimuat
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    router.push('/');
  }
});
</script>

<template>
  <div class="login-wrapper">
    <div class="login-container" :style="{ backdropFilter: `blur(${blurAmount.value}px)` }">
      <img src="/assets/img/logo.png" alt="Company Logo" class="logo" />
      <input 
        v-model="email" 
        type="email" 
        placeholder="Email" 
        required 
        @input="showError = false" 
      />
      <input 
        v-model="password" 
        type="password" 
        placeholder="Password" 
        required 
        @input="showError = false" 
      />
      <button @click="login">Masuk</button>
      <p v-if="showError" class="error">{{ errorMessage }}</p>
    </div>
    
    <!-- Kontrol Blur yang berada di tengah -->
    <div class="blur-control">
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('/assets/img/login.jpg') no-repeat center center;
  background-size: cover;
  flex-direction: column; /* Agar elemen di dalam wrapper terpusat secara vertikal */
}

.login-container {
  background: rgba(255, 255, 255, 0.3); /* Transparan */
  padding: 40px;
  border-radius: 50px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  max-width: 380px;
  width: 100%;
  backdrop-filter: blur(5px); /* Efek blur pada background */
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 14px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 30px;
  text-align: center;
  font-size: 16px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
  outline: none;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

button {
  width: 100%;
  padding: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

/* Styling untuk kontrol blur */
.blur-control {
  margin-top: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#blur-slider {
  width: 200px;
  margin-bottom: 10px;
}
</style>
