import api from './api';

export const informeService = {
  informeIngresos: (fechaInicio, fechaFin) => {
    return api.get('/informes/ingresos', {
      params: { fechaInicio, fechaFin }
    });
  },

  informeServicios: () => {
    return api.get('/informes/servicios');
  },

  informeCursos: () => {
    return api.get('/informes/cursos');
  },

  frecuenciaContrataciones: (fechaInicio, fechaFin) => {
    return api.get('/informes/frecuencia-contrataciones', {
      params: { fechaInicio, fechaFin }
    });
  }
};









