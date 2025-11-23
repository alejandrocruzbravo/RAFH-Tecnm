import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   /*
      path: '/',
      name: 'home',
      component: () => import('../views/home/home-view.vue'),
    },*/
    {
      path: '/',
      name: 'login',
      component: () => import('../views/login.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/dashboard-view.vue'),
    },
    {
      path: '/dashboard/:component?',
      name: 'dashboard-component',
      component: () => import('../views/dashboard/dashboard-view.vue'),
      props: true,
    },
    {
      path: '/resguardante',
      name: 'resguardante',
      component: () => import('../layouts/ResguardanteLayout.vue'),
      children: [
        {
          path: '',
          name: 'resguardante-dashboard',
          component: () => import('../views/resguardante/DashboardResguardante.vue'),
        },
        {
          path: 'bienes-asignados',
          name: 'bienes-asignados',
          component: () => import('../views/resguardante/BienesAsignados.vue'),
        },
        {
          path: 'movimientos',
          name: 'movimientos',
          component: () => import('../views/resguardante/Movimientos.vue'),
        },
        {
          path: 'transferencias',
          name: 'transferencias',
          component: () => import('../views/resguardante/Transferencias.vue'),
        },
      ],
    }
  ],
})

export default router
