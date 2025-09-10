import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chapter/:id',
      name: 'chapter',
      component: () => import('../views/ChapterView.vue')
    },
    {
      path: '/create-chapter',
      name: 'create-chapter',
      component: () => import('../views/CreateChapterView.vue')
    },
    {
      path: '/edit-chapter',
      name: 'edit-chapter',
      component: { template: '<div><h1>Modifier un chapitre (à implémenter)</h1></div>' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/password',
      name: 'password',
      component: () => import('../views/PasswordView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/chapters',
      name: 'chapters',
      component: () => import('../views/ChaptersView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ],
})

export default router
