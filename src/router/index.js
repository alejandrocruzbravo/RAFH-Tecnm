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
      path: '/register',
      name: 'register',
      component: () => import('../views/register.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/acercaNosotros.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/contactanos.vue'),
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('../views/precios.vue'),
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
    }
  ],
})

export default router
