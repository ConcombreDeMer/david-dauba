<template>
    <div class="edit-chapter">
        <div class="header">
            <button class="back-btn" @click="emit('back')">←</button>
            <h1>{{ editedChapter?.title || 'Chapitre' }}</h1>
        </div>
        <div v-if="editedChapter" class="details">
            <!-- Description -->
            <div class="case description">
                <div class="title-case">Description</div>
                <template v-if="editMode.description">
                    <textarea v-model="editedChapter.description" @input="onInput" rows="4"
                        style="width:100%"></textarea>
                </template>
                <template v-else>
                    <div class="data">{{ editedChapter.description }}</div>
                </template>
                <div class="edit">
                    <button class="edit-btn" v-if="!editMode.description" @click="startEdit('description')">✎</button>
                </div>
            </div>
            <!-- Status -->
            <div class="case status">
                <div class="title-case">Status</div>
                <template v-if="editMode.status">
                    <input v-model="editedChapter.status" @input="onInput" style="width:100%" />
                </template>
                <template v-else>
                    <div class="data">{{ editedChapter.status }}</div>
                </template>
                <div class="edit">
                    <button class="edit-btn" v-if="!editMode.status" @click="startEdit('status')">✎</button>
                </div>
            </div>
            <!-- Date -->
            <div class="case date">
                <div class="title-case">Date</div>
                <template v-if="editMode.date">
                    <input v-model="editedChapter.date" @input="onInput" type="date" style="width:100%" />
                </template>
                <template v-else>
                    <div class="data">{{ editedChapter.date }}</div>
                </template>
                <div class="edit">
                    <button class="edit-btn" v-if="!editMode.date" @click="startEdit('date')">✎</button>
                </div>
            </div>
            <!-- Photos (refactor: composant séparé) -->
            <AdminChapterPhotos v-if="editedChapter" :chapterId="editedChapter.id" :editMode="!!editMode.photos"
                @start-edit="() => startEdit('photos')" @close-edit="() => { editMode.photos = false }"
                @change="onPhotosChange" />
        </div>
        <div v-else>
            <p>Chargement du chapitre...</p>
            <pre style="color:red; background:#222; padding:1em; margin-top:1em;">
        props.chapter: {{ JSON.stringify(props.chapter, null, 2) }}
        editedChapter: {{ JSON.stringify(editedChapter, null, 2) }}
    </pre>
        </div>
        <div v-if="editedChapter">
            <div v-if="errorMsg" style="color:red; margin:10px 0">{{ errorMsg }}</div>
            <button @click="cancelEdit" :disabled="!edited || loading" class="cancel-btn">Annuler</button>
            <button @click="saveEdit" :disabled="!edited || loading" class="save-btn">Enregistrer les
                modifications</button>
        </div>

        <!-- Toast de succès -->
        <transition name="toast-slide">
            <div v-if="showToast" class="toast-success">
                {{ successMsg }}
            </div>
        </transition>
    </div>
</template>


<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { supabase } from '../../../supabase'
import type { ChapterRow } from './AdminChapters.vue'
import AdminChapterPhotos from './AdminChapterPhotos.vue'

const props = defineProps<{ chapter: ChapterRow | null }>()
const emit = defineEmits(['back'])

// Champs éditables
const editMode = ref<{ [key: string]: boolean }>({})
const edited = ref(false)
const editedChapter = ref<ChapterRow | null>(null)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const showToast = ref(false)
const photosLoading = ref(false)
// Pour suivre les changements de photos
const photosChanged = ref(false)
let photosToDelete: number[] = []
let photosToAdd: File[] = []



// Initialiser les valeurs éditées à chaque changement de chapitre
if (props.chapter) {
    editedChapter.value = { ...props.chapter }
}
watch(() => props.chapter, async (newChapter) => {
    if (newChapter) {
        editedChapter.value = { ...newChapter }
        editMode.value = {}
        edited.value = false
        errorMsg.value = ''
        // Les photos sont maintenant gérées dans le composant AdminChapterPhotos
    }
})



