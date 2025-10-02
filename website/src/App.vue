<template>

  <NavigationBar />

  <Transition mode="out-in" name="fade">
    <RouterView />
  </Transition>
  <div class="admin">
    <AdminButton v-if="!isAdmin" />
    <button v-if="isAdmin" @click="logout" class="logout-btn"><img class="logout-icon" src="/logout.png"
        alt=""></button>
    <button v-if="isAdmin" @click="goToAdmin" class="admin-btn"><img class="admin-icon" src="/admin.png"
        alt=""></button>
  </div>

  <DynamicFooter />

</template>

<script setup lang="ts">

import { RouterView } from 'vue-router'
import AdminButton from './components/AdminButton.vue'
import { isAdmin, logoutAdmin } from './stores/admin'
import NavigationBar from './components/NavigationBar.vue'

function logout() {
  logoutAdmin()
  router.push('/')
}

import { useRouter } from 'vue-router'
import DynamicFooter from './components/DynamicFooter.vue'
const router = useRouter()
function goToAdmin() {
  router.push('/admin')
}
</script>


<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.admin {
  margin-right: 100px;
  margin-top: 20px;
}

.logout-btn {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: none;
  background: #c00;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn:hover {
  background: #f00;
  transition: all 0.3s ease;
}

.admin-btn {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: none;
  background: #5D5D5D;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-btn:hover {
  background: #7D7D7D;
  transition: all 0.3s ease;
}

.logout-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.admin-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.admin {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  display: flex;
  gap: 10px;
}

@font-face {
  font-family: 'Roboto';
  src: url('./assets/fonts/Roboto-VariableFont_wdth,wght.ttf') format('woff2');
  font-weight: lighter 200, Light 300, Regular 400, Medium 500, Semibold 600, Bold 700, Extrabold 800, Black 900;
  font-style: normal;
}

@font-face {
  font-family: 'Fairplay Display';
  src: url('./assets/fonts/PlayfairDisplay-VariableFont_wght.ttf') format('woff2');
  font-weight: lighter 200, Light 300, Regular 400, Medium 500, Semibold 600, Bold 700, Extrabold 800, Black 900;
  font-style: normal;
}


@font-face {
  font-family: 'Clash Display';
  src: url('./assets/fonts/ClashDisplay-Variable.ttf') format('woff2');
  font-weight: lighter 200, Light 300, Regular 400, Medium 500, Semibold 600, Bold 700, Extrabold 800, Black 900;
  font-style: normal;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto';
  /* background-color: #262626; */
  background-image: url('/Background.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: #f0f0f0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font-family: 'Roboto', sans-serif;
  font-weight: Medium;
  font-size: 1.2rem;
  color: #f0f0f0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

h1 {
  margin: 0;
  padding: 0;
  font-size: 8vh;
  font-weight: 500;
  font-family: 'Fairplay Display';
}

a {
  color: #ffffff;
  text-decoration: none;
}

p {
  margin: 0;
  padding: 0;
  font-size: 2.5vh;
  font-weight: lighter;
}

.bold {
  font-weight: 500;
}
</style>
