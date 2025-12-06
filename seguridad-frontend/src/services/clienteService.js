import api from './api';

export const clienteService = {
  getAll: (params = {}) => {
    return api.get('/clientes', { params });
  },
  
  getById: (id) => {
    return api.get(`/clientes/${id}`);
  },
  
  create: (data) => {
    return api.post('/clientes', data);
  },
  
  update: (id, data) => {
    return api.put(`/clientes/${id}`, data);
  },
  
  delete: (id) => {
    return api.delete(`/clientes/${id}`);
  },
  
  search: (query) => {
    return api.get('/clientes', { params: { busqueda: query } });
  }
};









