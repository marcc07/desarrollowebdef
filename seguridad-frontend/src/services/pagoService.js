import api from './api';

export const pagoService = {
  getAll: (params = {}) => {
    return api.get('/pagos', { params });
  },

  getById: (id) => {
    return api.get(`/pagos/${id}`);
  },

  create: (data) => {
    return api.post('/pagos', data);
  },

  update: (id, data) => {
    return api.put(`/pagos/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/pagos/${id}`);
  },

  reconciliar: (contratacionId) => {
    return api.get(`/pagos/reconciliacion/${contratacionId}`);
  },

  reconciliarTodos: () => {
    return api.get('/pagos/reconciliacion');
  }
};









