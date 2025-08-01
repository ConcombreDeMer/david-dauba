<template>

    <div :class="['chapter-item', { deployed: isDeployed }]">
        <div class="chapter-title">
            <div class="chapter-title-texte" @click="deployChapter(chapter)">
                {{ chapter.title }}
            </div>
            <div class="chapter-title-shadow"></div>
        </div>

        <div class="spacing">
        </div>

        <div :class="['chapter-info', { deployed: isDeployed }]">
            <img class="arrow-down" src="../../public/arrow-down.png" alt="" @click="deployChapter(chapter)">
            <div class="dropdown">
                <div class="left">
                    <p class="chapter-description">{{ chapter.description }}</p>
                    <p class="chapter-date">{{ chapter.date }}</p>
                </div>
                <div class="right">
                    <div v-if="chapter.firstPhotoUrl" class="chapter-photo-wrapper">
                        <img :src="chapter.firstPhotoUrl" alt="photo du chapitre" class="chapter-photo" />
                    </div>
                    <router-link :to="`/chapter/${chapter.id}`" class="chapter-button">
                        Découvrir
                    </router-link>
                </div>
            </div>
        </div>
    </div>


</template>


<script setup lang="ts">
import { ref } from 'vue';
import type { ChapterWithPhoto } from '@/views/ChaptersView.vue';

const isDeployed = ref(false);


const props = defineProps<{
    chapter: ChapterWithPhoto
    isDeployed: boolean
}>();

const deployChapter = (chapter: ChapterWithPhoto) => {
    isDeployed.value = !isDeployed.value;
    if (isDeployed.value) {
        chapter.firstPhotoUrl = chapter.firstPhotoUrl || '/default-chapter-photo.png'; // Default photo if none exists
        console.log('Déploiement du chapitre:', chapter.title);
    }
};


</script>

<style scoped>
.chapter-item {
    width: 70vw;
    position: relative;
    margin-bottom: 70px;
}

.chapter-title {
    font-size: 6vh;
    font-weight: lighter;
    position: absolute;
    top: -35px;
    left: 0px;
    z-index: 10;
    color: #b1b1b1;
    transition: all 0.3s ease-in-out;
    /* rendre le texte non selectionnable */
    user-select: none;

}

.chapter-title:hover {
    cursor: pointer;
    color: #ffffff;
    font-weight: 300;
}

.chapter-info:not(.deployed) {

    .arrow-down {
        rotate: 0deg;
    }

    .dropdown {
        height: 0px;
        padding-top: 0px;
    }

}


.chapter-info {
    background: #676767;
    background: linear-gradient(90deg, #292929 0%, #4E4E4E 100%);
    position: relative;
    margin-left: auto;
    padding-top: 70px;
    width: 95%;
    height: fit-content;
    overflow: hidden;
    opacity: 1;
    transition: all 0.3s ease-in-out;

    .arrow-down {
        width: 70px;
        height: 70px;
        cursor: pointer;
        position: absolute;
        top: 0px;
        right: 0px;
        rotate: 180deg;
        transition: all 0.3s ease-in-out;
        opacity: 0.3;
        z-index: 90;
    }

    .arrow-down:hover {
        transform: scale(1.1);
        opacity: 1;
    }

    .dropdown {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 450px;
        overflow: hidden;
        transition: all 0.3s ease-in-out;

        .left {
            width: 60%;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: center;
            height: 100%;
            gap: 50px;
            transition: all 0.3s ease-in-out;

        }

        .right {
            width: 40%;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: end;
            justify-content: center;
            gap: 50px;
            transition: all 0.3s ease-in-out;

            img {
                width: 300px;
                height: 300px;
                object-fit: cover;
            }

            .chapter-button {
                background-color: #676767;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                transition: all 0.3s ease-in-out;
                font-size: 2.5vh;
            }

            .chapter-button:hover {
                background-color: #8d8d8d;
            }
        }
    }

}


@media (max-width: 900px) {

    .chapter-item {
        width: 90vw;
        margin-bottom: 40px;
    }

    .chapter-title {
        font-size: 4vh;
        top: -20px;
    }

    .chapter-info {
        padding-top: 50px;
        height: auto;

        .arrow-down {
            width: 50px;
            height: 50px;
        }

        .dropdown {
            flex-direction: column;
            align-items: center;
            height: 700px;

            .left, .right {
                width: 90%;
                padding: 10px;
                align-items: center;
                justify-content: center;
                position: relative;
                margin: 0;
                padding: 0;
            }


            .right {
                font-size: 2vh;
                height: fit-content;
                padding: 20px;
            }

        }
    }

    .chapter-description {
        font-size: 2vh;
    }
    
    .chapter-date {
        display: none;
    }
}


</style>