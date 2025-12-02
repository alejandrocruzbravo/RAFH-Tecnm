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
      path: '/centros',
      name: 'centros',
      component: () => import('../views/CentrosTrabajo.vue'),
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
router.beforeEach((to, from, next) => {
  // 1. Obtener usuario almacenado
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAuthenticated = !!localStorage.getItem('auth_token');

  // 2. Si la ruta requiere autenticación y no hay token, mandar al login
  // (Asegúrate de que tus rutas tengan meta: { requiresAuth: true })
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  // 3. LÓGICA DE ROLES (Protección real)
  if (isAuthenticated && user) {
    
    // CASO RESGUARDANTE (Rol 3)
    if (user.usuario_id_rol === 3) {
      // Si intenta entrar al Dashboard general o rutas de admin
      // (Asumiendo que '/dashboard' es solo para admins)
      if (to.path === '/dashboard' || to.path === '/bienes') { 
         // IMPORTANTE: Evitar bucle infinito. Solo redirigir si no va ya a '/resguardante'
         if (to.path !== '/resguardante') {
             return next('/resguardante');
         }
      }
    }
    // CASO ADMIN (Opcional: Si el admin no debe ver la vista de resguardante)
    if (user.usuario_id_rol !== 3 && to.path === '/resguardante') {
       return next('/dashboard');
    }
    
  }

  // 4. Si pasa todas las validaciones, dejar pasar
  next();
});

export default router
