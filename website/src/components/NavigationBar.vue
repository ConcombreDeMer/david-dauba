<template>

    <div class="header">
        <div class="navbar">
            <RouterLink to="/" class="btn">Accueil</RouterLink>
            <RouterLink to="/chapters" class="btn">Chapitres</RouterLink>
            <RouterLink to="/about" class="btn">À propos</RouterLink>
            <RouterLink to="/contact" class="btn">Contact</RouterLink>
        </div>

        <div class="mobile-navbar">
            <div class="dropdown">
                <button class="dropdown-toggle burger-btn" @click="toggleDropdown" :aria-expanded="dropdownOpen">
                    <span :class="['burger', { open: dropdownOpen }]">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
                <transition name="dropdown-fade">
                    <div v-if="dropdownOpen" class="dropdown-menu">
                        <RouterLink to="/" class="btn" @click="closeDropdown">Accueil</RouterLink>
                        <RouterLink to="/chapters" class="btn" @click="closeDropdown">Chapitres</RouterLink>
                        <RouterLink to="/about" class="btn" @click="closeDropdown">À propos</RouterLink>
                        <RouterLink to="/contact" class="btn" @click="closeDropdown">Contact</RouterLink>
                    </div>
                </transition>
            </div>
        </div>
    </div>


</template>

<script setup lang="ts">

import { ref } from 'vue';

const dropdownOpen = ref(false);

function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value;
}

function closeDropdown() {
    dropdownOpen.value = false;
}
</script>

<style scoped>

.header{
    position : fixed;
    top: 0;
    left: auto;
    width: 100%;
    z-index: 9999;  
    padding: 0;
    margin-top: 40px;
}

.mobile-navbar {
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    width: auto;
    padding: 10px;
    background: transparent;
    z-index: 10001;
}

/* Dropdown styles for mobile-navbar */
.dropdown {
    position: relative;
    width: auto;
    display: flex;
    justify-content: flex-end;
}
.dropdown-toggle {
    background: #222;
    border: none;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    transition: background 0.3s;
}
.dropdown-toggle:hover {
    background: #333;
}
.burger {
    display: inline-block;
    width: 28px;
    height: 22px;
    position: relative;
    transition: all 0.3s ease;
}
.burger span {
    display: block;
    position: absolute;
    height: 4px;
    width: 100%;
    background: #d1d1d1;
    border-radius: 2px;
    opacity: 1;
    left: 0;
    transition: all 0.3s ease;
}
.burger span:nth-child(1) {
    top: 0;
}
.burger span:nth-child(2) {
    top: 9px;
}
.burger span:nth-child(3) {
    top: 18px;
}
.burger.open span:nth-child(1) {
    top: 9px;
    transform: rotate(45deg);
}
.burger.open span:nth-child(2) {
    opacity: 0;
}
.burger.open span:nth-child(3) {
    top: 9px;
    transform: rotate(-45deg);
}
.dropdown-menu {
    position: absolute;
    top: 110%;
    right: 0;
    background: #222;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    min-width: 160px;
    z-index: 10000;
    padding: 10px 0;
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s, transform 0.3s;
}
/* Animation for dropdown */
.dropdown-fade-enter-active, .dropdown-fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}
.dropdown-fade-enter-from, .dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
.dropdown-fade-enter-to, .dropdown-fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}
.dropdown-menu .btn {
    padding: 10px 20px;
    text-align: left;
    color: #d1d1d1;
    background: none;
    border: none;
    font-size: 1.1rem;
    transition: color 0.2s;
}
.dropdown-menu .btn:hover {
    color: #fff;
    background: #333;
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


@media (max-width: 900px) {
    .navbar {
        display: none;
    }
    .mobile-navbar {
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        opacity: 0.9;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 10001;
    }
}

</style>