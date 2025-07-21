<template>

    <NavigationBar />

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
                rows="1"
                style="overflow:hidden;resize:none;"
            ></textarea>
        </div>

        <UploadPhotos
            ref="uploadPhotosRef"
            :chapterId="chapterId ?? undefined"
            :isValidationVisible="false"
        />

        <button class="create-chapter-button" type="submit">Créer le chapitre</button>
        <div v-if="message">{{ message }}</div>
    </form>


</template>

<script setup lang="ts">

import NavigationBar from '@/components/NavigationBar.vue';
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
    padding-top: 200px;
}
</style>
<style scoped>
.create-chapter-title {
    text-align: center;
    padding-top: 100px;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    margin-top: 50px;
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

button[type="submit"] {
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

button[type="submit"]:hover {
    background: #0056b3;
}
</style>