import api from './api';

export const servicioService = {
  getAll: (params = {}) => {
    return api.get('/servicios', { params });
  },

  getById: (id) => {
    return api.get(`/servicios/${id}`);
  },

  create: (data) => {
    return api.post('/servicios', data);
  },

  update: (id, data) => {
    return api.put(`/servicios/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/servicios/${id}`);
  },

  search: (query) => {
    return api.get('/servicios', { params: { busqueda: query } });
  }
};









