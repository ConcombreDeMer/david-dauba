<template>
    <div :class="['item', { deployed: isDeployed }]">

        <img :src="chapter.firstPhotoUrl" alt="photo du chapitre" class="photo" @click="deployChapter(chapter)" />

        <div class="info">
            <div class="texte">
                <div class="title">
                    {{ chapter.title }}
                </div>
                <p class="description">{{ chapter.description }}</p>
            </div>
            <div class="date">{{ chapter.date }}</div>
            <router-link :to="`/chapter/${chapter.id}`" class="button">
                Découvrir
            </router-link>

        </div>
        <button v-if="isAdmin" class="delete-chapter-btn" @click.stop="deleteChapter(chapter)">Supprimer</button>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import type { ChapterWithPhoto } from '@/views/ChaptersView.vue';
import { isAdmin } from '@/stores/admin';

const isDeployed = ref(false);


const props = defineProps<{
    chapter: ChapterWithPhoto
    isDeployed: boolean
}>();

const deployChapter = (chapter: ChapterWithPhoto) => {
    isDeployed.value = !isDeployed.value;
    if (isDeployed.value) {
        chapter.firstPhotoUrl = chapter.firstPhotoUrl || '/default-chapter-photo.png';
        console.log('Déploiement du chapitre:', chapter.title);
    }
};

// Pour émettre l'événement
// @ts-ignore
const emit = defineEmits(['delete-chapter']);

const deleteChapter = (chapter: ChapterWithPhoto) => {
    emit('delete-chapter', chapter.id);
};


</script>

<style scoped>
.item {
    width: 85vw;
    height: 30vh;
    max-width: 1600px;
    max-height: 800px;
    /* background: #676767;
    background: linear-gradient(90deg, #262626 0%, #262626 30%, #343434 100%); */
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    position: relative;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    opacity: 0.8;

    .delete-chapter-btn {
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

    .delete-chapter-btn:hover {
        background: #d9363e;
    }

    .photo {
        position: absolute;
        width: 40%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px;
        transition: all 0.3s ease-in-out;
        z-index: 90;
    }

    .info {
        position: relative;
        left: 40%;
        width: 60%;
        height: 100%;
        transition: all 0.3s ease-in-out;
        z-index: 2;
    }

    .texte {
        position: relative;
        top: 20px;
        left: 40px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 90%;
    }

    .title {
        position: relative;
        font-size: 4vh;
        font-weight: bold;
        color: #ffffff;
        cursor: pointer;
    }

    .description {
        position: relative;
        width: 100%;
        font-size: 1.5vh;
        color: #c2c2c2;
        font-weight: 100;
    }

    .button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        background-color: #D9D9D9;
        border-radius: 20px;
        padding: 12px 40px;
        color: #212121;
        text-decoration: none;
        font-size: 1.8vh;
        font-weight: 300;
        transition: all 0.3s ease;
        text-align: center;
    }

    .button:hover {
        background-color: #ffffff;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .date {
        position: absolute;
        bottom: 20px;
        left: 40px;
        color: #8a8a8a;
        font-style: italic;
        font-size: 2vh;
        font-weight: 100;

    }
}

.item:hover {
    opacity: 1;
    transform: scale(1.02);
}

@media (max-width: 768px) {
    .item {
        width: 90%;
        margin-left: auto;
        margin-right: auto;
        min-width: unset;
        height: auto;
        min-height: 320px;
        max-height: unset;
        flex-direction: column;
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        background: linear-gradient(180deg, #262626 0%, #262626 30%, #343434 100%);
        opacity: 1;


        .photo {
            position: static;
            width: 100%;
            height: 180px;
            border-radius: 15px 15px 0 0;
            margin-bottom: 0;
        }

        .info {
            position: static;
            left: unset;
            width: 100%;
            height: auto;
            padding: 16px 10px 0 10px;
            box-sizing: border-box;
        }

        .texte {
            position: static;
            top: unset;
            left: unset;
            width: 100%;
            gap: 20px;
            padding: 0;
        }

        .title {
            font-size: 2.2rem;
            text-align: left;
            font-weight: 500;
        }

        .description {
            font-size: 1rem;
            text-align: left;
            font-weight: 300;
        }

        .date {
            position: static;
            margin-top: 20px;
            margin-bottom: 10px;
            left: unset;
            font-size: 1rem;
            text-align: left;
        }

        .button {
            position: static;
            display: block;
            width: 100%;
            margin: 26px 0 0 0;
            padding: 12px 0;
            font-size: 1.1rem;
            border-radius: 12px;
        }

        .delete-chapter-btn {
            position: static;
            display: block;
            width: 95%;
            margin: 26px 0 0 0;
            padding: 12px 0;
            font-size: 1.1rem;
            border-radius: 12px;
        }
    }

    .item:hover {
        opacity: 1;
        transform: scale(1);
    }
}
</style>