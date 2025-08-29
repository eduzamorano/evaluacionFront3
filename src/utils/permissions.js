import { AuthService } from '../services/AuthService';

// Definir permisos por ruta según el rol
export const routePermissions = {
  dashboard: ['Administrador', 'Evaluador', 'Lector', 'Cliente'],
  'nueva-evaluacion': ['Administrador', 'Evaluador'],
  'lista-pautas': ['Administrador', 'Evaluador'],
  'lista-evaluaciones': ['Administrador', 'Evaluador', 'Lector'],
  'detalle-evaluacion': ['Administrador', 'Evaluador', 'Lector'],
  rrss: ['Administrador', 'Evaluador'],
  backoffice: ['Administrador', 'Evaluador'],
  empresa: ['Administrador', 'Evaluador'],
  reportes: ['Administrador', 'Lector'],
  configuraciones: ['Administrador'],
  usuarios: ['Administrador'],
  ejecutivos: ['Administrador'],
  'formulario-evaluacion': ['Administrador', 'Evaluador']
};

// Función para verificar si el usuario tiene acceso a una ruta
export const hasRouteAccess = (routeName, userRole) => {
  const allowedRoles = routePermissions[routeName];
  return allowedRoles && allowedRoles.includes(userRole);
};

// Función para obtener la ruta por defecto según el rol
export const getDefaultRouteForRole = (userRole) => {
  switch (userRole) {
    case 'Administrador':
      return '/dashboard';
    case 'Evaluador':
      return '/dashboard';
    case 'Lector':
      return '/dashboard';
    case 'Cliente':
      return '/dashboard';
    default:
      return '/dashboard';
  }
};

// Función para verificar si el usuario actual tiene acceso a una ruta
export const canAccessRoute = (routeName) => {
  const user = AuthService.getUser();
  if (!user) return false;
  return hasRouteAccess(routeName, user.rol);
};

// Función para verificar si el usuario es administrador
export const isAdmin = () => {
  const user = AuthService.getUser();
  return user && user.rol === 'Administrador';
};

// Función para verificar si el usuario es evaluador
export const isEvaluador = () => {
  const user = AuthService.getUser();
  return user && user.rol === 'Evaluador';
};

// Función para verificar si el usuario es lector
export const isLector = () => {
  const user = AuthService.getUser();
  return user && user.rol === 'Lector';
};

// Función para verificar si el usuario es cliente
export const isCliente = () => {
  const user = AuthService.getUser();
  return user && user.rol === 'Cliente';
};

// Función para verificar si el usuario tiene uno de los roles especificados
export const hasAnyRole = (roles) => {
  const user = AuthService.getUser();
  return user && roles.includes(user.rol);
};

// Función para obtener el rol del usuario actual
export const getCurrentUserRole = () => {
  const user = AuthService.getUser();
  return user ? user.rol : null;
};

// Función para obtener el usuario actual
export const getCurrentUser = () => {
  return AuthService.getUser();
}; 