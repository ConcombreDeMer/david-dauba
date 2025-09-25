<template>
    <div class="edit-news">
        <div class="header">
            <button class="back-btn" @click="emit('back')">←</button>
            <h1>{{ editedNews?.name || 'Actualité' }}</h1>
        </div>
        <div v-if="editedNews" class="details">
            <!-- Description -->
            <div class="case description">
                <div class="title-case">Description</div>
                <template v-if="editMode.description">
                    <textarea v-model="editedNews.description" @input="onInput" rows="4" style="width:100%"></textarea>
                </template>
                <template v-else>
                    <div class="data">{{ editedNews.description }}</div>
                </template>
                <div class="edit">
                    <button class="edit-btn" v-if="!editMode.description" @click="startEdit('description')">✎</button>
                </div>
            </div>
            <!-- Date -->
            <div class="case date">
                <div class="title-case">Date</div>
                <template v-if="editMode.date">
                    <input v-model="editedNews.date" @input="onInput" type="date" style="width:100%" />
                </template>
                <template v-else>
                    <div class="data">{{ editedNews.date }}</div>
                </template>
                <div class="edit">
                    <button class="edit-btn" v-if="!editMode.date" @click="startEdit('date')">✎</button>
                </div>
            </div>
            <!-- Photo (media_path) -->
            <div class="case photo">
                <div class="title-case">Photo (media_path)</div>
                <template v-if="editMode.media_path">
                    <input v-model="editedNews.media_path" @input="onInput" style="width:100%"
                        placeholder="Chemin de la photo" />
                </template>
                <template v-else>
                    <div class="data">{{ editedNews.media_path }}</div>
                </template>
                <div class="edit">
                    <button class="edit-btn" v-if="!editMode.media_path" @click="startEdit('media_path')">✎</button>
                </div>
            </div>
            <!-- Vidéo (media_link) -->
            <div class="case video">
                <div class="title-case">Vidéo (media_link)</div>
                <template v-if="editMode.media_link">
                    <input v-model="editedNews.media_link" @input="onInput" style="width:100%"
                        placeholder="Lien vidéo" />
                </template>
                <template v-else>
                    <div class="data">
                        <template
                            v-if="editedNews.media_link && (editedNews.media_link.endsWith('.mp4') || editedNews.media_link.endsWith('.webm'))">
                            <video :src="editedNews.media_link" controls
                                style="max-width:100%; max-height:250px; border-radius:8px; background:#000;" />
                        </template>
                        <template
                            v-else-if="editedNews.media_link && (editedNews.media_link.includes('youtube.com') || editedNews.media_link.includes('youtu.be'))">
                            <iframe :src="getYoutubeEmbedUrl(editedNews.media_link)" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                                style="width:100%; min-height:220px; max-height:300px; border-radius:8px; background:#000;"></iframe>
                        </template>
                        <template v-else>
                            {{ editedNews.media_link }}
                        </template>
                    </div>
                </template>
                <div class="edit">
                    <button class="edit-btn" v-if="!editMode.media_link" @click="startEdit('media_link')">✎</button>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Chargement de l'actualité...</p>
        </div>
        <div v-if="editedNews">
            <div v-if="errorMsg" style="color:red; margin:10px 0">{{ errorMsg }}</div>
            <button @click="cancelEdit" :disabled="!edited || loading" class="cancel-btn">Annuler</button>
            <button @click="saveEdit" :disabled="!edited || loading" class="save-btn">Enregistrer les
                modifications</button>
            <button @click="deleteNews" :disabled="loading" class="delete-btn">Supprimer</button>
        </div>
        <transition name="toast-slide">
            <div v-if="showToast" class="toast-success">
                {{ successMsg }}
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { supabase } from '../../../supabase'
import type { NewsRow as BaseNewsRow } from './AdminNews.vue'

