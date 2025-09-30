<template>
  <div class="case photos" :class="{ 'photos-edit': editMode }">
    <div class="title-case">Photos</div>
    <div class="edit">
      <button class="edit-btn" v-if="!editMode" @click="$emit('start-edit')">✎</button>
    </div>
    <div class="edit-photos-btn" v-if="editMode">
      <button class="close-photos-btn" @click="$emit('close-edit')" title="Réduire">
        <span>←</span>
      </button>
      <label class="add-photo-btn" title="Ajouter des photos">
        <span>＋</span>
        <input type="file" multiple accept="image/*" @change="onAddPhotos" style="display:none;" />
      </label>
    </div>
    <div class="photo-list-admin" :class="{ 'photo-list-admin-large': editMode }">
      <template v-if="photosLoading">
        <div class="data">Chargement des photos...</div>
      </template>
      <template v-else-if="photos.length">
        <div v-for="photo in photos" :key="photo.id"
          :class="['photo-thumb-admin', { 'photo-thumb-admin-large': editMode }]" style="position:relative;">
          <img :src="photo.url" :alt="photo.name || 'photo'" />
          <!-- Croix de suppression visible seulement en mode édition -->
          <button v-if="editMode" class="delete-photo-btn" @click="toggleDeletePhoto(photo.id)"
            :title="photoToDelete.has(photo.id) ? 'Annuler la suppression' : 'Supprimer la photo'">
            <span :style="photoToDelete.has(photo.id) ? 'color:#2ecc40' : ''">✕</span>
          </button>
        </div>
        <!-- Photos ajoutées localement (non encore uploadées) -->
        <div v-for="(file, idx) in newPhotos" :key="'new-' + idx"
          :class="['photo-thumb-admin', { 'photo-thumb-admin-large': editMode }]" style="position:relative;">
          <img :src="file.preview" alt="nouvelle photo" />
          <span class="new-photo-plus">＋</span>
        </div>
      </template>
      <template v-else>
        <div class="data">Aucune photo</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, watchEffect, type Ref } from 'vue'
import { supabase } from '../../../supabase'
const emit = defineEmits(['start-edit', 'close-edit', 'change'])

const props = defineProps<{
  chapterId: number
  editMode: boolean
}>()


const photos: Ref<any[]> = ref([])
const photosLoading = ref(false)
// Set pour stocker les ids des photos à supprimer
const photoToDelete: Ref<Set<number>> = ref(new Set())
// Liste des fichiers ajoutés localement (avant upload)
const newPhotos: Ref<{ file: File, preview: string }[]> = ref([])
// Ajout de photos locales (preview via URL.createObjectURL)
const onAddPhotos = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (const file of Array.from(files)) {
    const preview = URL.createObjectURL(file)
    newPhotos.value.push({ file, preview })
  }
}

// Nettoyage des previews (URLs) après upload/annulation
const clearNewPhotos = () => {
  for (const np of newPhotos.value) {
    URL.revokeObjectURL(np.preview)
  }
  newPhotos.value = []
}

const fetchPhotos = async (chapterId: number) => {
  photosLoading.value = true
  photos.value = []
  if (!chapterId) {
    photosLoading.value = false
    return
  }
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('chapter_id', chapterId)
  if (error) {
    photosLoading.value = false
    return
  }
  photos.value = data || []
  photosLoading.value = false
  photoToDelete.value.clear()
}

watch(() => props.chapterId, (newId: number) => {
  if (newId) fetchPhotos(newId)
}, { immediate: true })

onMounted(() => {
  if (props.chapterId) fetchPhotos(props.chapterId)
})

// Détecte les changements (ajout ou suppression de photos)
watchEffect(() => {
  emit('change', {
    hasPhotoChange: photoToDelete.value.size > 0 || newPhotos.value.length > 0,
    toDelete: Array.from(photoToDelete.value),
    toAdd: newPhotos.value.map((n: { file: File }) => n.file),
    clearNewPhotos
  })
})

// Ajoute ou retire une photo de la liste à supprimer
const toggleDeletePhoto = (photoId: number) => {
  if (photoToDelete.value.has(photoId)) {
    photoToDelete.value.delete(photoId)
  } else {
    photoToDelete.value.add(photoId)
  }
}
</script>

<style scoped>
.edit-photos-btn {
  display: flex;
  gap: 8px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 11;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;

  .close-photos-btn, .add-photo-btn {
    background: rgb(255, 255, 255, 0.3);
    color: #fff;
    border-radius: 10px;
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
    cursor: pointer;
    z-index: 10;
    transition: background 0.2s;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    opacity: 0.8;
  }

  .close-photos-btn:hover, .add-photo-btn:hover {
    background: rgb(255, 255, 255, 0.5);
    opacity: 1;
  }
}

.case.photos {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px;
  border: solid 1px rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  font-weight: 300;
  position: relative;
  box-sizing: border-box;
}

.photos-edit {
  grid-column: 1 / 3 !important;
  grid-row: 1 / 5 !important;
  z-index: 99;
  background: rgb(76, 76, 76);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
  transition: all 0.4s cubic-bezier(.4, 2, .6, 1);
}

.title-case {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  height: 30px;
}

.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 1rem;
  color: #fff;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.photo-list-admin {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 40px;
  margin-bottom: 8px;
  align-items: center;
  max-height: 220px;
  padding-right: 4px;
  transition: max-height 0.4s cubic-bezier(.4, 2, .6, 1);
}

.photo-list-admin-large {
  max-height: 70vh;
  gap: 24px;
}

.photo-thumb-admin {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.13);
  transition: all 0.3s cubic-bezier(.4, 2, .6, 1);
}

.photo-thumb-admin-large {
  width: 120px;
  height: 120px;
}

.photo-thumb-admin img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.delete-photo-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 0, 0, 0.7);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1em;
  z-index: 2;
  transition: background 0.2s;
}

.delete-photo-btn:hover {
  background: #ff4d4f;
}

.data {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
  height: calc(100% - 40px);
  max-width: 100%;
  box-sizing: border-box;
}
</style>