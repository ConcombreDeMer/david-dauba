<template>

    <div class="next" @click="scrollToFormations">
        <slot class="texte">Suivant</slot>
    </div>

</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{ targetSection?: string }>();

function smoothScrollTo(target: HTMLElement, duration: number) {
  const start = window.pageYOffset;
  const end = target.getBoundingClientRect().top + window.pageYOffset;
  const distance = end - start;
  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

function scrollToFormations() {
  const section = props.targetSection ?? 'formations';
  const element = document.getElementById(section);
  if (element) {
    smoothScrollTo(element, 1000);
  }
}
</script>

<style scoped>

.next {
  transition: all 0.3s ease;
  text-align: center;
  z-index: 99999;
  margin: 0;
  padding: 0;
}

.texte{
  text-align: center;
  margin: 0;
  padding: 0;
}


.next:hover {
  cursor: pointer;
}


</style>