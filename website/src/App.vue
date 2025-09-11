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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

.logout-btn {
  margin-top: 50px;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: none;
  background: #c00;
  color: #fff;
  cursor: pointer;
}

.logout-btn:hover {
  background: #f00;
  transition: all 0.3s ease;
}

.admin-btn {
  margin-top: 50px;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: none;
  background: #5D5D5D;
  color: #fff;
  cursor: pointer;
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
  gap : 10px;
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
  font-family: 'Clash Display';
  background-color: #262626;
  color: #f0f0f0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font-family: 'Clash Display';
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
}

a {
  color: #ffffff;
  text-decoration: none;
}

p{
  margin: 0;
  padding: 0;
  font-size: 2.5vh;
  font-weight: lighter;
}

.bold {
  font-weight: 500;
}
</style>
