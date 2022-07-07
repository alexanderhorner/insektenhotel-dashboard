import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: {
        account: "Bayernlab1"
      }
    },
    {
      path: '/demo',
      component: HomeView,
      props: {
        account: "Insektenhotel2"
      }
    },
    {
      path: '/bayernlab1',
      component: HomeView,
      props: {
        account: "Bayernlab1"
      }
    },
  ]
})

export default router
