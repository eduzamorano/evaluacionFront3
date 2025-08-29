import { API_URL } from '../config';

export const AuthService = {
  async login(usuario, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuario, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la autenticación');
    }

    const data = await response.json();
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data;
    }
    
    throw new Error('Respuesta inválida del servidor');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

// Interceptor para agregar el token a todas las peticiones
export const fetchWithAuth = async (url, options = {}) => {
  const token = AuthService.getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    AuthService.logout();
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  return response;
}; 