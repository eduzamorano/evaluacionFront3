import { createRouter, createWebHistory } from 'vue-router';
import { AuthService } from './services/AuthService';
import { hasRouteAccess, getDefaultRouteForRole } from './utils/permissions';
import LoginPage from './views/Login.vue';
import MainLayout from './layouts/MainLayout.vue';

const requireAuth = (to, from, next) => {
  if (!AuthService.isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
};

// Guardia de ruta para verificar permisos por rol
const requireRole = (to, from, next) => {
  const user = AuthService.getUser();
  
  if (!user) {
    next('/login');
    return;
  }

  const userRole = user.rol;
  const routeName = to.name;
  
  // Verificar si el usuario tiene acceso a la ruta
  if (hasRouteAccess(routeName, userRole)) {
    next();
  } else {
    // Redirigir a la ruta por defecto del rol
    next(getDefaultRouteForRole(userRole));
  }
};

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: MainLayout,
    beforeEnter: requireAuth,
    meta: { requiresAuth: true },
    children: [
      { 
        path: 'dashboard', 
        name: 'dashboard', 
        component: () => import('./views/Dashboard.vue'),
        beforeEnter: requireRole
      },
      {
        path: 'evaluaciones/nueva',
        name: 'nueva-evaluacion',
        component: () => import('./components/EvaluacionSetup.vue'),
        props: route => ({ idPauta: route.query.idPauta }),
        beforeEnter: requireRole
      },      
      { 
        path: 'pautas/lista', 
        name: 'lista-pautas', 
        component: () => import('./components/ListaPautas.vue'),
        beforeEnter: requireRole
      },
      { 
        path: 'evaluaciones', 
        name: 'lista-evaluaciones', 
        component: () => import('./components/ListaEvaluaciones.vue'),
        beforeEnter: requireRole
      },
      { 
        path: 'evaluaciones/detalle/:id', 
        name: 'detalle-evaluacion', 
        component: () => import('./components/DetalleEvaluacion.vue'),
        beforeEnter: requireRole
      },
      { 
        path: 'evaluacion/rrss', 
        name: 'rrss', 
        component: () => import('./views/RRSS.vue'),
        beforeEnter: requireRole
      },
      { 
        path: 'evaluacion/backoffice', 
        name: 'backoffice', 
        component: () => import('./views/BackOffice.vue'),
        beforeEnter: requireRole
      },
      { 
        path: 'evaluacion/empresa', 
        name: 'empresa', 
        component: () => import('./views/Empresa.vue'),
        beforeEnter: requireRole
      },
      { 
        path: 'reportes', 
        name: 'reportes', 
        component: () => import('./views/Reportes.vue'),
        beforeEnter: requireRole
      },
      { 
        path: 'configuraciones', 
        name: 'configuraciones', 
        component: () => import('./views/Configuraciones.vue'),
        beforeEnter: requireRole
      },
      { 
        path: 'usuarios', 
        name: 'usuarios', 
        component: () => import('./views/GestionUsuarios.vue'),
        beforeEnter: requireRole
      },
      { 
        path: 'ejecutivos', 
        name: 'ejecutivos', 
        component: () => import('./components/GestionEjecutivos.vue'),
        beforeEnter: requireRole
      },
      { 
        path: 'evaluacion/:id', 
        name: 'formulario-evaluacion', 
        component: () => import('./components/FormularioEvaluacion.vue'),
        beforeEnter: requireRole
      },
      { 
        path: '', 
        redirect: () => {
          const user = AuthService.getUser();
          return getDefaultRouteForRole(user ? user.rol : 'Cliente');
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = AuthService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    const user = AuthService.getUser();
    next(getDefaultRouteForRole(user ? user.rol : 'Cliente'));
  } else {
    next();
  }
});

export default router;
