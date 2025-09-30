<template>


    <div class="admin-chapters">
        <div class="content">
            <transition :name="slideDirection === 'forward' ? 'slide-horizontal' : 'slide-horizontal-reverse'"
                mode="out-in">
                <div v-if="!editingChapterId" key="list" class="slide-content">
                    <h1>Chapitres</h1>
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
                                    <div class="col col-status">
                                        <AdminStatusLabel :status="chapter.status" />
                                    </div>
                                    <div class="col col-actions">
                                        <button class="edit-btn" @click="editChapter(chapter.id)"><img src="/admin/pencil.png" alt=""></button>
                                        <button class="delete-btn" @click="deleteChapter(chapter.id)"><img src="/admin/trash.png" alt=""></button>
                                    </div>
                                </div>
                            </div>
                            <div v-if="chapters.length === 0" class="empty">Aucun chapitre pour le moment.</div>
                        </div>
                    </template>
                </div>
                <div v-else key="edit" class="slide-content edit-content">
                    <template v-if="selectedChapter">
                        <AdminChapter :chapter="selectedChapter" @back="goBackToList" @saved="onChapterSaved" />
                    </template>
                    <template v-else>
                        <div style="color:red; padding:2em;">Erreur : chapitre introuvable (id={{ editingChapterId }})<br>Chapitres chargés : {{ chapters.length }}</div>
                    </template>
                </div>
            </transition>
        </div>
    </div>


</template>

<script setup lang="ts">


import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../../supabase'
import AdminChapter from './AdminChapter.vue'
import AdminStatusLabel from './AdminStatusLabel.vue'

export interface ChapterRow {
    id: number
    title: string
    date: string
    nbPhotos: number
    status: string
    description: string
}


const chapters = ref<ChapterRow[]>([])
const loading = ref(true)

const editingChapterId = ref<number | null>(null)
const slideDirection = ref<'forward' | 'back'>('forward')

const selectedChapter = computed(() => {
    return chapters.value.find(ch => ch.id === editingChapterId.value) || null
})

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
                status: chapter.status || 'Inconnu',
                description: chapter.description || ''
            }
        })
    )
    chapters.value = chaptersWithPhotos
    loading.value = false
}


const editChapter = (id: number) => {
    slideDirection.value = 'forward'
    editingChapterId.value = id
}

const goBackToList = () => {
    slideDirection.value = 'back'
    editingChapterId.value = null
}

// Rafraîchir la liste après modification d'un chapitre
const onChapterSaved = async () => {
    await fetchChapters()
}

const deleteChapter = async (id: number) => {
    if (confirm('Voulez-vous vraiment supprimer ce chapitre ?')) {
        // Suppression des photos associées
        const { data: photos, error: photosError } = await supabase
            .from('photos')
            .select('*')
            .eq('chapter_id', id)
        if (photosError) {
            alert('Erreur récupération photos: ' + photosError.message)
            await fetchChapters();
            return
        }
        if (photos && photos.length > 0) {
            for (const photo of photos) {
                if (photo.path) {
                    await supabase.storage.from('photos').remove([photo.path])
                }
            }
            await supabase.from('photos').delete().eq('chapter_id', id)
        }
        // Suppression du chapitre
        const { error: chapterError } = await supabase
            .from('chapters')
            .delete()
            .eq('id', id)
        if (chapterError) {
            alert('Erreur suppression chapitre: ' + chapterError.message)
        }
    }
    await fetchChapters();
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
        height: 100%;
        overflow: hidden;

        .slide-content {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }

        .edit-content {
            box-sizing: border-box;
        }

        .back-btn {
            margin-bottom: 20px;
            background: #222;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 8px 18px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.2s;
        }

        .back-btn:hover {
            background: #444;
        }

        /* Animation slide horizontale */
        .slide-horizontal-enter-active,
        .slide-horizontal-leave-active {
            transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s;
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .slide-horizontal-enter-from {
            transform: translateX(100%);
            opacity: 0;
        }

        .slide-horizontal-enter-to {
            transform: translateX(0);
            opacity: 1;
        }

        .slide-horizontal-leave-from {
            transform: translateX(0);
            opacity: 1;
        }

        .slide-horizontal-leave-to {
            transform: translateX(-100%);
            opacity: 0;
        }

        /* Slide reverse (retour) */
        .slide-horizontal-reverse-enter-active,
        .slide-horizontal-reverse-leave-active {
            transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s;
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .slide-horizontal-reverse-enter-from {
            transform: translateX(-100%);
            opacity: 0;
        }

        .slide-horizontal-reverse-enter-to {
            transform: translateX(0);
            opacity: 1;
        }

        .slide-horizontal-reverse-leave-from {
            transform: translateX(0);
            opacity: 1;
        }

        .slide-horizontal-reverse-leave-to {
            transform: translateX(100%);
            opacity: 0;
        }

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
            box-sizing: border-box;
            width: 100%;
            max-height: calc(80% - 65px);
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

            .edit-btn {
                background: #222;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.2s;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 100%;
                }
            }

            .edit-btn:hover {
                background: #888;
            }

            .delete-btn {
                background: #ff4d4f;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-left: 10px;
                transition: background 0.2s;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 100%;
                }
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