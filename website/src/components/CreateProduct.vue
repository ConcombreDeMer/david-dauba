
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
      <textarea id="big_description" v-model="bigDescription" required rows="3" ref="bigDescriptionTextarea" @input="autoResize" style="overflow:hidden;resize:none;"></textarea>
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
    <div v-if="message" :class="message.includes('Erreur') ? 'create-product-message message-error' : 'create-product-message message-success'">{{ message }}</div>
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
  padding-top: 150px;
  margin-bottom: 50px;
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
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  background: rgba(255, 255, 255, 0.1);
  border: solid 1px rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  outline: none;
  color: #fff;
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: 300;
  border-radius: 10px;
  padding: 10px 16px;
  margin-top: 4px;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
  box-sizing: border-box;
}

input[type="file"] {
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
}

input[type="file"]::file-selector-button {
  background: rgba(255, 255, 255, 0.1);
  border: solid 1px rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 12px;
  transition: all 0.2s;
  font-family: inherit;
  font-weight: 300;
}

input[type="file"]::file-selector-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

input::placeholder,
textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

input:focus,
textarea:focus {
  border: solid 1.5px #fff;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 0 2px #00000033;
}

label {
  font-weight: normal;
  margin-bottom: 8px;
  font-size: 1.5rem;
  display: block;
}

.create-product-button {
  margin-top: 16px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: solid 1px rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  color: #fff;
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.2s;
  width: 50vw;
  height: 60px;
}

.create-product-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.create-product-message {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 1rem;
  text-align: center;
  width: 50vw;
  box-sizing: border-box;
}

.message-error {
  background: rgba(220, 38, 38, 0.15);
  border: solid 1px rgba(220, 38, 38, 0.3);
  color: #ff9b9b;
}

.message-success {
  background: rgba(34, 197, 94, 0.15);
  border: solid 1px rgba(34, 197, 94, 0.3);
  color: #86efac;
}
</style>
