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
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPassword.vue')
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPassword.vue')
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
        {
          path: 'bienes-departamento',
          name: 'bienes-departamento',
          component: () => import('../views/resguardante/BienesDepartamento.vue'),
          // Protección exclusiva: Solo deja entrar si el usuario tiene Rol 4
          beforeEnter: (to, from, next) => {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (user && user.usuario_id_rol === 4) {
              next(); // Adelante, jefe
            } else {
              next('/resguardante'); // Si es otro rol (ej. 3), lo regresa al inicio
            }
          }
        },
        {
          path: 'perfil',  // La ruta será /resguardante/perfil
          name: 'resguardante-perfil',
          component: () => import('../views/resguardante/PerfilResguardante.vue'),
        },
        
      ],
    }
  ],
})
router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAuthenticated = !!localStorage.getItem('auth_token');


  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  if (isAuthenticated && user) {
    const rolesLimitados = [3, 4]; 

    if (rolesLimitados.includes(user.usuario_id_rol)) {

      if (to.path === '/dashboard' || to.path === '/bienes') {

        if (to.path !== '/resguardante') {
          return next('/resguardante');
        }
      }
    }
    if (!rolesLimitados.includes(user.usuario_id_rol) && to.path === '/resguardante') {
      return next('/dashboard');
    }
  }
  next();
});

export default router
