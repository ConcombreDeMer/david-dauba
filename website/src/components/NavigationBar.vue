<template>

    <div class="header">
        <div class="navbar">
            <RouterLink to="/" class="logo">Accueil</RouterLink>
            <RouterLink to="/" class="logo">Chapitre</RouterLink>
            <RouterLink to="/" class="logo">Contact</RouterLink>
        </div>
    </div>


</template>

<script setup lang="ts">

</script>

<style scoped>

.header{
    position : fixed;
    width: 100%;
    z-index: 1000;
}

.navbar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 30%;
    padding: 40px;
    margin-left: auto;
    margin-right: auto;
}

a{
    color: #bcbcbc;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: lighter;
}

</style>