<template>


    <div class="chapters-container">
        <div class="chapters-left">
            <div class="presentation">
                <h1 class="chapters-title">Mes chapitres</h1>
                <div v-if="isAdmin" class="admin-actions">
                    <GoToButton to="/create-chapter">Créer un chapitre</GoToButton>
                </div>
                <ul class="chapters-list">
                    <li v-for="chapter in chapters" :key="chapter.id">


                        <ChapterInfo :chapter="chapter" :is-deployed="true" />


                        <!-- <div class="chapter-title">
                            <router-link :to="`/chapter/${chapter.id}`" class="chapter-title-texte">
                                {{ chapter.title }}
                            </router-link>
                            <div class="chapter-title-shadow"></div>
                        </div>

                        <div class="chapter-info">
                            <img class="arrow-down" src="../../public/arrow-down.png" alt=""
                                @click="deployChapter(chapter)">
                            <div class="left">
                                <p class="chapter-description">{{ chapter.description }}</p>
                                <p class="chapter-date">{{ chapter.date }}</p>
                            </div>
                            <div class="right">
                                <div v-if="chapter.firstPhotoUrl" class="chapter-photo-wrapper">
                                    <img :src="chapter.firstPhotoUrl" alt="photo du chapitre" class="chapter-photo" />
                                </div>
                                <button class="chapter-button">Découvrir</button>
                            </div>
                        </div> -->
                        <button v-if="isAdmin" @click="deleteChapter(chapter.id)" class="delete-chapter-btn">
                            <IconClose />
                        </button>
                    </li>
                </ul>
                <div v-if="chapters.length === 0">Aucun chapitre pour le moment.</div>
            </div>
        </div>
    </div>


</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../supabase'
import { isAdmin } from '../stores/admin'
import IconClose from '@/components/icons/IconClose.vue'
import GoToButton from '@/components/GoToButton.vue'
import type { Chapter } from '@/type'
import ChapterInfo from '@/components/ChapterInfo.vue'

export type ChapterWithPhoto = {
    id: number
    title: string
    description: string
    date: string
    firstPhotoUrl?: string
}

const chapters = ref<ChapterWithPhoto[]>([])

const fetchChapters = async () => {
    const { data, error } = await supabase.from('chapters').select('*').order('date', { ascending: false })
    if (error) {
        console.error('Erreur lors de la récupération des chapitres:', error)
        return
    }
    // Pour chaque chapitre, récupérer la première photo
    const chaptersWithPhotos: ChapterWithPhoto[] = await Promise.all(
        (data || []).map(async (chapter: any) => {
            const { data: photos, error: photoError } = await supabase
                .from('photos')
                .select('url')
                .eq('chapter_id', chapter.id)
                .order('id', { ascending: true })
                .limit(1)
            return {
                ...chapter,
                firstPhotoUrl: photos && photos.length > 0 ? photos[0].url : undefined
            }
        })
    )
    chapters.value = chaptersWithPhotos
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

const deployChapter = (chapter: Chapter) => {
    console.log("Déploiement du chapitre");

}

onMounted(() => {
    fetchChapters()
})
</script>

<style scoped>
.chapters-container {
    width: 70vw;
    margin-left: auto;
    margin-right: auto;
}

.chapters-title {
    text-align: center;
    padding-top: 200px;
    margin-bottom: 100px;
}

.chapters-list {
    list-style: none;
    padding: 0;
}

.delete-chapter-btn {
    margin-left: 24px;
    background: none;
    border: none;
    cursor: pointer;
    color: #bcbcbc;
    transition: color 0.2s;
}

.delete-chapter-btn:hover {
    color: #ff4d4f;
}
</style>