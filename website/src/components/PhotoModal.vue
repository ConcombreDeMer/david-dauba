<template>
    <transition name="modal-fade">
        <div v-if="show" class="modal-overlay" @click.self="close">
            <button class="modal-arrow left" @click.stop="prev" aria-label="Précédente">&#8592;</button>
            <div class="modal-content">
                <img :src="photo?.url" :alt="photo?.name || 'photo agrandie'" class="modal-photo" @load="onImgLoad" />
                <button class="modal-close" @click="close">✕</button>
            </div>
            <button class="modal-arrow right" @click.stop="next" aria-label="Suivante">&#8594;</button>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
    show: boolean,
    photos: any[],
    selectedIndex: number,
}>()
const emit = defineEmits(['close', 'update:selectedIndex'])

const photo = computed(() => props.photos[props.selectedIndex] || null)
const close = () => emit('close')
const prev = () => {
    if (!props.photos.length) return
    const idx = props.selectedIndex > 0 ? props.selectedIndex - 1 : props.photos.length - 1
    emit('update:selectedIndex', idx)
}
const next = () => {
    if (!props.photos.length) return
    const idx = props.selectedIndex < props.photos.length - 1 ? props.selectedIndex + 1 : 0
    emit('update:selectedIndex', idx)
}
const onImgLoad = (e: Event) => { }
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;
    background: rgba(30, 30, 30, 0.55);
    backdrop-filter: blur(7px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
}

.modal-content {
    position: relative;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 18px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    padding: 0;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: modal-pop 0.25s cubic-bezier(.4, 2, .6, 1) both;
    gap: 16px;
}

.modal-photo {
    max-width: 80vw;
    max-height: 80vh;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
    object-fit: contain;
    background: #fff;
    display: block;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: -50px;
    background: rgba(255, 255, 255, 0.85);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 22px;
    color: rgb(98, 98, 98);
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.13);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    opacity: 0.4;
}

.modal-close:hover {
    transition: all 0.2s ease-in-out;
    opacity: 1;
}

@keyframes modal-pop {
    0% {
        transform: scale(0.85);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-arrow {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.85);
    border: none;
    border-radius: 50%;
    width: 54px;
    height: 54px;
    font-size: 2.2rem;
    color: #333;
    cursor: pointer;
    z-index: 1100;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.13);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    opacity: 0.5;
}

.modal-arrow.left {
    left: 32px;
}

.modal-arrow.right {
    right: 32px;
}

.modal-arrow:hover {
    transition: all 0.2s ease-in-out;
    background: #eaeaea;
    opacity: 0.7;
}
</style>