// Utilitaire pour transformer un lien YouTube en URL d'embed
function getYoutubeEmbedUrl(url: string): string {
    if (!url) return '';
    // Gère les liens youtube.com et youtu.be
    let videoId = '';
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
    if (youtubeMatch && youtubeMatch[1]) {
        videoId = youtubeMatch[1];
    } else {
        // Cas fallback : tente d'extraire l'ID après v=
        const vParam = url.match(/[?&]v=([\w-]{11})/);
        if (vParam && vParam[1]) videoId = vParam[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

interface NewsRow extends BaseNewsRow {
    description?: string | null
}

const props = defineProps<{ news: NewsRow | null }>()
const emit = defineEmits(['back', 'updated', 'deleted'])

const editMode = ref<{ [key: string]: boolean }>({})
const edited = ref(false)
const editedNews = ref<NewsRow | null>(null)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const showToast = ref(false)

if (props.news) {
    editedNews.value = { ...props.news }
}
watch(() => props.news, (newNews) => {
    if (newNews) {
        editedNews.value = { ...newNews }
        editMode.value = {}
        edited.value = false
        errorMsg.value = ''
    }
})

const startEdit = (field: keyof NewsRow) => {
    editMode.value[field] = true
}
const cancelEdit = () => {
    if (props.news) {
        editedNews.value = { ...props.news }
        editMode.value = {}
        edited.value = false
        errorMsg.value = ''
        successMsg.value = ''
        showToast.value = false
    }
}
const onInput = () => {
    if (!props.news || !editedNews.value) return
    edited.value =
        props.news.description !== editedNews.value.description ||
        props.news.date !== editedNews.value.date ||
        props.news.media_path !== editedNews.value.media_path ||
        props.news.media_link !== editedNews.value.media_link
}
const saveEdit = async () => {
    if (!props.news || !editedNews.value) return
    loading.value = true
    errorMsg.value = ''
    successMsg.value = ''
    showToast.value = false
    const updatePayload: any = {
        description: editedNews.value.description,
        date: editedNews.value.date,
        media_path: editedNews.value.media_path,
        media_link: editedNews.value.media_link
    }
    const { error } = await supabase
        .from('news')
        .update(updatePayload)
        .eq('id', props.news.id)
    loading.value = false
    if (error) {
        errorMsg.value = `Erreur lors de la sauvegarde : ${error.message}`
        return
    }
    editMode.value = {}
    edited.value = false
    successMsg.value = 'Modifications enregistrées.'
    showToast.value = true
    emit('updated')
    setTimeout(() => { showToast.value = false }, 4000)
}
const deleteNews = async () => {
    if (!props.news) return
    if (!confirm('Voulez-vous vraiment supprimer cette actualité ?')) return
    loading.value = true
    errorMsg.value = ''
    const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', props.news.id)
    loading.value = false
    if (error) {
        errorMsg.value = `Erreur lors de la suppression : ${error.message}`
        return
    }
    emit('deleted')
}
</script>

<style scoped>
h1 {
    font-size: 2.5rem;
    margin: 0;
}

textarea {
    background: rgba(255, 255, 255, 0.1);
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    color: #fff;
    border-radius: 10px;
    padding: 10px;
    font-size: 1rem;
    font-family: inherit;
    height: calc(100% - 40px);
    box-sizing: border-box;
}

.edit-news {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: #fff;
}

.header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
}

.back-btn {
    opacity: 0.6;
    display: block;
    background: rgb(255, 255, 255, 0.3);
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
    aspect-ratio: 1/1;
    width: 5vh;
    margin-top: 10px;
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    font-size: 3vh;
}

.back-btn:hover {
    transition: all 0.2s ease-in-out;
    opacity: 1;
}

.details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 20px;
    flex: 1 1 0%;
    font-size: 1rem;
}

.case {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    font-weight: 300;
    position: relative;
    box-sizing: border-box;
}

.description {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
}

.date {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
}

.photo {
    grid-column: 1 / 2;
    grid-row: 3 / -1;
}

.video {
    grid-column: 2 / 3;
    grid-row: 3 / -1;
}

.title-case {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 10px;
    box-sizing: border-box;
}

.edit-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 1rem;
    color: #fff;
    transition: background 0.2s;
}

.edit-btn:hover {
    background: rgba(255, 255, 255, 0.4);
}

.description {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
}

.cancel-btn,
.save-btn,
.delete-btn {
    background: rgb(255, 255, 255, 0.2);
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 1rem;
    color: #fff;
    transition: background 0.2s;
    margin-right: 10px;
    margin-top: 20px;
}

.cancel-btn:disabled,
.save-btn:disabled,
.delete-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgb(255, 255, 255, 0.1);
    color: #ccc;
}

.cancel-btn:hover:not(:disabled),
.save-btn:hover:not(:disabled),
.delete-btn:hover:not(:disabled) {
    background: rgb(255, 255, 255, 0.4);
}

.toast-success {
    position: fixed;
    top: 30px;
    right: 30px;
    z-index: 9999;
    background: #2ecc40;
    color: #fff;
    padding: 18px 32px;
    border-radius: 8px;
    font-size: 1.1rem;
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);
    min-width: 220px;
    max-width: 90vw;
    opacity: 0.98;
    pointer-events: none;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
    transition: all 0.5s cubic-bezier(.4, 2, .6, 1);
}

.toast-slide-enter-from {
    transform: translateX(120%);
    opacity: 0;
}

.toast-slide-enter-to {
    transform: translateX(0);
    opacity: 1;
}

.toast-slide-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.toast-slide-leave-to {
    transform: translateX(120%);
    opacity: 0;
}
</style>
