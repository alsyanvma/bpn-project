<script setup>
import { useRouter } from 'vue-router';
import { supabase } from '~/plugins/supabase';
import { onMounted } from 'vue';

const router = useRouter();

onMounted(async () => {
  await supabase.auth.signOut();
  router.push('/login');
});
</script>

<template>
  <div class="logout-container">
    <p>Sedang logout...</p>
  </div>
</template>

<style scoped>
.logout-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 18px;
    color: #333;
}
</style>
