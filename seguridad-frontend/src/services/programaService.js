import api from './api';

export const programaService = {
  getAll: (params = {}) => {
    return api.get('/programas', { params });
  },

  getById: (id) => {
    return api.get(`/programas/${id}`);
  },

  create: (data) => {
    return api.post('/programas', data);
  },

  update: (id, data) => {
    return api.put(`/programas/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/programas/${id}`);
  },

  search: (query) => {
    return api.get('/programas', { params: { busqueda: query } });
  }
};









