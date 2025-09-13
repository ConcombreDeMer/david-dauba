<template>


    <div class="chapters-container">

        <div class="chapters-titles">
            <h1 class="chapters-title">Mes chapitres</h1>
            <p class="chapters-subtitle">Mes différents projets</p>
            <div class="line"></div>
        </div>
        <div v-if="isAdmin" class="admin-actions">
            <GoToButton to="/create-chapter">Créer un chapitre</GoToButton>
        </div>
        <ul class="chapters-list">
            <li v-for="chapter in chapters" :key="chapter.id">

                <ChapterInfo :chapter="chapter" :is-deployed="true" />

                <button v-if="isAdmin" @click="deleteChapter(chapter.id)" class="delete-chapter-btn">
                    <IconClose />
                </button>
            </li>
        </ul>
        <div v-if="chapters.length === 0">Aucun chapitre pour le moment.</div>
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
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}


.chapters-titles {
    position: absolute;
    top: 40%;
    left: 32%;
    transform: translate(-50%, -50%);
    z-index: 20;
    width: fit-content;
}


.chapters-title {
    position: relative;
    color: #dcdcdc;
    z-index: 10;
    width: fit-content;
    font-size: 12vh;
}

.chapters-subtitle {
    color: #dcdcdc;
    font-size: 2.5vh;
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

.chapters-list {
    list-style: none;
    padding: 0;
    margin-top: 90vh;
    display: flex;
    flex-direction: column;
    gap: 60px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
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


@media (max-width: 900px) {

    .chapters-container {
        width: 90vw;
    }

    .chapters-title {
        padding-top: 100px;
        margin-bottom: 50px;
        font-size: 6vh;
    }

    .chapters-left {
        width: 100%;
        height: auto;
    }


}
</style>