import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/current');
    return response.data;
  },

  async register(usuario) {
    const response = await api.post('/auth/register', usuario);
    return response.data;
  },
};








