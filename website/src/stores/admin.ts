import { ref } from 'vue'

// Store simple pour l'état admin
export const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')

export function setAdmin(value: boolean) {
  isAdmin.value = value
  localStorage.setItem('isAdmin', value ? 'true' : 'false')
}

export function logoutAdmin() {
  isAdmin.value = false
  localStorage.removeItem('isAdmin')
}
