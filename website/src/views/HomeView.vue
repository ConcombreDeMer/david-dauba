<template>
  <a class="insta-link" href="https://www.instagram.com/david_dauba_noface/"><img src="/instagram.png" alt=""></a>
  <div class="home">
    <div class="home-container">
      <h1 class="title">David Dauba</h1>
      <img class="home1" src="/test/home1.png" alt="">
      <img class="home3" src="/test/home3.png" alt="">
      <img class="home1-mobile" src="/home1.png" alt="">
    </div>

    <div class="home-buttons">
      <RouterLink class="home-button" to="/about">Qui suis-je ?</RouterLink>
      <RouterLink class="home-button" to="/chapters">Voir mes chapitres</RouterLink>

    </div>
  </div>


  <div class="recent-works">
    <div v-if="recentImages.length" class="recent-works-grid">
      <img v-for="img in recentImages" :key="img.id" :src="img.url" :alt="img.name || 'photo'"
        class="recent-work-img" />
    </div>
    <div v-else class="recent-works-empty">Aucune image à afficher.</div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../../supabase'
import type { Chapter } from '../type'
import { isAdmin } from '../stores/admin'
import IconClose from '@/components/icons/IconClose.vue'
import GoToButton from '@/components/GoToButton.vue'

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
  transform: scale(1.04);
  cursor: pointer;
}

.recent-works-empty {
  text-align: center;
  color: #bcbcbc;
  font-size: 1.2rem;
  margin: 40px 0;
}

.home-buttons {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  gap: 20px;

  .home-button {
    background-color: #5D5D5D;
    border-radius: 5px;
    padding: 12px;
    color: white;
    text-decoration: none;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    width: 300px;
    text-align: center;
  }

  .home-button:hover {
    background-color: #7D7D7D;
    transition: all 0.3s ease;
    cursor: pointer;
  }
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
  height: 50vh;
  top: 60%;
  left: 50%;
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

.home3 {
  display: block;
  position: absolute;
  height: 50vh;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.title {
  position: absolute;
  top: 5%;
  left: 50%;
  width: 80%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #dcdcdc;
  font-size: 15vh;
  z-index: 10;
}


@media (max-width: 900px) {

  .title {
    font-size: 10vh;
    line-height: 0.8;
    margin: 0;
    padding: 0;
  }

  .home {
    height: 85vh;
    margin-bottom: 15vh;
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

  .home-container {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;

  }

  .insta-link {
    display: none;
  }

  .home-buttons {
    flex-direction: column;

  }


}
</style>
