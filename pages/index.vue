<template>
    <div class="beranda-container">
        <div class="welcome-section">
            <h1>Selamat Datang di Loket SP</h1>
            <p>Sistem Pelayanan Loket SP Badan Pertanahan Nasional Tasikmalaya.</p>
            <nuxt-link to="/loket" class="btn btn-primary">Mulai Pelayanan</nuxt-link>
        </div>
        <div class="info-section">
            <div class="info-card">
                <h3>Proses Cepat</h3>
                <p>Pelayanan berbasis digital untuk mempermudah proses administrasi pertanahan.</p>
            </div>
            <div class="info-card">
                <h3>Data Terintegrasi</h3>
                <p>Seluruh data pemohon tersimpan dengan aman dan dapat diakses kapan saja.</p>
            </div>
            <div class="info-card">
                <h3>Pelayanan Mudah</h3>
                <p>Sistem yang dirancang untuk kenyamanan dan kemudahan dalam pengajuan berkas.</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BerandaLoketSP",
};
</script>

<style scoped>
.beranda-container {
    text-align: center;
    padding: 50px 20px;
    background-color: #f7f9fc;
}

.welcome-section {
    margin-bottom: 30px;
}

.welcome-section h1 {
    font-size: 28px;
    color: #2c3e50;
    margin-bottom: 10px;
}

.welcome-section p {
    font-size: 18px;
    color: #7f8c8d;
}

.btn-primary {
    background-color: #4a90e2;
    color: #ffffff;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
}

.btn-primary:hover {
    background-color: #357ab7;
}

.info-section {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
}

.info-card {
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 300px;
}

.info-card h3 {
    color: #34495e;
    margin-bottom: 10px;
}

.info-card p {
    color: #7f8c8d;
    font-size: 16px;
}
</style>
