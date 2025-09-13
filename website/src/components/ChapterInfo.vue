<template>

    <!-- <div :class="['chapter-item', { deployed: isDeployed }]">
        <div class="chapter-title">
            <div class="chapter-title-texte" @click="deployChapter(chapter)">
                {{ chapter.title }}
            </div>
            <div class="chapter-title-shadow"></div>
        </div>

        <div class="spacing">
        </div>

        <div :class="['chapter-info', { deployed: isDeployed }]" @click="deployChapter(chapter)">
            <img class="arrow-down" src="../../public/arrow-down.png" alt="">
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
    </div> -->


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
        chapter.firstPhotoUrl = chapter.firstPhotoUrl || '/default-chapter-photo.png';
        console.log('Déploiement du chapitre:', chapter.title);
    }
};


</script>

<style scoped>
.item {
    width: 85vw;
    height: 30vh;
    max-width: 1600px;
    max-height: 800px;
    background: #676767;
    background: linear-gradient(90deg, #262626 0%, #262626 30%, #343434 100%);
    border-radius: 20px;
    position: relative;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    opacity: 0.8;

    .photo {
        position: absolute;
        width: 40%;
        height: 100%;
        object-fit: cover;
        border-radius: 15px;
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
        transition: all 0.3s ease;
        text-align: center;
        font-weight: lighter;
    }

    .button:hover {
        background-color: #f8f8f8;
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

/* .item:not(.deployed) {
    width: 85vw;
    height: 30vh;
    max-width: 1200px;
    max-height: 800px;
    background: #676767;
    background: linear-gradient(90deg, #262626 0%, #262626 30%, #343434 100%);
    border-radius: 20px;
    position: relative;
    transition: all 0.3s ease-in-out;

    .photo {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px;
        transition: all 0.3s ease-in-out;
        z-index: 90;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
        cursor: pointer;
    }

    .info {
        position: relative;
        left: 35%;
        width: 65%;
        height: 100%;
        transition: all 0.3s ease-in-out;
        z-index: 2;

    }

    .title {
        position: relative;
        top: 20px;
        left: 20px;
        font-size: 5vh;
        font-weight: bold;
        color: #ffffff;
        cursor: pointer;
    }

    .title-undeployed {
        position: absolute;
        text-align: center;
        top: 50%;
        transform: translate(0%, -50%);
        width: 100%;
        font-size: 5vh;
        font-weight: bold;
        color: #ffffff;
        z-index: 100;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        user-select: none;
        opacity: 1;
    }

    .description {
        position: relative;
        width: 90%;
        top: 40px;
        left: 20px;
        margin-top: 20px;
        font-size: 2vh;
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
        font-size: 1.5rem;
        transition: all 0.3s ease;
        text-align: center;
        font-weight: lighter;
    }

    .button:hover {
        background-color: #f8f8f8;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .date {
        position: absolute;
        bottom: 20px;
        left: 40px;
        color: #ededed;
        font-weight: 100;

    }



} */






/* .chapter-item {
    width: 70vw;
    position: relative;
    margin-bottom: 70px;
    transition: all 0.3s ease-in-out;

}

.chapter-item:hover {
    cursor: pointer;
}

.chapter-item:hover .chapter-info {
    opacity: 1;
}

.chapter-item:hover .chapter-title {
    color: #ffffff;
    font-weight: 300;
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
    opacity: 0.8;
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

            .left,
            .right {
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
} */
</style>