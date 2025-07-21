<template>
  <div class="admin-view">
    <h1>Admin</h1>
    <div class="admin-options">
      <RouterLink to="/create-chapter" class="admin-option-btn">Créer un chapitre</RouterLink>
      <RouterLink to="/edit-chapter" class="admin-option-btn">Modifier un chapitre</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.admin-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}
.admin-options {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}
.admin-option-btn {
  background: #5D5D5D;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.3rem;
  text-decoration: none;
  transition: background 0.2s;
}
.admin-option-btn:hover {
  background: #7D7D7D;
}
</style>
