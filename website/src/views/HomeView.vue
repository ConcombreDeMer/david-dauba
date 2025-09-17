<template>
  <a class="insta-link" href="https://www.instagram.com/david_dauba_noface/"><img src="/instagram.png" alt=""></a>
  <div class="home">
    <div class="home-container">
      <div class="titles">
        <h1 class="title">David Dauba</h1>
        <p class="sous-title">Photographie sans visage</p>
        <div class="line"></div>
        <RouterLink class="home-button" to="/about">Découvrir</RouterLink>
      </div>
      <img class="home1" src="/test/home1.png" alt="">
      <img class="home3" src="/test/home3.png" alt="">
      <img class="home1-mobile" src="/home1.png" alt="">
    </div>
    <RouterLink class="home-button-mobile" to="/about">Découvrir</RouterLink>
  </div>


  <div class="recent-works">
    <PhotoModal :show="showPhotoModal" :photos="recentImages" :selectedIndex="selectedPhotoIndex"
      @close="closePhotoModal" @update:selectedIndex="updatePhotoIndex" />
    <template v-if="recentImages.length">
      <div class="recent-works-grid">
        <img v-for="(img, i) in recentImages" :key="img.id" :src="img.url" :alt="img.name || 'photo'"
          class="recent-work-img" @click="openPhotoModal(i)" style="cursor:pointer;" />
      </div>
    </template>
    <template v-else>
      <div class="recent-works-empty">Aucune image à afficher.</div>
    </template>
  </div>

</template>

<script setup lang="ts">
import PhotoModal from '../components/PhotoModal.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../../supabase'
import type { Chapter } from '../type'

const showPhotoModal = ref(false)
const selectedPhotoIndex = ref(0)
const openPhotoModal = (idx: number) => {
  selectedPhotoIndex.value = idx
  showPhotoModal.value = true
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
}
const closePhotoModal = () => {
  showPhotoModal.value = false
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
}
const updatePhotoIndex = (idx: number) => {
  selectedPhotoIndex.value = idx
}

const chapters = ref<Chapter[]>([])
const recentImages = ref<any[]>([])

const fetchChapters = async () => {
  const { data, error } = await supabase.from('chapters').select('*')
  if (error) {
    console.error('Erreur lors de la récupération des chapitres:', error)
  } else {
    chapters.value = data
  }
}

const fetchRecentImages = async () => {
  // 1. Récupérer le dernier chapitre publié (par date décroissante)
  const { data: lastChapter, error: chapterError } = await supabase
    .from('chapters')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single()
  if (chapterError || !lastChapter) {
    console.error('Erreur lors de la récupération du dernier chapitre:', chapterError)
    recentImages.value = []
    return
  }
  // 2. Récupérer toutes les images de ce chapitre
  const { data: images, error: imagesError } = await supabase
    .from('photos')
    .select('*')
    .eq('chapter_id', lastChapter.id)
  if (imagesError || !images) {
    console.error('Erreur lors de la récupération des images:', imagesError)
    recentImages.value = []
    return
  }
  // 3. Mélanger et prendre 20 images max
  const shuffled = images.sort(() => Math.random() - 0.5)
  recentImages.value = shuffled.slice(0, 20)
}

const deleteChapter = async (id: number) => {
  if (!confirm('Voulez-vous vraiment supprimer ce chapitre ?')) return;
  const { error } = await supabase.from('chapters').delete().eq('id', id)
  if (error) {
    alert('Erreur lors de la suppression du chapitre : ' + error.message)
  } else {
    chapters.value = chapters.value.filter(chap => chap.id !== id)
  }
}

// Mouvement home3 en fonction de la souris
onMounted(() => {
  fetchChapters()
  fetchRecentImages()

  const home3 = document.querySelector<HTMLImageElement>('.home3')
  const home1 = document.querySelector<HTMLImageElement>('.home1')
  if (!home3 || !home1) return

  const moveImage = (e: MouseEvent) => {
    const x = e.clientX / window.innerWidth - 0.5 // -0.5 à 0.5
    const y = e.clientY / window.innerHeight - 0.5
    // home3 : Mouvement très léger (max 20px)
    const maxMove3 = 20
    const translateX3 = x * maxMove3 * 2
    const translateY3 = y * maxMove3 * 2
    home3.style.transform = `translate(-50%, -50%) translate(${translateX3}px, ${translateY3}px)`
    // home1 : Mouvement encore plus subtil (max 10px)
    const maxMove1 = 10
    const translateX1 = x * maxMove1 * 2
    const translateY1 = y * maxMove1 * 2
    home1.style.transform = `translate(-50%, -50%) translate(${translateX1}px, ${translateY1}px)`
  }
  window.addEventListener('mousemove', moveImage)

  // Nettoyage à la destruction du composant
  onUnmounted(() => {
    window.removeEventListener('mousemove', moveImage)
    // Remettre la position initiale
    if (home3) home3.style.transform = 'translate(-50%, -50%)'
    if (home1) home1.style.transform = 'translate(-50%, -50%)'
  })
})
</script>

