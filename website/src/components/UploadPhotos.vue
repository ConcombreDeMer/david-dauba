<template>
  <div class="upload-photos-container">
    <label class="upload-label">
      <input type="file" @change="onFileChange" multiple style="display: none;" />
      <span class="upload-plus">+</span>
    </label>
    <div v-if="previews.length" class="preview-list">
      <div v-for="(src, idx) in previews" :key="idx" class="preview-item" style="position: relative;">
        <img :src="src" alt="preview" style="max-width: 200px; max-height: 200px; margin: 8px;" />
        <button @click="removePhoto(idx)" class="remove-photo-btn" title="Supprimer" type="button">×</button>
      </div>
    </div>
    <button class="upload-btn" v-if="selectedFiles.length && isValidationVisible" @click="uploadFiles">Valider</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../supabase'
import imageCompression from 'browser-image-compression'

const props = defineProps<{
  chapterId?: number
  isValidationVisible?: boolean
}>()

const emit = defineEmits(['upload'])

const selectedFiles = ref<File[]>([])
const previews = ref<string[]>([])

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target || !target.files || target.files.length === 0) return
  // Ajouter les nouveaux fichiers à la sélection existante
  const newFiles = Array.from(target.files)
  selectedFiles.value = selectedFiles.value.concat(newFiles)
  // Générer les URLs de prévisualisation pour les nouveaux fichiers et les ajouter
  const newPreviews = newFiles.map(file => URL.createObjectURL(file))
  previews.value = previews.value.concat(newPreviews)
  // Réinitialiser la valeur de l'input pour permettre de réajouter les mêmes fichiers si besoin
  target.value = ''
}

// Supprimer une photo ajoutée (avant upload)
function removePhoto(idx: number) {
  URL.revokeObjectURL(previews.value[idx])
  previews.value.splice(idx, 1)
  selectedFiles.value.splice(idx, 1)
}

function randomString(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const uploadFiles = async () => {
  if (!selectedFiles.value.length) return
  
  // Récupérer le nombre de photos existantes pour ce chapitre
  const { count } = await supabase
    .from('photos')
    .select('id', { count: 'exact', head: true })
    .eq('chapter_id', props.chapterId)
  
  let photoCount = count || 0
  
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  }
  for (const file of selectedFiles.value) {
    photoCount += 1
    try {
      const compressedFile = await imageCompression(file, options)
      const ext = file.name.split('.').pop() || 'jpg';
      const filePath = `${Date.now()}_${randomString(10)}.${ext}`;

      const { error } = await supabase.storage
        .from('photos')
        .upload(filePath, compressedFile)

      if (error) {
        console.error(error)
        continue
      }

      // Récupérer l'URL publique de la photo uploadée
      const { data: publicUrlData } = supabase.storage.from('photos').getPublicUrl(filePath)
      const url = publicUrlData.publicUrl

      // Ajouter l'entrée dans la table "photos" avec le chemin randomisé
      const { error: insertError } = await supabase.from('photos').insert([
        {
          chapter_id: props.chapterId,
          url: url,
          path: filePath,
          position: photoCount
        }
      ])
      if (insertError) {
        console.error('Erreur lors de l\'insertion dans la table photos:', insertError)
      } else {
        console.log('Photo ajoutée à la table photos')
      }
    } catch (err) {
      console.error('Compression or upload failed:', err)
    }
  }
  // Reset après upload
  selectedFiles.value = []
  previews.value.forEach(url => URL.revokeObjectURL(url))
  previews.value = []
  emit('upload')
}

// Expose une méthode pour déclencher l'upload depuis le parent
function triggerUpload() {
  uploadFiles()
}
defineExpose({ triggerUpload })
</script>

<style scoped>

.upload-btn {
  background: rgba(255, 255, 255, 0.1);
  border: solid 1px rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  font-family: inherit;
  font-weight: 300;
  transition: all 0.2s;
}

.upload-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.remove-photo-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.2s;
}

.remove-photo-btn:hover {
  background: rgba(220, 38, 38, 0.8);
}
</style>

<style scoped>
.upload-photos-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  margin-top: 10px;
  width: 50vw;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
}

.upload-label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: solid 1px rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.upload-label:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.upload-plus {
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.6);
  user-select: none;
  font-weight: lighter;
}

.preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.preview-item img {
  border-radius: 10px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border: solid 1px rgba(255, 255, 255, 0.2);
}
</style>
