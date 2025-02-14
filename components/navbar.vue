<template>
    <header class="header-container">
        <div class="logo-container text-center">
            <picture>
                <img src="assets/img/logo.png" alt="logo Loket SP" class="img-fluid logo-image" width="80"
                    height="80" />
            </picture>
            <div class="app-name"> BADAN PERTANAHAN NASIONAL</div>
        </div>
        <nav class="navbar navbar-expand-lg">
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
                        <nuxt-link class="nav-link" to="/surat">Form Surat</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link class="nav-link" to="/loket">Loket SP</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link class="nav-link" to="/riwayat">Riwayat</nuxt-link>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
export default {
    name: "HeaderLoketSP",
};
</script>

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
</style>