<style scoped>
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
  gap: 16px;
}

.modal-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 50%;
  width: 54px;
  height: 54px;
  font-size: 2.2rem;
  color: #333;
  cursor: pointer;
  z-index: 1100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.13);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  opacity: 0.5;
}

.modal-arrow.left {
  left: 32px;
}

.modal-arrow.right {
  right: 32px;
}

.modal-arrow:hover {
  background: #eaeaea;
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

.recent-works {
  margin: 60px auto 0 auto;
  width: 90vw;
  min-height: 200px;
}

.recent-works-grid {
  column-count: 3;
  column-width: 300px;
  column-gap: 50px;
  width: 100%;
  max-width: 1220px;
  margin: 0 auto;
}

.recent-work-img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.13);
  transition: transform 0.2s;
  display: block;
  margin-bottom: 50px;
  break-inside: avoid;
}

.recent-work-img:hover {
  transition: all 0.3s ease-in-out;
  transform: scale(1.03);
  cursor: pointer;
}

.recent-works-empty {
  text-align: center;
  color: #bcbcbc;
  font-size: 1.2rem;
  margin: 40px 0;
}

.home-button,
.home-button-mobile {
  position: absolute;
  bottom: -80px;
  left: -20px;
  background-color: #D9D9D9;
  border-radius: 20px;
  padding: 12px 40px;
  color: #212121;
  text-decoration: none;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 300;
}

.home-button:hover,
.home-button-mobile:hover {
  background-color: #ffffff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.home-button-mobile {
  display: none;
}

.insta-link {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  opacity: 0.7;
  transition: all 0.3s ease-in-out;
  width: 40px;
}

.insta-link img {
  width: 100%;
}

.insta-link:hover {
  opacity: 1;
  transform: scale(1.1);
}

.home {
  height: 90vh;
  position: relative;
  margin: 0;
  padding: 0;
}

.home-container {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 52%;
  left: 50%;
  transform: translate(-50%, -50%);
  mix-blend-mode: lighten;
}

.home1 {
  display: block;
  position: absolute;
  height: 70vh;
  top: 60%;
  left: 70%;
  transform: translate(-50%, -50%);
}

.home3 {
  display: block;
  position: absolute;
  height: 70vh;
  top: 60%;
  left: 70%;
  transform: translate(-50%, -50%);
}

.home1-mobile {
  display: none;
  position: absolute;
  height: 50vh;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.titles {
  position: absolute;
  top: 40%;
  left: 32%;
  transform: translate(-50%, -50%);
  z-index: 20;
  width: fit-content;
}

.title {
  position: relative;
  color: #dcdcdc;
  z-index: 10;
  width: fit-content;
  font-size: 16vh;
}

.sous-title {
  color: #dcdcdc;
  font-size: 3vh;
  z-index: 10;
  font-family: 'Fairplay Display', serif;
  font-weight: 400;
  margin-left: 2px;
  padding: 0;
  margin-top: -20px;
}

.line {
  width: 2px;
  height: 85%;
  background-color: white;
  position: absolute;
  top: 18%;
  left: -20px;
}


@media (max-width: 900px) {


  .home-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 100%;
  }

  .titles {
    text-align: center;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .sous-title {
      margin-top: -10px;
      opacity: 0.8;

    }


    .line {
      display: none;
    }
  }

  .title {
    position: relative;
    font-size: 10vh;
    line-height: 0.8;
    margin: 0;
    padding: 0;
  }

  .home {
    height: 90vh;
    margin-bottom: 15vh;
  }

  .home-button {
    display: none;
  }

  .home-button-mobile {
    display: block;
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
  }

  .home1 {
    display: none;
  }

  .home3 {
    display: none;
  }

  .home1-mobile {
    display: block;
    height: 40vh;
  }

  .insta-link {
    display: none;
  }



}
</style>
