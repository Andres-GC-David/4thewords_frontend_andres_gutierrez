import { createRouter, createWebHistory } from 'vue-router'
import MostrarLeyendas from '@/views/MostrarLeyendas.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MostrarLeyendas,
    },
  ],
})

export default router
