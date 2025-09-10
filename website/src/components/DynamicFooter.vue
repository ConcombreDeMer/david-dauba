<template>


    <div v-if="isHome" class="footer">
        <img class="footer-image" src="/footer.png" alt="">
    </div>
    <div v-else class="alternative-footer">
        <div class="footer-content">
            <div class="footer-reseaux">
                <a href="https://www.instagram.com/david_dauba_noface/"><img class="footer-insta" src="/instagram.png" alt=""></a>
                <a href="https://x.com"><img class="footer-x" src="/X.png" alt=""></a>
            </div>
            <p>© 2023 David Dauba</p>
        </div>
    </div>
</template>


<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
const route = useRoute();
const isHome = computed(() => route.path === '/');
</script>

<style scoped>
.footer {
    position: relative;
    width: 100%;
    padding: 0;
    margin: 0;
    mix-blend-mode: lighten;
}

.footer-image {
    width: 100%;
    height: auto;
}


.alternative-footer {
    position: relative;
    width: 100%;
    height: 150px;
    margin-top: 150px;
    color: #fff;
    text-align: center;
}

.footer-reseaux {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.footer-insta {
    width: 38px;
    height: 38px;
    margin: 0 10px;
    opacity: 0.7;
    transition: all 0.3s ease-in-out;

}

.footer-x {
    width: 30px;
    height: 30px;
    margin: 0 10px;
    opacity: 0.7;
    transition: all 0.3s ease-in-out;

}

.footer-insta:hover,
.footer-x:hover {
    transform: scale(1.1);
    opacity: 1;
}
</style>