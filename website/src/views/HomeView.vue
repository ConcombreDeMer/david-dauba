<template>
  <NavigationBar />
  <div class="home">

    <a class="insta-link" href="https://www.instagram.com/david_dauba_noface/"><img src="/instagram.png" alt=""></a>

    <div class="home-container">
      <h1 class="title">David Dauba</h1>
      <img class="home1" src="/home1.png" alt="">
    </div>

    <GoToButton class="discover-btn" targetSection="chapters">
      <p>Découvrir</p>
    </GoToButton>

  </div>

  <div class="chapters" id="chapters">

    <div class="chapters-left">

      <div class="chapters-left-container">
        <h1 class="chapters-title">Mes chapitres</h1>
        <div class="chapters-list" v-for="(chapter, idx) in chapters" :key="chapter.id">
          <div class="chapters-list-item">
            <RouterLink class="chapter" :to="`/chapter/${chapter.id}`">{{ chapter.title }}</RouterLink>
            <IconClose v-if="isAdmin" class="delete-icon" @click="deleteChapter(chapter.id)" />
          </div>
          <hr v-if="idx !== chapters.length - 1" class="chapter-divider" />
        </div>
        <div v-if="chapters.length === 0">Aucun chapitre pour le moment.</div>
      </div>

    </div>

    <div class="chapters-right">
      <img class="home2" src="/home2.png" alt="">
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../supabase'
import type { Chapter } from '../type'
import { isAdmin } from '../stores/admin'
import IconClose from '@/components/icons/IconClose.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import GoToButton from '@/components/GoToButton.vue'
const chapters = ref<Chapter[]>([])

const fetchChapters = async () => {
  const { data, error } = await supabase.from('chapters').select('*')
  if (error) {
    console.error('Erreur lors de la récupération des chapitres:', error)
  } else {
    chapters.value = data
  }
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


onMounted(() => {
  fetchChapters()
})
</script>

<style scoped>
.insta-link {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.insta-link img {
  width: 40px;
  height: 40px;
  opacity: 0.7;
  transition: all 0.3s ease-in-out;
}

.insta-link:hover img {
  opacity: 1;
  transform: scale(1.1);
}

.footer {
  position: relative;
  width: 100vw;
  padding: 0;
  margin: 0;
}

.home {
  height: 100vh;
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  mix-blend-mode: lighten;
}

.home1 {
  display: block;
  position: relative;
  height: 50vh;
}

.title {
  text-align: center;
  color: #f0f0f0;
}

.discover-btn {
  position: absolute;
  display: block;
  font-weight: lighter;
  font-size: 1.5rem;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  background-color: #5D5D5D;
  width: 300px;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
  ;
  padding: 12px;
}

.discover-btn:hover {
  background-color: #7D7D7D;
  transition: all 0.3s ease;
  cursor: pointer;
}

.discover-btn p {
  margin: 0;
  padding: 0;
}

.chapters {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  width: 90%;
  height: 100vh;
  display: flex;
}

.chapters-title {
  text-align: start;
  color: #f0f0f0;
}

.chapters-left {
  width: 70%;
  height: 100%;
  position: relative;
}

.chapters-right {
  width: 30%;
  height: 100%;
  position: relative;
}

.chapters-left-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}


.home2 {
  mix-blend-mode: lighten;
  position: absolute;
  height: 90vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.chapters-list {
  font-size: 4rem;
  font-weight: lighter;
  list-style: none;
  margin: 10px 0;
  transition: color 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: column;
}

.chapters-list-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 90%;
  margin-top: 0;

}

.chapter {
  font-style: italic;
  color: #bcbcbc;
  transition: color 0.3s ease, margin-left 0.3s cubic-bezier(.4, 0, .2, 1);
  margin-left: 0;
}

.chapter:hover {
  color: #f0f0f0;
  margin-left: 50px;
}

.chapter-divider {
  border: none;
  border-top: 1px solid #bcbcbc;
  width: 70%;
  margin-left: 50px;
  margin-top: 2%;
  margin-bottom: 0;
}

.delete-icon {
  color: #bcbcbc;
  margin-left: 8px;
  cursor: pointer;
  transition: color 0.2s;
}

.delete-icon:hover {
  color: #ff4d4f;
}
</style>
