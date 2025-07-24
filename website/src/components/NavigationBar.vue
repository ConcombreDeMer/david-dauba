<template>

    <div class="header">
        <div class="navbar">
            <RouterLink to="/" class="btn">Accueil</RouterLink>
            <RouterLink to="/" class="btn">Chapitre</RouterLink>
            <RouterLink to="/contact" class="btn">Contact</RouterLink>
        </div>
    </div>


</template>

<script setup lang="ts">

</script>

<style scoped>

.header{
    position : fixed;
    top: 0;
    left: auto;
    width: 100%;
    z-index: 1000;  
    padding: 0;
    margin-top: 40px;
}

.navbar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 30%;
    padding: 10px;
    margin-left: auto;
    margin-right: auto;
    background: transparent;
    backdrop-filter: blur(10px);
    border-radius: 10px;
    opacity: 0.9;
    z-index: 999999;
}


a{
    color: #d1d1d1;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: light;
}

.btn {
    transition: all 0.3s ease-in-out;
}
.btn:hover {
    font-weight: 500;
    color: #ffffff;
}

</style>