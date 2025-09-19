<template>


    <div class="admin-chapters">
        <h1>Chapitres</h1>
        <div class="content">
            <div class="header-row">
                <router-link to="/create-chapter" class="create-chapter-btn">Créer un chapitre</router-link>
            </div>
            <div v-if="loading" class="loading">
                <span class="spinner"></span>
            </div>
            <template v-else>
                <div class="chapters-list">
                    <div class="chapters-header">
                        <div class="col col-header col-title">Nom</div>
                        <div class="col col-header col-date">Date</div>
                        <div class="col col-header col-nbPhotos">Nb de photo</div>
                        <div class="col col-header col-status">Status</div>
                        <div class="col col-header col-actions">Actions</div>
                    </div>
                    <div class="scroll">
                        <div v-for="chapter in chapters" :key="chapter.id" class="chapter-row">
                            <div class="col col-title">{{ chapter.title }}</div>
                            <div class="col col-date">{{ chapter.date }}</div>
                            <div class="col col-nbPhotos">{{ chapter.nbPhotos }}</div>
                            <div class="col col-status">{{ chapter.status }}</div>
                            <div class="col col-actions">
                                <button class="edit-btn" @click="editChapter(chapter.id)">O</button>
                                <button class="delete-btn" @click="deleteChapter(chapter.id)">X</button>
                            </div>
                        </div>
                    </div>
                    <div v-if="chapters.length === 0" class="empty">Aucun chapitre pour le moment.</div>
                </div>
            </template>
        </div>
    </div>


</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { supabase } from '../../../supabase'

interface ChapterRow {
    id: number
    title: string
    date: string
    nbPhotos: number
    status: string
}

const chapters = ref<ChapterRow[]>([])
const loading = ref(true)

const fetchChapters = async () => {
    loading.value = true
    const { data, error } = await supabase.from('chapters').select('*').order('date', { ascending: false })
    if (error) {
        console.error('Erreur lors de la récupération des chapitres:', error)
        loading.value = false
        return
    }
    // Pour chaque chapitre, récupérer le nombre de photos
    const chaptersWithPhotos: ChapterRow[] = await Promise.all(
        (data || []).map(async (chapter: any) => {
            const { count, error: photoError } = await supabase
                .from('photos')
                .select('id', { count: 'exact', head: true })
                .eq('chapter_id', chapter.id)
            return {
                id: chapter.id,
                title: chapter.title,
                date: chapter.date,
                nbPhotos: count || 0,
                status: 'Publié' // ou autre logique de status si besoin
            }
        })
    )
    chapters.value = chaptersWithPhotos
    loading.value = false
}

const editChapter = (id: number) => {
    // Rediriger vers la page d'édition ou ouvrir un modal
    alert('Edit chapitre ' + id)
}

const deleteChapter = (id: number) => {
    if (confirm('Voulez-vous vraiment supprimer ce chapitre ?')) {
        // À compléter : suppression réelle côté supabase si besoin
        alert('Suppression du chapitre ' + id)
    }
}

onMounted(() => {
    fetchChapters()
})
</script>

<style scoped>
.admin-chapters {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;

    h1 {
        height: 20%;
    }

    .content {
        display: block;
        position: relative;
        height: 80%;

        .header-row {
            display: flex;
            justify-content: flex-end;
            height: 65px;

            .create-chapter-btn {
                border: solid 1px rgba(255, 255, 255, 0.3);
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                background-color: rgba(255, 255, 255, 0.2);
                color: #fff;
                border-radius: 5px;
                padding: 10px 24px;
                font-size: 1.1rem;
                text-decoration: none;
                cursor: pointer;
                transition: background 0.2s;
                font-weight: 500;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 10px;
                margin-bottom: 10px;
            }

            .create-chapter-btn:hover {
                background: #888;
            }
        }

        .chapters-list {
            display: block;
            width: 100%;
            max-height: calc(100% - 65px);
            color: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            font-size: 1.1rem;
            border: solid 1px rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            background-color: rgba(255, 255, 255, 0.1);
            overflow-y: auto;

            
            .chapters-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.3);
                padding-top: 10px;
                padding-bottom: 10px;
                font-weight: 500;
            }
            
            .chapter-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: solid 1px rgba(255, 255, 255, 0.2);
                padding: 10px 0;
                transition: background 0.2s;
                font-weight: 300;
            }
            
            .col {
                display: flex;
                justify-content: left;
                width: 20%;
                box-sizing: border-box;
                padding: 5px 20px;
            }
            
            .edit-btn:hover {
                background: #888;
            }
            
            .delete-btn {
                background: #ff4d4f;
                color: #fff;
                border: none;
                border-radius: 5px;
                padding: 6px 18px;
                cursor: pointer;
                margin-left: 10px;
                transition: background 0.2s;
            }
            
            .delete-btn:hover {
                background: #d9363e;
            }
            
            .empty {
                margin-top: 30px;
                color: #bcbcbc;
                text-align: center;
            }

        }
    }

}


.loading {
    margin-top: 40px;
    color: #bcbcbc;
    text-align: center;
    font-size: 1.3rem;
    letter-spacing: 1px;

}

.spinner {
    display: inline-block;
    width: 48px;
    height: 48px;
    border: 5px solid #bcbcbc;
    border-top: 5px solid #5D5D5D;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>