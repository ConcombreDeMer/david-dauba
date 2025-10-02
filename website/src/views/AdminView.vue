<template>
  <div class="admin-view">
    <div class="admin-panel">
      <div class="sidebar">
        <div class="top" style="position:relative;">
          <div class="sidebar-slider" :style="sliderStyle"></div>
          <RouterLink v-for="btn in buttons" :key="btn.to" :to="btn.to" class="sidebar-top-button"
            :class="{ active: isActive(btn.to) }">
            <span class="sidebar-icon-stack">
              <img :src="btn.icon" :alt="btn.label + ' icon black'" class="sidebar-icon sidebar-icon-black"
                :class="{ visible: isActive(btn.to) }" />
              <img :src="btn.icon.replace('black.png', 'white.png')" :alt="btn.label + ' icon white'"
                class="sidebar-icon sidebar-icon-white" :class="{ visible: !isActive(btn.to) }" />
            </span>
            <div>
              {{ btn.label }}
            </div>
          </RouterLink>
        </div>
        <div class="bottom">
          <div class="line"></div>
          <RouterLink class="sidebar-bottom-button site" to="/">
            Retour au site
          </RouterLink>
          <RouterLink class="sidebar-bottom-button logout" to="/logout">Se déconnecter</RouterLink>
        </div>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const buttons = [
  { to: '/admin', label: 'Dashboard', icon: '/admin/sidebar/dashboard/black.png' },
  { to: '/admin/chapters', label: 'Chapitres', icon: '/admin/sidebar/chapters/black.png' },
  { to: '/admin/news', label: 'Actualités', icon: '/admin/sidebar/news/black.png' },
  { to: '/admin/contact', label: 'Contacts', icon: '/admin/sidebar/contact/black.png' },
];

const BUTTON_HEIGHT = 70; // hauteur du bouton + margin-bottom (15+10+30)
const BUTTON_MARGIN = 10;

const activeIndex = computed(() => buttons.findIndex(b => b.to === route.path));

const sliderStyle = computed(() => {
  return {
    transform: `translateY(${activeIndex.value * (BUTTON_HEIGHT + BUTTON_MARGIN)}px)`
  };
});

function isActive(to: string) {
  return route.path === to;
}
</script>

<style scoped>
.admin-view {
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  position: relative;
}

.admin-panel {
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: 90%;
  height: 80%;
  max-width: 2000px;
  max-height: 1500px;
  margin-top: 120px;
  left: 50%;
  transform: translate(-50%);
  background-image: url('/admin/panel-background.png');
  background-size: cover;
  border-radius: 10px;
  border: solid 1px rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  overflow: hidden;
}

.sidebar {
  position: fixed;
  top: 50%;
  left: 2%;
  transform: translateY(-50%);
  width: 20%;
  height: calc(100% - 7%);
  background-image: url('/admin/sidebar-background2.png');
  background-size: cover;
  border-radius: 10px;
  border: solid 1px rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  box-sizing: border-box;
  padding: 20px;


  .sidebar-top-button {
    display: flex;
    align-items: center;
    justify-content: left;
    width: 100%;
    height: 70px;
    margin-bottom: 10px;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 10%;
    padding-right: 10%;
    box-sizing: border-box;
    border-radius: 10px;
    text-align: center;
    text-decoration: none;
    color: #D3D3D3;
    font-size: 2vh;
    font-weight: 500;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    box-sizing: border-box;
  }

  .sidebar-icon-stack {
    position: relative;
    display: inline-block;
    width: 28px;
    height: 28px;
    margin-right: 20px;
    box-sizing: border-box;
  }

  .sidebar-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 28px;
    height: 28px;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(.4, 1.3, .6, 1);
    pointer-events: none;
    /* Optionally, add filter/blur for extra smoothness */
  }

  .sidebar-icon.visible {
    opacity: 0.7;
    pointer-events: auto;
  }

  .sidebar-slider {
    position: absolute;
    left: 0;
    width: 100%;
    height: 70px;
    background: linear-gradient(135deg, #FFFFFF 0%, #afafaf 100%);
    border-radius: 10px;
    z-index: 0;
    transition: transform 0.35s cubic-bezier(.4, 1.3, .6, 1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
    top: 0;
    pointer-events: none;
    border: solid 1px rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }

  .sidebar-top-button.active {
    color: #4C4C4C;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
    z-index: 1;
    animation: sidebarActiveAnim 0.4s;
  }

  @keyframes sidebarActiveAnim {
    0% {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    100% {
      background: white;
      color: #222;
    }
  }

  .top{
    height: 70%;
  }

  .bottom {
    height: fit-content;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 10px;


    .line {
      width: 100%;
      height: 1px;
      background: rgb(174, 174, 174);
      margin-bottom: 20px;
    }

    .sidebar-bottom-button {
      width: 100%;
      height: 50px;
      padding: 10px;
      box-sizing: border-box;
      margin-bottom: 10px;
      border-radius: 10px;
      text-align: center;
      text-decoration: none;
      color: #D3D3D3;
      font-size: 2vh;
      font-weight: 500;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease-in-out;
      border: solid 1px rgba(255, 255, 255, 0.2);
      box-sizing: border-box;

    }

    .sidebar-bottom-button:hover {
      color: white;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
      z-index: 1;
    }

    .logout:hover {
      background: rgba(214, 101, 101, 0.783);
    }

    .site:hover {
      background: rgba(11, 11, 11, 0.783);
    }
  }

}

.content {
  margin-left: calc(20% + 2%);
  width: calc(80% - 2%);
  padding: 2%;
  box-sizing: border-box;
}
</style>
