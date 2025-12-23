
<template>
    <div class="create-news">
        <h1>Créer une actualité</h1>
        <form class="news-form" @submit.prevent="createNews">
            <div>
                <label for="name">Titre :</label>
                <input id="name" v-model="name" required />
            </div>
            <div>
                <label for="description">Description :</label>
                <textarea
                    id="description"
                    v-model="description"
                    required
                    ref="descriptionTextarea"
                    @input="autoResize"
                    rows="3"
                    style="overflow:hidden;resize:none;"
                ></textarea>
            </div>
            <div>
                <label for="date">Date :</label>
                <input id="date" v-model="date" type="date" required />
            </div>
            <div>
                <label for="mediaLink">Lien média (YouTube, etc) :</label>
                <input id="mediaLink" v-model="mediaLink" type="url" placeholder="https://youtube.com/..." />
            </div>
            <div>
                <label for="media">Photo :</label>
                <label class="upload-label">
                  <input id="media" type="file" accept="image/*" @change="onFileChange" style="display: none;" />
                  <span class="upload-plus">+</span>
                </label>
                <div v-if="mediaPreview" class="preview-list">
                    <div class="preview-item" style="position: relative;">
                        <img :src="mediaPreview" alt="preview" style="max-width:200px;max-height:200px;margin:8px;" />
                        <button v-if="mediaFile" @click="removeMedia" class="remove-photo-btn" title="Supprimer" type="button">×</button>
                    </div>
                </div>
            </div>
            <button class="create-chapter-button" type="submit">Créer l'actualité</button>
            <div v-if="message" :class="message.includes('Erreur') ? 'message-container message-error' : 'message-container message-success'">{{ message }}</div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../supabase'
import imageCompression from 'browser-image-compression'

const name = ref('')
const description = ref('')
const date = ref('')
const message = ref('')
const mediaFile = ref<File|null>(null)
const mediaPreview = ref<string|null>(null)
const descriptionTextarea = ref<HTMLTextAreaElement | null>(null)

const isImage = computed(() => mediaFile.value && mediaFile.value.type.startsWith('image'))
const mediaLink = ref('')

const autoResize = () => {
    const el = descriptionTextarea.value
    if (el) {
        el.style.height = 'auto'
        el.style.height = el.scrollHeight + 'px'
    }
}

onMounted(() => {
    autoResize()
})

const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (!target || !target.files || target.files.length === 0) return
    const file = target.files[0]
    mediaFile.value = file
    if (mediaPreview.value) URL.revokeObjectURL(mediaPreview.value)
    mediaPreview.value = URL.createObjectURL(file)
    target.value = ''
}

const removeMedia = () => {
    if (mediaPreview.value) URL.revokeObjectURL(mediaPreview.value)
    mediaFile.value = null
    mediaPreview.value = null
}

function randomString(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const createNews = async () => {
    message.value = ''
    let media_url = null
    let media_path = null
    let media_link = mediaLink.value || null
    if (mediaFile.value) {
        let fileToUpload = mediaFile.value
        // Compresser l'image
        try {
            fileToUpload = await imageCompression(fileToUpload, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            })
        } catch (err) {
            message.value = "Erreur lors de la compression de l'image."
            return
        }
        const ext = mediaFile.value.name.split('.').pop() || 'jpg'
        const filePath = `${Date.now()}_${randomString(10)}.${ext}`
        const { error: uploadError } = await supabase.storage.from('news-media').upload(filePath, fileToUpload)
        if (uploadError) {
            message.value = "Erreur lors de l'upload de la photo : " + uploadError.message
            return
        }
        const { data: publicUrlData } = supabase.storage.from('news-media').getPublicUrl(filePath)
        media_url = publicUrlData.publicUrl
        media_path = filePath
    }
    const { error } = await supabase.from('news').insert([
        {
            name: name.value,
            description: description.value,
            date: date.value,
            media_url,
            media_path,
            media_link
        }
    ])
    if (error) {
        message.value = "Erreur lors de la création de l'actualité : " + error.message
    } else {
        message.value = "Actualité créée avec succès !"
        name.value = ''
        description.value = ''
        date.value = ''
        mediaLink.value = ''
        removeMedia()
        autoResize()
    }
}
</script>

<style scoped>
.upload-label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    cursor: pointer;
    margin-bottom: 10px;
    transition: all 0.2s;
}
.upload-label:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
}
.upload-plus {
    font-size: 4rem;
    color: rgba(255, 255, 255, 0.6);
    user-select: none;
    font-weight: lighter;
}
.preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}
.preview-item img {
    border-radius: 10px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    border: solid 1px rgba(255, 255, 255, 0.2);
}
.remove-photo-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: all 0.2s;
}
.remove-photo-btn:hover {
    background: rgba(220, 38, 38, 0.8);
}

.create-news {
    width: 80%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 150px;
}

.create-news h1 {
    margin-bottom: 50px;
}

.news-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    margin-top: 10px;
    margin-bottom: 100px;
    width: 100%;
}

.news-form div {
    width: 50vw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

input,
textarea {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    background: rgba(255, 255, 255, 0.1);
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    outline: none;
    color: #fff;
    font-size: 1.5rem;
    font-family: inherit;
    font-weight: 300;
    border-radius: 10px;
    padding: 10px 16px;
    margin-top: 4px;
    transition: border 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
}

input::placeholder,
textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

input:focus,
textarea:focus {
    border: solid 1.5px #fff;
    background: rgba(255, 255, 255, 0.18);
    box-shadow: 0 0 0 2px #00000033;
}

label {
    font-weight: normal;
    margin-bottom: 8px;
    font-size: 1.5rem;
    display: block;
}

.create-chapter-button {
    margin-top: 16px;
    border: none;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    color: #fff;
    font-size: 1.5rem;
    font-family: inherit;
    font-weight: 300;
    cursor: pointer;
    transition: all 0.2s;
    width: 50vw;
    height: 60px;
}

.create-chapter-button:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
}

.message-container {
    margin-top: 16px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 1rem;
    text-align: center;
    width: 50vw;
    box-sizing: border-box;
}

.message-error {
    background: rgba(220, 38, 38, 0.15);
    border: solid 1px rgba(220, 38, 38, 0.3);
    color: #ff9b9b;
}

.message-success {
    background: rgba(34, 197, 94, 0.15);
    border: solid 1px rgba(34, 197, 94, 0.3);
    color: #86efac;
}
</style>