<template>

    <div class="news">

        <h1>Mes actualités</h1>
        <RouterLink v-if="isAdmin" to="/create-news" class="create-news">
            <p>Créer une actualité</p>
            <p class="plus">+</p>
        </RouterLink>


        <div class="news-list">
            <template v-if="loading">
                <p class="no-news">Chargement des actualités...</p>
            </template>
            <template v-else-if="news.length === 0">
                <p class="no-news">Aucune actualité pour le moment.</p>
            </template>
            <div v-else>
                <div v-for="item in news" :key="item.id" class="news-item">
                    <button v-if="isAdmin" class="delete-news-btn" @click="deleteNews(item.id)" title="Supprimer">x</button>
                    <h2>{{ item.name }}</h2>
                    <p>{{ item.description }}</p>
                    <div v-if="item.media_url" class="media-block">
                        <img :src="item.media_url" alt="media" class="image-iframe" />
                    </div>
                    <div v-if="item.media_link" class="media-block">
                        <iframe v-if="isYoutube(item.media_link)" :src="youtubeEmbedUrl(item.media_link)"
                            frameborder="0" class="youtube-iframe"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen></iframe>
                        <iframe v-else :src="item.media_link" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="created-at">{{ formatRelativeDate(item.date) }}</div>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../supabase'
import { isAdmin } from '@/stores/admin'

interface NewsItem {
    id: number
    date: string
    name: string
    description: string
    media_url: string | null
    media_path: string | null
    media_link: string | null
}

const news = ref<NewsItem[]>([])
const loading = ref(true)

onMounted(async () => {
    loading.value = true
    const { data, error } = await supabase.from('news').select('*').order('date', { ascending: false })
    if (!error && data) {
        news.value = data
    }
    loading.value = false
})

async function deleteNews(id: number) {
    if (!confirm('Supprimer cette actualité ?')) return
    const { error } = await supabase.from('news').delete().eq('id', id)
    if (!error) {
        news.value = news.value.filter(n => n.id !== id)
    } else {
        alert("Erreur lors de la suppression : " + error.message)
    }
}

function isYoutube(url: string): boolean {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url)
}

function youtubeEmbedUrl(url: string): string {
    const reg = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
    const match = url.match(reg)
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`
    }
    return url
}


function formatRelativeDate(dateStr: string): string {
    const now = new Date()
    const date = new Date(dateStr)
    const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffTime = dateDay.getTime() - nowDay.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    if (isNaN(diffDays)) return ''
    if (diffDays === 0) return "Aujourd'hui"
    const absDays = Math.abs(diffDays)
    if (absDays < 7) {
        if (diffDays > 0) return `Dans ${absDays === 1 ? '1 jour' : absDays + ' jours'}`
        else return `Il y a ${absDays === 1 ? '1 jour' : absDays + ' jours'}`
    }
    const weeks = Math.floor(absDays / 7)
    if (absDays < 30) {
        if (diffDays > 0) return `Dans ${weeks === 1 ? '1 semaine' : weeks + ' semaines'}`
        else return `Il y a ${weeks === 1 ? '1 semaine' : weeks + ' semaines'}`
    }
    const months = Math.floor(absDays / 30)
    if (absDays < 365) {
        if (diffDays > 0) return `Dans ${months === 1 ? '1 mois' : months + ' mois'}`
        else return `Il y a ${months === 1 ? '1 mois' : months + ' mois'}`
    }
    const years = Math.floor(absDays / 365)
    if (diffDays > 0) return `Dans ${years === 1 ? '1 an' : years + ' ans'}`
    return `Il y a ${years === 1 ? '1 an' : years + ' ans'}`
}
</script>

<style scoped>
.news {
    width: 80%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 200px;

    h1 {
        margin-bottom: 50px;
    }
}

.create-news {
    background-color: #5D5D5D;
    border-radius: 5px;
    padding: 0px 12px;
    color: white;
    text-decoration: none;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    width: 350px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 100px;

}

.create-news:hover {
    background-color: #7D7D7D;
    transition: all 0.3s ease;
    cursor: pointer;
}

.plus {
    font-size: 3rem;
    font-weight: 500;
}

.no-news {
    text-align: center;
}


.news-item {
    position: relative;
    background: #464646;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    max-width: 1200px;
    width: 90vw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 20px;
    margin-bottom: 80px;
}

.news-item h2 {
    margin: 0;
    padding: 0;
    font-size: 3rem;
    font-weight: 500;
}

.news-item .media-block {
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
}

.youtube-iframe,
.image-iframe {
    width: 90%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
}

.news-item .created-at {
    font-size: 1rem;
    color: #aaa;
    position: absolute;
    top: -30px;
    left : 0px;
}

.delete-news-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0,0,0,0.6);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    transition: background 0.2s;
}
.delete-news-btn:hover {
    background: #e74c3c;
}
@media (max-width: 900px) {
    .news {
        width: 98vw;
        margin-top: 100px;
    }
    .news h1 {
        font-size: 6vh;
        margin-bottom: 30px;
    }
    .create-news {
        width: 80vw;
        font-size: 1.1rem;
        margin-bottom: 50px;
        padding: 0 8px;
    }
    .plus {
        font-size: 2.2rem;
    }
    .news-item {
        max-width: 100vw;
        width: 90vw;
        padding: 12px;
        margin-bottom: 40px;
        gap: 10px;
    }
    .news-item h2 {
        font-size: 2rem;
    }
    .youtube-iframe,
    .image-iframe {
        width: 100%;
        min-width: 0;
        aspect-ratio: 16 / 9;
    }
    .news-item .created-at {
        font-size: 0.9rem;
        top: -22px;
    }
    .delete-news-btn {
        width: 28px;
        height: 28px;
        font-size: 1.5rem;
        top: 8px;
        right: 8px;
    }
}
</style>