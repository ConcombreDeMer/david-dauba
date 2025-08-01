<template>

  <div class="chapter-header">
    <h1 class="chapter-title">{{ chapter.title }}</h1>
    <p class="chapter-date">{{ chapter.date }}</p>


    <div v-if="randomLandscapePhoto" class="random-landscape-photo-wrapper">
      <img :src="randomLandscapePhoto.url" :alt="randomLandscapePhoto.name || 'photo paysage'"
        class="random-landscape-photo" />
    </div>


    <p class="chapter-description">{{ chapter.description }}</p>
    <UploadPhotos v-if="isAdmin" :chapterId="chapter.id" :isValidationVisible="true" />
  </div>


  <div class="photos">
    <div v-if="photos.length">
      <div class="photo-list">
        <div v-for="photo in photos" :key="photo.id" class="photo-wrapper">
          <img :src="photo.url" :alt="photo.name || 'photo'" class="chapter-photo" @click="openPhotoModal(photo)"
            style="cursor:pointer;" />
          <button v-if="isAdmin" class="delete-cross" @click="deletePhoto(photo)">✕</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Aucune photo pour ce chapitre.</p>
    </div>
  </div>

  <!-- Modal photo -->
  <transition name="modal-fade">
    <div v-if="showPhotoModal" class="modal-overlay" @click.self="closePhotoModal">
      <div class="modal-content">
        <img :src="selectedPhoto?.url" :alt="selectedPhoto?.name || 'photo agrandie'" class="modal-photo"
          @load="onModalImgLoad" />
        <button class="modal-close" @click="closePhotoModal">✕</button>
      </div>
    </div>
  </transition>


</template>

<script setup lang="ts">
const showPhotoModal = ref(false)
const selectedPhoto = ref<any | null>(null)
const onModalImgLoad = (e: Event) => {
  // Optionnel : ajuster dynamiquement la taille si besoin
}
const openPhotoModal = (photo: any) => {
  selectedPhoto.value = photo
  showPhotoModal.value = true
  document.body.style.overflow = 'hidden' // Empêche le scroll en arrière-plan
}
const closePhotoModal = () => {
  showPhotoModal.value = false
  selectedPhoto.value = null
  document.body.style.overflow = ''
}
import type { Chapter } from '../type'
import { ref, onMounted } from 'vue'
import { supabase } from '../../supabase'
import { useRoute } from 'vue-router'
import UploadPhotos from '../components/UploadPhotos.vue'

const route = useRoute()
const isAdmin = ref(false)
const chapter = ref<Chapter>({ id: 0, title: '', description: '', date: '' })
const photos = ref<any[]>([])
const randomLandscapePhoto = ref<any | null>(null)

// Fonction pour supprimer une photo de la table et du storage
const deletePhoto = async (photo: any) => {
  if (!confirm('Supprimer cette photo ?')) return
  try {
    // On utilise le chemin exact stocké lors de l'upload
    if (!photo.path) {
      alert('Impossible de déterminer le chemin du fichier à supprimer (champ path manquant).')
      return
    }
    // 1. Supprimer du storage
    const { error: storageError } = await supabase.storage.from('photos').remove([photo.path])
    if (storageError) {
      alert('Erreur lors de la suppression du fichier du storage: ' + storageError.message)
      return
    }
    // 2. Supprimer de la table
    const { error: dbError } = await supabase.from('photos').delete().eq('id', photo.id)
    if (dbError) {
      alert('Erreur lors de la suppression de la photo de la base: ' + dbError.message)
      return
    }
    // 3. Mettre à jour la liste locale
    photos.value = photos.value.filter((p) => p.id !== photo.id)
  } catch (e) {
    alert('Erreur lors de la suppression : ' + e)
  }
}

onMounted(async () => {
  const chapterId = Number(route.params.id)
  if (!chapterId) return
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', chapterId)
    .single()
  if (error) {
    console.error('Erreur lors du fetch du chapitre:', error)
    return
  }
  chapter.value = data as Chapter

  // Fetch photos for this chapter
  const { data: photosData, error: photosError } = await supabase
    .from('photos')
    .select('*')
    .eq('chapter_id', chapterId)
  if (photosError) {
    console.error('Erreur lors du fetch des photos:', photosError)
    return
  }
  photos.value = photosData || []

  // Filtrer les photos paysage (16:9)
  if (photos.value.length > 0) {
    // Charger les dimensions des images pour filtrer les paysages
    const landscapePhotos: any[] = []
    const promises = photos.value.map(photo => {
      return new Promise<void>((resolve) => {
        const img = new window.Image()
        img.onload = function () {
          const ratio = img.width / img.height
          // 16:9 = 1.77... on tolère un peu
          if (ratio > 1.6 && ratio < 1.85) {
            landscapePhotos.push(photo)
          }
          resolve()
        }
        img.onerror = function () {
          resolve()
        }
        img.src = photo.url
      })
    })
    await Promise.all(promises)
    if (landscapePhotos.length > 0) {
      // Choisir une photo paysage au hasard
      randomLandscapePhoto.value = landscapePhotos[Math.floor(Math.random() * landscapePhotos.length)]
    } else {
      randomLandscapePhoto.value = null
    }
  } else {
    randomLandscapePhoto.value = null
  }

  isAdmin.value = localStorage.getItem('isAdmin') === 'true'
})


</script>

<style scoped>
.chapter-description {
  text-align: center;
  width: 50vw;
  margin: 0 auto;
  padding: 20px;
}

.chapter-header {
  text-align: center;
  width: 80vw;
  margin: 0 auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 100vh;
  background: rgba(30, 30, 30, 0.55);
  backdrop-filter: blur(7px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.modal-content {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  padding: 0;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: modal-pop 0.25s cubic-bezier(.4, 2, .6, 1) both;
}

.modal-photo {
  max-width: 80vw;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  object-fit: contain;
  background: #fff;
  display: block;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 22px;
  color: #c00;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.13);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.modal-close:hover {
  background: #ffeaea;
}

@keyframes modal-pop {
  0% {
    transform: scale(0.85);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.random-landscape-photo-wrapper {
  display: flex;
  justify-content: center;
  margin: 24px 0 16px 0;
}

.random-landscape-photo {
  max-width: 80vw;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.13);
  object-fit: cover;
  aspect-ratio: 16/9;
}


.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
  width: 80vw;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
}

.photo-wrapper {
  position: relative;
  display: inline-block;
}

.chapter-photo {
  width: 350px;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.chapter-photo:hover {
  transform: scale(1.04);
}

.delete-cross {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  color: #c00;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  transition: background 0.2s;
}

.delete-cross:hover {
  background: #ffeaea;
}

.chapter-title {
  padding-top: 150px;
  text-align: center;
}

.chapter-date {
  text-align: center;
  color: #bcbcbc;
}

@media (max-width: 900px) {

  .chapter-header {
    width: 90vw;
  }

  .chapter-title {
    font-size: 6vh;
    padding-top: 100px;
  }

  .chapter-description {
    width: 90vw;
    font-size: 2vh;
    padding: 10px;
  }

  .random-landscape-photo {
    max-width: 90vw;
    aspect-ratio: unset; /* Désactive l'aspect ratio pour les petits écrans */
  }

}


</style>