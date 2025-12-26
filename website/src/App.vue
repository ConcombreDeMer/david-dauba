<template>

  <NavigationBar />

  <Transition mode="out-in" name="fade">
    <RouterView />
  </Transition>

  <DynamicFooter />

</template>

<script setup lang="ts">

import { RouterView } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'
import DynamicFooter from './components/DynamicFooter.vue'

</script>


<style>

@font-face {
  font-family: 'Roboto';
  src: url('./assets/fonts/Roboto-VariableFont_wdth,wght.ttf') format('woff2');
  font-weight: lighter 200, Light 300, Regular 400, Medium 500, Semibold 600, Bold 700, Extrabold 800, Black 900;
  font-style: normal;
}

@font-face {
  font-family: 'Fairplay Display';
  src: url('./assets/fonts/PlayfairDisplay-VariableFont_wght.ttf') format('woff2');
  font-weight: lighter 200, Light 300, Regular 400, Medium 500, Semibold 600, Bold 700, Extrabold 800, Black 900;
  font-style: normal;
}


@font-face {
  font-family: 'Clash Display';
  src: url('./assets/fonts/ClashDisplay-Variable.ttf') format('woff2');
  font-weight: lighter 200, Light 300, Regular 400, Medium 500, Semibold 600, Bold 700, Extrabold 800, Black 900;
  font-style: normal;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto';
  /* background-color: #262626; */
  background-image: url('/Background.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: #f0f0f0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font-family: 'Roboto', sans-serif;
  font-weight: Medium;
  font-size: 1.2rem;
  color: #f0f0f0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

h1 {
  margin: 0;
  padding: 0;
  font-size: 8vh;
  font-weight: 500;
  font-family: 'Fairplay Display';
}

a {
  color: #ffffff;
  text-decoration: none;
}

p {
  margin: 0;
  padding: 0;
  font-size: 2.5vh;
  font-weight: lighter;
}

.bold {
  font-weight: 500;
}
</style>
