<template>

    <div class="news">

        <PageTitles title="Actualités" subtitle="Tenez vous au courant de mes actus" />


        <div class="content">
            <ArrowDownPage class="arrow"/>


            <div class="news-list">
                <template v-if="loading">
                    <LoadingSpinner />
                    <p class="loading-text">Chargement des actualités...</p>
                </template>
                <template v-else-if="news.length === 0">
                    <p class="no-news">Aucune actualité pour le moment.</p>
                </template>
                <div v-else>
                    <div v-for="item in news" :key="item.id" class="news-item">
                        <h2 class="title">{{ item.name }}</h2>
                        <p class="description">{{ item.description }}</p>
                        <div v-if="item.media_path" class="media-block">
                            <img :src="getPublicImageUrl(item.media_path, item.id)" alt="media" class="image-iframe" />
                        </div>
                        <div v-if="item.media_link" class="media-block">
                            <iframe v-if="isYoutube(item.media_link)" :src="youtubeEmbedUrl(item.media_link)"
                                frameborder="0" class="youtube-iframe"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                            <iframe v-else :src="item.media_link" frameborder="0" allowfullscreen></iframe>
                        </div>
                        <div class="created-at">{{ formatRelativeDate(item.date) }}</div>
                        <div class="line"></div>
                    </div>
                </div>
            </div>

        </div>

    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageTitles from '@/components/PageTitles.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ArrowDownPage from '@/components/ArrowDownPage.vue'

interface NewsItem {
    id: number
    date: string
    name: string
    description: string
    media_url: string | null
    media_path: string | null
    media_link: string | null
}


import { supabase } from '../../supabase'
const news = ref<NewsItem[]>([])
const loading = ref(true)

function getPublicImageUrl(mediaPath: string | null, id: number) {
    if (!mediaPath) return ''
    const { data } = supabase.storage.from('news-media').getPublicUrl(mediaPath)
    // Ajoute un paramètre pour le cache busting
    return (data?.publicUrl || '') + '?t=' + id
}

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

.arrow {
    position: relative;
    top: -50px;
}

.news {
    width: 80%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;

    h1 {
        margin-bottom: 50px;
    }
}

.content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 90vh;
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
    margin-bottom: 50px;
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

.loading-text {
    text-align: center;
    color: #bcbcbc;
    font-size: 1.2rem;
    margin-top: 20px;
}


.news-item {
    position: relative;
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    max-width: 1200px;
    width: 90vw;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 20px;
    padding: 20px;
    margin-bottom: 100px;
    opacity: 0.8;
    transition: all 0.3s ease;
    cursor: pointer;
}

.news-item:hover {
    opacity: 1;
    scale: 1.02;
}

.news-item h2 {
    margin: 0;
    padding: 0;
    font-size: 3rem;
    font-weight: 500;
}

.description {
    font-size: 2vh;
    color: #ddd;
    margin: 0;
    padding: 0;
    width: 80%;
}

.news-item .media-block {
    width: 80%;
    height: fit-content;
    display: flex;
    justify-content: start;
}

.youtube-iframe,
.image-iframe {
    width: 90%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: 20px;
}

.news-item .created-at {
    font-size: 1rem;
    color: #aaa;
    position: absolute;
    top: -30px;
    left: 0px;
}

.line {
    width: 2px;
    height: 50%;
    background-color: #959595;
    position: absolute;
    right: 0%;
    top: 50%;
    transform: translateY(-50%);
}

.delete-news-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: #ff4d4f;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 18px;
    font-size: 1.2rem;
    cursor: pointer;
    z-index: 100;
    transition: background 0.2s;
}

.delete-news-btn:hover {
    background: #d9363e;
}


@media (max-width: 900px) {
    .news {
        width: 100%;
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

    .content {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 80vh;

    }

    .news-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        margin-left: auto;
        margin-right: auto;

    }

    .news-item {
        width: 85%;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 70px;
        gap: 20px;
        opacity: 1;
        padding: 10px;
    }

    .news-item .media-block {
        width: 100%;
    }

    .news-item h2 {
        font-size: 2rem;
        width: 100%;
        padding: 0;
        margin: 0;
    }

    .description {
        font-size: 1rem;
        text-align: left;
        font-weight: 300;
        width: 100%;
    }

    .youtube-iframe,
    .image-iframe {
        width: 100%;
        min-width: 0;
        aspect-ratio: 16 / 9;
        border-radius: 10px;
    }

    .news-item .created-at {
        font-size: 0.9rem;
        top: -22px;
    }

    .delete-news-btn {
        position: relative;
        font-size: 1.5vh;
        width: 90%;
        margin: 12px 0 0 0;
        padding: 10px 0;
        top: unset;
        right: unset;
        z-index: 10;
        display: block;
        text-align: center;
        margin-left: auto;
        margin-right: auto;

    }

    .line {
        display: none;
    }
}
</style>