const startEdit = (field: keyof ChapterRow | 'photos') => {
    editMode.value[field] = true
}

let clearNewPhotos: (() => void) | null = null
const cancelEdit = () => {
    if (props.chapter) {
        editedChapter.value = { ...props.chapter }
        editMode.value = {}
        edited.value = false
        errorMsg.value = ''
        successMsg.value = ''
        showToast.value = false
        if (clearNewPhotos) clearNewPhotos()
    }
}

const onInput = () => {
    // Vérifie si une modif a été faite
    if (!props.chapter || !editedChapter.value) return
    edited.value =
        props.chapter.title !== editedChapter.value.title ||
        props.chapter.description !== editedChapter.value.description ||
        props.chapter.status !== editedChapter.value.status ||
        props.chapter.date !== editedChapter.value.date ||
        photosChanged.value
}

// Callback pour les changements de photos
const onPhotosChange = ({ hasPhotoChange, toDelete, toAdd, clearNewPhotos: clearFn }: { hasPhotoChange: boolean, toDelete: number[], toAdd: File[], clearNewPhotos?: () => void }) => {
    photosChanged.value = hasPhotoChange
    photosToDelete = toDelete
    photosToAdd = toAdd
    clearNewPhotos = clearFn || null
    onInput()
}

const saveEdit = async () => {
    if (!props.chapter || !editedChapter.value) return
    loading.value = true
    errorMsg.value = ''
    successMsg.value = ''
    showToast.value = false
    // Vérifie le format de la date (YYYY-MM-DD)
    const updatePayload: any = {
        title: editedChapter.value.title,
        description: editedChapter.value.description,
        status: editedChapter.value.status
    }
    // Ajoute la date seulement si elle est au bon format
    if (editedChapter.value.date && /^\d{4}-\d{2}-\d{2}$/.test(editedChapter.value.date)) {
        updatePayload.date = editedChapter.value.date
    }

    // 1. Suppression des photos marquées
    if (photosToDelete.length > 0) {
        for (const photoId of photosToDelete) {
            // Récupère l'info de la photo pour supprimer du storage
            const { data: photoData, error: fetchError } = await supabase
                .from('photos')
                .select('*')
                .eq('id', photoId)
                .single()
            if (fetchError) {
                errorMsg.value = `Erreur récupération photo à supprimer: ${fetchError.message}`
                loading.value = false
                return
            }
            // Supprime du storage
            if (photoData && photoData.path) {
                const { error: storageError } = await supabase.storage.from('photos').remove([photoData.path])
                if (storageError) {
                    errorMsg.value = `Erreur suppression storage: ${storageError.message}`
                    loading.value = false
                    return
                }
            }
            // Supprime de la table
            const { error: dbError } = await supabase
                .from('photos')
                .delete()
                .eq('id', photoId)
            if (dbError) {
                errorMsg.value = `Erreur suppression table: ${dbError.message}`
                loading.value = false
                return
            }
        }
    }

    // 2. Upload des nouvelles photos
    if (photosToAdd.length > 0) {
        for (const file of photosToAdd) {
            // Génère un nom unique
            const fileExt = file.name.split('.').pop()
            const fileName = `chapter_${props.chapter.id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
            const filePath = `${props.chapter.id}/${fileName}`
            // Upload dans le storage
            const { data: uploadData, error: uploadError } = await supabase.storage.from('photos').upload(filePath, file)
            if (uploadError) {
                errorMsg.value = `Erreur upload photo: ${uploadError.message}`
                loading.value = false
                return
            }
            // Récupère l'URL publique
            const { data: publicUrlData } = supabase.storage.from('photos').getPublicUrl(filePath)
            // Ajoute dans la table
            const { error: insertError } = await supabase
                .from('photos')
                .insert({
                    chapter_id: props.chapter.id,
                    url: publicUrlData?.publicUrl || '',
                    path: filePath,
                })
            if (insertError) {
                errorMsg.value = `Erreur insertion table: ${insertError.message}`
                loading.value = false
                return
            }
        }
    }

    // 3. Update du chapitre (texte, etc)
    const { error, status, statusText } = await supabase
        .from('chapters')
        .update(updatePayload)
        .eq('id', props.chapter.id)
    loading.value = false
    if (error) {
        errorMsg.value = `Erreur lors de la sauvegarde : ${error.message || ''} (status ${status || ''} ${statusText || ''})`
        return
    }
    // Reset local
    editMode.value = {}
    edited.value = false
    photosChanged.value = false
    photosToDelete = []
    photosToAdd = []
    if (clearNewPhotos) clearNewPhotos()
    successMsg.value = 'Modifications enregistrées.'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 5000)
}


</script>

<style scoped>
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


.edit-chapter {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .header {
        display: flex;
        justify-content: left;
        align-items: center;
        gap: 20px;
        margin: 0;
        padding: 0;
        margin-bottom: 20px;

        h1 {
            margin: 0;
            padding: 0;
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
    }

    .details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 20px;
        overflow: hidden;
        box-sizing: border-box;
        flex: 1 1 0%;
        height: 100%;
        font-size: 1rem;

        .case {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 10px;
            border: solid 1px rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            font-weight: 300;
            position: relative;
            box-sizing: border-box;

            .title-case {
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 10px;
                height: 30px;
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
        }

        .description {
            grid-column: 1 / 2;
            grid-row: 1 / 3;
            overflow: hidden;
            width: 100%;
            max-width: 100%;
        }

        .status {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
        }

        .date {
            grid-column: 2 / 3;
            grid-row: 2 / 3;
        }

        .photos {
            grid-column: 1 / -1;
            grid-row: 3 / -1;
            overflow-y: auto;
            max-height: 100%;
            transition: all 0.4s cubic-bezier(.4, 2, .6, 1);
        }

        .photos-edit {
            grid-column: 1 / 3 !important;
            grid-row: 1 / 5 !important;
            z-index: 99;
            background: rgb(76, 76, 76);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
            transition: all 0.4s cubic-bezier(.4, 2, .6, 1);
        }

        .close-photos-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgb(255, 255, 255, 0.3);
            color: #fff;
            border-radius: 10px;
            border: solid 1px rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 4px 10px 4px 10px;
            z-index: 10;
            transition: background 0.2s;
        }

        .close-photos-btn:hover {
            background: rgb(255, 255, 255, 0.5);
            color: #222;
        }

        .photo-list-admin {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 8px;
            margin-bottom: 8px;
            align-items: center;
            max-height: 220px;
            padding-right: 4px;
            transition: max-height 0.4s cubic-bezier(.4, 2, .6, 1);
        }

        .photo-list-admin-large {
            max-height: 70vh;
            gap: 24px;
        }

        .photo-thumb-admin {
            width: 70px;
            height: 70px;
            border-radius: 8px;
            overflow: hidden;
            background: #222;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.13);
            transition: all 0.3s cubic-bezier(.4, 2, .6, 1);
        }

        .photo-thumb-admin-large {
            width: 120px;
            height: 120px;
        }

        .photo-thumb-admin img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

    }

    .cancel-btn,
    .save-btn {
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
    .save-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: rgb(255, 255, 255, 0.1);
        color: #ccc;
    }

    .cancel-btn:hover:not(:disabled),
    .save-btn:hover:not(:disabled) {
        background: rgb(255, 255, 255, 0.4);
    }

    .error-msg {
        color: red;
        margin: 10px 0;
    }

    .data {
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        width: 100%;
        height: calc(100% - 40px);
        max-width: 100%;
        box-sizing: border-box;
    }
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

.toast-slide-enter-active {
    transition: all 0.5s cubic-bezier(.4, 2, .6, 1);
}

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
