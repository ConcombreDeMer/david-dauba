<template>
  <div class="password-container">
    <form @submit.prevent="checkPassword">
      <input
        v-model="inputPassword"
        type="password"
        placeholder="Mot de passe"
        class="password-input"
      />
      <button type="submit">Valider</button>
    </form>
    <p v-if="error" class="error">Mot de passe incorrect</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const inputPassword = ref('')
const error = ref(false)
const realPassword = import.meta.env.VITE_PASSWORD
const router = useRouter()

import { setAdmin } from '../stores/admin'

function checkPassword() {
  if (inputPassword.value === realPassword) {
    error.value = false
    setAdmin(true)
    router.push('/')
  } else {
    error.value = true
  }
}
</script>

<style scoped>
.password-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.password-input {
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 1rem;
}
button {
  padding: 0.5rem 1.2rem;
  font-size: 1.1rem;
  border-radius: 5px;
  border: none;
  background: #333;
  color: #fff;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>