import { createRouter, createWebHistory } from 'vue-router'
import MostrarLeyendas from '@/views/MostrarLeyendas.vue'
import AgregarLeyenda from '@/views/AgregarLeyenda.vue'
import EditarLeyenda from '@/views/EditarLeyenda.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MostrarLeyendas,
    },
    {
      path: '/crear',
      name: 'crear',
      component: AgregarLeyenda,
    },
    {
      path: '/editar/:id',
      name: 'editar',
      component: EditarLeyenda,
    },
  ],
})

export default router
