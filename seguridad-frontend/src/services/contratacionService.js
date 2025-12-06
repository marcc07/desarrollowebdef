import api from './api';

export const contratacionService = {
  getAll: (params = {}) => {
    return api.get('/contrataciones', { params });
  },

  getById: (id) => {
    return api.get(`/contrataciones/${id}`);
  },

  create: (data) => {
    return api.post('/contrataciones', data);
  },

  update: (id, data) => {
    return api.put(`/contrataciones/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/contrataciones/${id}`);
  },

  cancelar: (id) => {
    return api.post(`/contrataciones/${id}/cancelar`);
  }
};









