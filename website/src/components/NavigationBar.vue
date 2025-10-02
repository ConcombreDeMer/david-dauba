<template>

    <div class="header">
        <div class="navbar">
            <div class="navbar-slider" :style="sliderStyle"></div>
            <RouterLink v-for="(btn, i) in navButtons" :key="btn.to" :to="btn.to" class="btn" :class="{ active: isActive(btn.to, i) }">
                {{ btn.label }}
            </RouterLink>
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
                        <RouterLink to="/news" class="btn" @click="closeDropdown">Actualités</RouterLink>
                        <RouterLink to="/about" class="btn" @click="closeDropdown">À propos</RouterLink>
                        <RouterLink to="/contact" class="btn" @click="closeDropdown">Contact</RouterLink>
                    </div>
                </transition>
            </div>
        </div>
    </div>


</template>

<script setup lang="ts">

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const dropdownOpen = ref(false);

const navButtons = [
    { to: '/', label: 'Accueil' },
    { to: '/chapters', label: 'Chapitres' },
    { to: '/news', label: 'Actualités' },
    { to: '/about', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
];

const route = useRoute();
const NAV_BTN_WIDTH = 120; // px, à ajuster si besoin
const NAV_BTN_MARGIN = 0; // px, à ajuster si besoin


// On mémorise le dernier index valide pour garder le slider en place si la route est inconnue
const lastValidIndex = ref(0);
const activeIndex = computed(() => {
    const idx = navButtons.findIndex(b => b.to === route.path);
    if (idx !== -1) {
        lastValidIndex.value = idx;
        return idx;
    }
    return lastValidIndex.value;
});
const sliderStyle = computed(() => {
    return {
        transform: `translateX(${activeIndex.value * NAV_BTN_WIDTH}px)`
    };
});

function isActive(to: string, idx?: number) {
    // Si la route est inconnue, on garde le bouton actif sur lastValidIndex
    const currentIdx = navButtons.findIndex(b => b.to === route.path);
    if (currentIdx === -1 && typeof idx === 'number') {
        return idx === lastValidIndex.value;
    }
    return route.path === to;
}

// Dropdown mobile (inchangé)
function handleClickOutside(event: MouseEvent) {
    const dropdown = document.querySelector('.dropdown');
    if (dropdownOpen.value && dropdown && !dropdown.contains(event.target as Node)) {
        dropdownOpen.value = false;
    }
}
watch(dropdownOpen, (open) => {
    if (open) {
        document.addEventListener('mousedown', handleClickOutside);
    } else {
        document.removeEventListener('mousedown', handleClickOutside);
    }
});
onMounted(() => {
    if (dropdownOpen.value) {
        document.addEventListener('mousedown', handleClickOutside);
    }
});
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});

function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value;
}

function closeDropdown() {
    dropdownOpen.value = false;
}
</script>

<style scoped>

.header {
    position: fixed;
    top: 0;
    left: auto;
    width: 100%;
    z-index: 9;
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
    z-index: 5;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.dropdown-fade-enter-to,
.dropdown-fade-leave-from {
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
    justify-content: space-between;
    align-items: center;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    background: transparent;
    backdrop-filter: blur(10px);
    border-radius: 50px;
    opacity: 0.9;
    z-index: 999999;
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    background-color: rgba(255, 255, 255, 0.1);
    position: relative;
    min-width: 500px;
}

.navbar-slider {
    position: absolute;
    left: 0;
    width: 120px;
    height: 100%;
    background: linear-gradient(135deg, #FFFFFF 0%, #afafaf 100%);
    border-radius: 50px;
    z-index: 0;
    transition: transform 0.35s cubic-bezier(.4, 1.3, .6, 1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
    pointer-events: none;
    border: solid 1px rgba(255, 255, 255, 0.4);
    opacity: 0.7;
}

.navbar .btn {
    position: relative;
    z-index: 1;
    width: 100px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 300;
    border-radius: 50px;
    transition: color 0.3s, font-weight 0.3s;
    padding: 10px;
}

.navbar .btn.active {
    color: #4C4C4C;
    font-weight: 500;
}

@media (max-width: 900px) {
    .navbar {
        display: none;
    }
    .navbar-slider {
        display: none;
    }
}


a {
    color: #d1d1d1;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: light;
}

.btn {
    transition: all 0.3s ease-in-out;
    font-weight: 300;
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