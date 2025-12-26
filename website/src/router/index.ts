import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminProducts from '../components/admin/AdminProducts.vue'

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
      path: '/create-product',
      name: 'create-product',
      component: () => import('../components/CreateProduct.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      redirect: '/admin/chapters',
      children: [
        {
          path: 'chapters',
          name: 'admin-chapters',
          component: () => import('../components/admin/AdminChapters.vue')
        },
        {
          path: 'news',
          name: 'admin-news',
          component: () => import('../components/admin/AdminNews.vue')
        },
        {
          path: 'products',
          name: 'admin-products',
          component: AdminProducts
        }
      ]
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
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsView.vue')
    },
    {
      path: '/create-news',
      name: 'create-news',
      component: () => import('../views/CreateNewsView.vue')
    }
    ,
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../views/ShopView.vue')
    }
      ,
      {
        path: '/product/:id',
        name: 'product-detail',
        component: () => import('../components/ProductPage.vue')
      }
  ],
})

// Scroll vers le haut au changement de route
router.afterEach(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
})

export default router
