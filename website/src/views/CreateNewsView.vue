
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
                    rows="1"
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
            <div v-if="message" style="margin-top:10px;">{{ message }}</div>
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
/* Ajout du style d'upload de UploadPhotos.vue */
.upload-label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70px;
    border-radius: 8px;
    background: #4E4E4E;
    cursor: pointer;
    margin-bottom: 10px;
}
.upload-label:hover {
    background-color: #525252;
    transition: all 0.2s ease-in-out;
}
.upload-plus {
    font-size: 5rem;
    color: #888;
    user-select: none;
    font-weight: lighter;
}
.preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.preview-item img {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.remove-photo-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0,0,0,0.6);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: background 0.2s;
}
.remove-photo-btn:hover {
    background: #e74c3c;
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
    margin-top: 200px;
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
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    background: transparent;
    border: none;
    border-bottom: 1px solid #646464;
    outline: none;
    color: inherit;
    font-size: 1.5rem;
    font-family: inherit;
    font-weight: 300;
    padding: 8px 0 4px 0;
    margin-top: 4px;
    transition: border-color 0.2s;
}

input:focus,
textarea:focus {
    border-bottom: 1px solid #ffffff;
}

label {
    font-weight: normal;
    margin-bottom: 2px;
    font-size: 2rem;
}

.create-chapter-button {
    margin-top: 16px;
    padding: 10px 32px;
    border: none;
    border-radius: 4px;
    background: #4E4E4E;
    color: #fff;
    font-size: 2rem;
    font-family: inherit;
    font-weight: lighter;
    cursor: pointer;
    transition: background 0.2s;
    width: 50vw;
    height: 70px;
}

.create-chapter-button:hover {
    background: #0056b3;
}
</style>