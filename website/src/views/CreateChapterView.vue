<template>

    <h1 class="create-chapter-title">Créer un chapitre</h1>

    <form @submit.prevent="createChapter">
        <div>
            <label for="title">Titre :</label>
            <input id="title" v-model="title" required />
        </div>
        <div>
            <label for="date">Date :</label>
            <input id="date" v-model="date" required />
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
            <label>Photos :</label>
            <UploadPhotos
                ref="uploadPhotosRef"
                :chapterId="chapterId ?? undefined"
                :isValidationVisible="false"
            />
        </div>

        <button class="create-chapter-button" type="submit">Créer le chapitre</button>
        <div v-if="message" :class="message.includes('Erreur') ? 'message-container message-error' : 'message-container message-success'">{{ message }}</div>
    </form>


</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../supabase'
import UploadPhotos from '@/components/UploadPhotos.vue';

const title = ref('')
const description = ref('')
const date = ref('')
const message = ref('')
const chapterId = ref<number | null>(null)
const uploadPhotosRef = ref()
const descriptionTextarea = ref<HTMLTextAreaElement | null>(null)

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

const createChapter = async () => {
    const { data, error } = await supabase.from('chapters').insert([
        {
            title: title.value,
            description: description.value,
            date: date.value
        }
    ]).select('id').single();
    if (error) {
        message.value = "Erreur lors de la création du chapitre : " + error.message
    } else if (data && data.id) {
        chapterId.value = data.id;
        message.value = "Chapitre créé avec succès !";
        title.value = '';
        description.value = '';
        date.value = '';
        autoResize();
        // Déclencher l'upload des photos si des fichiers sont sélectionnés
        if (uploadPhotosRef.value && uploadPhotosRef.value.triggerUpload) {
            uploadPhotosRef.value.triggerUpload();
        }
    }
}

</script>

<style scoped>
.create-chapter-title {
    text-align: center;
    padding-top: 150px;
    margin-bottom: 50px;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    margin-top: 20px;
    margin-bottom: 100px;
}

form div {
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

button[type="submit"] {
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

button[type="submit"]:hover {
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