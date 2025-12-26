import { ref } from 'vue'

// Store simple pour l'état admin
// Accéder à localStorage seulement si disponible (navigateur)
const getInitialAdmin = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('isAdmin') === 'true'
  }
  return false
}

export const isAdmin = ref(getInitialAdmin())

export function setAdmin(value: boolean) {
  isAdmin.value = value
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('isAdmin', value ? 'true' : 'false')
  }
}

export function logoutAdmin() {
  isAdmin.value = false
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('isAdmin')
  }
}