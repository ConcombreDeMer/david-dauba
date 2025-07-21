<template>
  <form @submit.prevent="createChapter">
    <div>
      <label for="title">Titre :</label>
      <input id="title" v-model="title" required />
    </div>
    <div>
      <label for="description">Description :</label>
      <textarea id="description" v-model="description" required></textarea>
    </div>
    <div>
      <label for="date">Date :</label>
      <input id="date" v-model="date" required />
    </div>
    <button type="submit">Créer le chapitre</button>
    <div v-if="message">{{ message }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../supabase'

const title = ref('')
const description = ref('')
const date = ref('')
const message = ref('')

const createChapter = async () => {
  const { error } = await supabase.from('chapters').insert([
    {
      title: title.value,
      description: description.value,
      date: date.value
    }
  ])
  if (error) {
    message.value = "Erreur lors de la création du chapitre : " + error.message
  } else {
    message.value = "Chapitre créé avec succès !"
    title.value = ''
    description.value = ''
    date.value = ''
  }
}
</script>

<style scoped>

</style>