<template>
  <form @submit.prevent="createProduct">
    <div>
      <label for="title">Titre :</label>
      <input id="title" v-model="title" required />
    </div>
    <div>
      <label for="little_description">Petite description :</label>
      <input id="little_description" v-model="littleDescription" required />
    </div>
    <div>
      <label for="big_description">Grande description :</label>
      <textarea id="big_description" v-model="bigDescription" required></textarea>
    </div>
    <div>
      <label for="photo">Image :</label>
      <input id="photo" type="file" @change="onFileChange" accept="image/*" required />
    </div>
    <div>
      <label for="price">Prix :</label>
      <input id="price" v-model.number="price" type="number" min="0" step="0.01" required />
    </div>
    <button type="submit">Créer le produit</button>
    <div v-if="message">{{ message }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../supabase'

const title = ref('')
const littleDescription = ref('')
const bigDescription = ref('')
const price = ref<number | null>(null)
const photoFile = ref<File | null>(null)
const message = ref('')

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    photoFile.value = target.files[0]
  }
}

const createProduct = async () => {
  if (!photoFile.value) {
    message.value = "Veuillez sélectionner une image."
    return
  }

  // Upload image to Supabase Storage
  const fileName = `${Date.now()}_${photoFile.value.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('products')
    .upload(fileName, photoFile.value)

  if (uploadError) {
    message.value = "Erreur lors de l'upload de l'image : " + uploadError.message
    return
  }

  const photoUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl

  // Insert product into database
  const { error } = await supabase.from('products').insert([
    {
      title: title.value,
      little_description: littleDescription.value,
      big_description: bigDescription.value,
      photo_url: photoUrl,
      price: price.value
    }
  ])

  if (error) {
    message.value = "Erreur lors de la création du produit : " + error.message
  } else {
    message.value = "Produit créé avec succès !"
    title.value = ''
    littleDescription.value = ''
    bigDescription.value = ''
    price.value = null
    photoFile.value = null
    // Optionally reset file input
    const fileInput = document.getElementById('photo') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}
label {
  font-weight: bold;
}
input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
</style>
