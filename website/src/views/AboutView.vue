<template>

    <div class="presentation" id="presentation">

        <PageTitles title="À propos" subtitle="Derrière l'objectif" />


        <div class="left image-bg">
            <img class="home2" src="/home2.png" alt="" />
        </div>

        <div class="right">
            <h1 class="presentation-title">Qui suis-je ?</h1>
            <p class="presentation-text">
                Depuis de nombreuses années, je concentre l'essentiel de mon travail sur les
                <span class="bold">"portraits sans visage"</span>.
                Ce parti pris remet en question notre perception traditionnelle de l'identité dans un monde submergé de
                selfies.
                <br><br>
                Les photos, colorées, parfois drôles, souvent poétiques, témoignent de la vie d'un homme
                <span class="bold">dont le visage n'apparaît jamais</span>.
                Caché, effacé, camouflé, il disparaît pour laisser place à l'absence.
                <br><br>
                Cette approche vise à provoquer une résonance émotionnelle chez le spectateur, l'incitant à
                <span class="bold">une véritable introspection</span>.
                En transcendant la représentation classique du portrait, mon objectif est d'éveiller
                <span class="bold">l'imagination des spectateurs </span>,
                afin de leur permettre de mieux comprendre le message caché derrière ces clichés.
                <br><br>
                David
            </p>
        </div>

    </div>

</template>

<script setup lang="ts">
import PageTitles from '@/components/PageTitles.vue'

</script>

<style scoped>
.presentation {
    width: 80%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 90vh;
    gap: 100px;
    border-radius: 10px;

    .presentation-title {
        margin-bottom: 50px;
    }
}

img {
    height: 100%;
    width: 100%;
    mix-blend-mode: lighten;
}

.left {
    width: 35%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.image-bg {
    box-sizing: border-box;
}

.right {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    border: solid 1px rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    background-color: rgba(255, 255, 255, 0.1);
    padding: 20px;
    box-sizing: border-box;
}

@media (max-width: 900px) {

    .presentation {
        flex-direction: column-reverse;
        margin-top: 80vh;
        gap: 50px;
        width: 80%;
        padding: 20px;
    }

    .left {
        width: 400px;
    }

    .right {
        width: 100%;
        align-items: center;
        text-align: center;
    }

    .presentation-title {
        font-size: 6vh;
    }

    .presentation-text {
        font-size: 2.5vh;
    }


}
</style>