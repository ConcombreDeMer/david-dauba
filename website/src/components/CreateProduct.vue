
<template>
  <h1 class="create-product-title">Créer un produit</h1>
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
      <textarea id="big_description" v-model="bigDescription" required rows="1" ref="bigDescriptionTextarea" @input="autoResize" style="overflow:hidden;resize:none;"></textarea>
    </div>
    <div>
      <label for="photo">Image :</label>
      <input id="photo" type="file" @change="onFileChange" accept="image/*" required />
    </div>
    <div>
      <label for="price">Prix :</label>
      <input id="price" v-model.number="price" type="number" min="0" step="0.01" required />
    </div>
    <button class="create-product-button" type="submit">Créer le produit</button>
    <div v-if="message" class="create-product-message">{{ message }}</div>
  </form>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../supabase'

const title = ref('')
const littleDescription = ref('')
const bigDescription = ref('')
const price = ref<number | null>(null)
const photoFile = ref<File | null>(null)
const message = ref('')
const bigDescriptionTextarea = ref<HTMLTextAreaElement | null>(null)

const autoResize = () => {
  const el = bigDescriptionTextarea.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }
}

onMounted(() => {
  autoResize()
})

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
    autoResize();
    // Optionally reset file input
    const fileInput = document.getElementById('photo') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }
}
</script>


<style scoped>
.create-product-title {
  text-align: center;
  padding-top: 100px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  margin-top: 50px;
  margin-bottom: 100px;
}

form div {
  width: 50vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

input,
textarea {
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  background: transparent;
  border: none;
  border-bottom: 1px solid #646464;
  outline: none;
  color: inherit;
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: 300;
  padding: 8px 0 4px 0;
  margin-top: 4px;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus {
  border-bottom: 1px solid #ffffff;
}

label {
  font-weight: normal;
  margin-bottom: 2px;
  font-size: 2rem;
}

.create-product-button {
  margin-top: 16px;
  padding: 10px 32px;
  border: none;
  border-radius: 4px;
  background: #4E4E4E;
  color: #fff;
  font-size: 2rem;
  font-family: inherit;
  font-weight: lighter;
  cursor: pointer;
  transition: background 0.2s;
  width: 50vw;
  height: 70px;
}

.create-product-button:hover {
  background: #0056b3;
}

.create-product-message {
  margin-top: 16px;
  font-size: 1.5rem;
  color: #4E4E4E;
  text-align: center;
}
</style>
