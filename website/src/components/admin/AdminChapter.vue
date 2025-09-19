<template>
    <div class="edit-chapter">
        <div class="header">
            <button class="back-btn" @click="$emit('back')">←</button>
            <h1>{{ chapter ? chapter.title : 'Chapitre' }}</h1>
        </div>
        <div v-if="chapter">
            <p>Date : {{ chapter.date }}</p>
            <p>Nombre de photos : {{ chapter.nbPhotos }}</p>
            <p>Status : {{ chapter.status }}</p>
            <!-- Ajoute ici ton formulaire d'édition -->
        </div>
        <div v-else>
            <p>Chargement du chapitre...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { ChapterRow } from './AdminChapters.vue'

defineProps<{ chapter: ChapterRow | null }>()
defineEmits(['back'])
</script>

<style scoped>

.edit-chapter {
    width: 100%;
    height: 100%;
}

h1 {
    margin: 0;
    padding: 0;
}


.header {
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 20px;
    margin: 0;
    padding: 0;
}


.back-btn {
    opacity: 0.6;
    display: block;
    background: rgb(255, 255, 255, 0.3);
    color: #fff;
    border-radius: 5px;
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
</style>
