<template>


    <div class="admin-news">
        <div class="content">
            <transition :name="slideDirection === 'forward' ? 'slide-horizontal' : 'slide-horizontal-reverse'" mode="out-in">
                <div v-if="!editingNewsId" key="list" class="slide-content">
                    <h1>Actualités</h1>
                    <div class="header-row">
                        <router-link to="/create-news" class="create-news-btn">Créer une actualité</router-link>
                    </div>
                    <div v-if="loading" class="loading">
                        <span class="spinner"></span>
                    </div>
                    <template v-else>
                        <div class="news-list">
                            <div class="news-header">
                                <div class="col col-header col-name">Nom</div>
                                <div class="col col-header col-date">Date</div>
                                <div class="col col-header col-photo">Photo</div>
                                <div class="col col-header col-video">Vidéo</div>
                                <div class="col col-header col-actions">Actions</div>
                            </div>
                            <div class="scroll">
                                <div v-for="news in newsList" :key="news.id" class="news-row">
                                    <div class="col col-name">{{ news.name }}</div>
                                    <div class="col col-date">{{ news.date }}</div>
                                    <div class="col col-photo">
                                        <span v-if="news.media_path">🖼️</span>
                                        <span v-else>—</span>
                                    </div>
                                    <div class="col col-video">
                                        <span v-if="news.media_link">🔗</span>
                                        <span v-else>—</span>
                                    </div>
                                    <div class="col col-actions">
                                        <button class="edit-btn" @click="editNews(news.id)"><img src="/admin/pencil.png" alt="Edit"></button>
                                        <button class="delete-btn" @click="deleteNews(news.id)"><img src="/admin/trash.png" alt="Delete"></button>
                                    </div>
                                </div>
                            </div>
                            <div v-if="newsList.length === 0" class="empty">Aucune actualité pour le moment.</div>
                        </div>
                    </template>
                </div>
                <div v-else key="edit" class="slide-content edit-content">
                    <template v-if="selectedNews">
                        <AdminNewsEdit
                            :news="selectedNews"
                            @back="goBackToList"
                            @updated="onNewsUpdated"
                            @deleted="onNewsDeleted"
                        />
                    </template>
                    <template v-else>
                        <div style="color:red; padding:2em;">Erreur : actualité introuvable (id={{ editingNewsId }})<br>Actualités chargées : {{ newsList.length }}</div>
                    </template>
                </div>
            </transition>
        </div>
    </div>


</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../../supabase'
import AdminNewsEdit from './AdminNewsEdit.vue'

export interface NewsRow {
    id: number
    name: string
    date: string
    media_path?: string | null
    media_link?: string | null
}

const newsList = ref<NewsRow[]>([])
const loading = ref(true)
const editingNewsId = ref<number | null>(null)
const slideDirection = ref<'forward' | 'back'>('forward')

const selectedNews = computed(() => {
    return newsList.value.find(n => n.id === editingNewsId.value) || null
})

const fetchNews = async () => {
    loading.value = true
    const { data, error } = await supabase.from('news').select('*, description').order('date', { ascending: false })
    if (error) {
        console.error('Erreur lors de la récupération des actualités:', error)
        loading.value = false
        return
    }
    // Pour chaque actualité, on mappe les bons champs
    const newsWithMedia: NewsRow[] = (data || []).map((news: any) => ({
        id: news.id,
        name: news.name,
        date: news.date,
        media_path: news.media_path || null,
        media_link: news.media_link || null,
        description: news.description || ''
    }))
    newsList.value = newsWithMedia
    loading.value = false
}

const editNews = (id: number) => {
    slideDirection.value = 'forward'
    editingNewsId.value = id
}

const goBackToList = () => {
    slideDirection.value = 'back'
    editingNewsId.value = null
}


const deleteNews = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette actualité ?')) return
    loading.value = true
    const { error } = await supabase.from('news').delete().eq('id', id)
    loading.value = false
    if (error) {
        alert('Erreur lors de la suppression : ' + error.message)
        return
    }
    await fetchNews()
}

const onNewsUpdated = async () => {
    await fetchNews()
}
const onNewsDeleted = async () => {
    await fetchNews()
    goBackToList()
}

onMounted(() => {
    fetchNews()
})
</script>

<style scoped>
.admin-news {
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
            .create-news-btn {
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
            .create-news-btn:hover {
                background: #888;
            }
        }
        .news-list {
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
            .news-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.3);
                padding-top: 10px;
                padding-bottom: 10px;
                font-weight: 500;
            }
            .news-row {
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
                margin-left: 0;
            }
            .edit-btn img {
                width: 100%;
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
            }
            .delete-btn img {
                width: 100%;
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>