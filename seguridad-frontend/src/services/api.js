import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para incluir cookies en las peticiones (sesiones HTTP)
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 o 403, limpiar el localStorage y redirigir a login
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || '';
      
      // No hacer nada si es un error en el endpoint de login o register
      if (url.includes('/auth/login') || url.includes('/auth/register')) {
        return Promise.reject(error);
      }
      
      if (status === 401 || status === 403) {
        localStorage.removeItem('user');
        // Solo redirigir si no estamos ya en la página de login o register
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Error de red - el servidor no respondió
      console.error('Error de conexión: El servidor no responde');
    } else {
      // Error al configurar la petición
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;


