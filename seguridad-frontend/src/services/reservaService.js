import api from './api';

export const reservaService = {
  getAll: (params = {}) => {
    return api.get('/reservas', { params });
  },

  getById: (id) => {
    return api.get(`/reservas/${id}`);
  },

  create: (data) => {
    return api.post('/reservas', data);
  },

  update: (id, data) => {
    return api.put(`/reservas/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/reservas/${id}`);
  },

  cancelar: (id) => {
    return api.post(`/reservas/${id}/cancelar`);
  }
};









