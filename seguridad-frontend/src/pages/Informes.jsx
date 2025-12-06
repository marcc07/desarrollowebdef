import { useState } from 'react';
import { informeService } from '../services/informeService';

const Informes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [informeIngresos, setInformeIngresos] = useState(null);
  const [informeServicios, setInformeServicios] = useState(null);
  const [informeCursos, setInformeCursos] = useState(null);

  const cargarInformeIngresos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await informeService.informeIngresos();
      if (response.data.success) {
        setInformeIngresos(response.data.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar informe de ingresos');
    } finally {
      setLoading(false);
    }
  };

  const cargarInformeServicios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await informeService.informeServicios();
      if (response.data.success) {
        setInformeServicios(response.data.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar informe de servicios');
    } finally {
      setLoading(false);
    }
  };

  const cargarInformeCursos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await informeService.informeCursos();
      if (response.data.success) {
        setInformeCursos(response.data.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar informe de cursos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Informes y Estadísticas</h2>
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="card">
          <h3>Informe de Ingresos</h3>
          <button onClick={cargarInformeIngresos} className="btn btn-primary" disabled={loading}>
            <i className="fas fa-chart-line"></i> Generar Informe
          </button>
          {informeIngresos && (
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Ingresos Totales:</strong> ${informeIngresos.ingresosTotales?.toFixed(2) || '0.00'}</p>
              <p><strong>Período:</strong> {informeIngresos.fechaInicio} - {informeIngresos.fechaFin}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Informe de Servicios</h3>
          <button onClick={cargarInformeServicios} className="btn btn-primary" disabled={loading}>
            <i className="fas fa-shield-alt"></i> Generar Informe
          </button>
          {informeServicios && informeServicios.serviciosMasSolicitados && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Servicios Más Solicitados:</h4>
              <ul>
                {Object.entries(informeServicios.serviciosMasSolicitados).map(([nombre, count]) => (
                  <li key={nombre}>{nombre}: {count} contrataciones</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Informe de Cursos</h3>
          <button onClick={cargarInformeCursos} className="btn btn-primary" disabled={loading}>
            <i className="fas fa-graduation-cap"></i> Generar Informe
          </button>
          {informeCursos && informeCursos.cursosMasInscritos && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Cursos Más Inscritos:</h4>
              <ul>
                {Object.entries(informeCursos.cursosMasInscritos).map(([nombre, count]) => (
                  <li key={nombre}>{nombre}: {count} reservas</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Informes;









