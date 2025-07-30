<template>

    <div :class="['chapter-item', { deployed: isDeployed }]">
        <div class="chapter-title">
            <router-link :to="`/chapter/${chapter.id}`" class="chapter-title-texte">
                {{ chapter.title }}
            </router-link>
            <div class="chapter-title-shadow"></div>
        </div>

        <div class="spacing">
        </div>

        <div class="chapter-info">
            <img class="arrow-down" src="../../public/arrow-down.png" alt="" @click="deployChapter(chapter)">
            <template v-if="isDeployed">
                <div class="left">
                    <p class="chapter-description">{{ chapter.description }}</p>
                    <p class="chapter-date">{{ chapter.date }}</p>
                </div>
                <div class="right">
                    <div v-if="chapter.firstPhotoUrl" class="chapter-photo-wrapper">
                        <img :src="chapter.firstPhotoUrl" alt="photo du chapitre" class="chapter-photo" />
                    </div>
                    <button class="chapter-button">Découvrir</button>
                </div>
            </template>
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
.spacing {
    height: 65px;
    width: 100%;
}

.chapter-item {
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
    align-items: end;
}

.chapter-info {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) ease-in-out;
}

.chapter-item.deployed {
    position: relative;
    width: 100%;
    height: 600px;
    transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);


    .chapter-info {
        display: flex;
        justify-content: space-around;
        background: #474747;
        background: linear-gradient(180deg, #2E2E2E 0%, #2E2E2E 10%, #3C3C3C 20%, rgba(79, 79, 79, 1) 100%);
        width: 95%;
        position: relative;
        z-index: 1;
        height: 100%;
        overflow: hidden;
    }

    .arrow-down {
        rotate: 180deg;
    }
}

.chapter-item:not(.deployed) {
    position: relative;
    width: 100%;
    height: 110px;
    transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);


    .chapter-info {
        display: flex;
        justify-content: space-around;
        background: #474747;
        background: linear-gradient(180deg, #2E2E2E 0%, #2E2E2E 100%);
        width: 95%;
        position: relative;
        z-index: 1;
        height: 100%;
        overflow: hidden;

        .chapter-description {
            display: none;
        }

        .chapter-date {
            display: none;
        }

        .chapter-photo-wrapper {
            display: none;
        }
    }

}

.chapter-title {
    display: inline-block;
    width: fit-content;
    height: fit-content;
    background-color: red;
}

.chapter-title-texte {
    position: absolute;
    padding: 0;
    top: 0;
    left: 0;
    font-size: 5rem;
    font-weight: 300;
    color: #bcbcbc;
    text-decoration: none;
    z-index: 2;
}

.chapter-title-texte:hover {
    color: #fff;
}


.chapter-info .arrow-down {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 80px;
    opacity: 0.3;
    transition: all 0.3s ease-in-out;
}

.chapter-info .arrow-down:hover {
    opacity: 1;
    cursor: pointer;
}

.chapter-info .right {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: end;
    width: 40%;
    height: 100%;

    .chapter-photo {
        width: 400px;
        height: 400px;
        object-fit: cover;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.13);
        padding-right: 40px;
    }

    .chapter-button {
        position: absolute;
        right: 40px;
        bottom: 20px;
        background-color: #686868;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
}

.chapter-info .left {
    text-align: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 60%;
    height: 100%;

    .chapter-date {
        color: #bcbcbc;
        position: absolute;
        bottom: 20px;
        left: 20px;
    }

    .chapter-description {
        color: #ffffff;
        padding: 20px;
    }
}
</style>