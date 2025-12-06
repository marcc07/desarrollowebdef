import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { contratacionService } from '../services/contratacionService';

const ContratacionDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contratacion, setContratacion] = useState(null);

  useEffect(() => {
    cargarContratacion();
  }, [id]);

  const cargarContratacion = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contratacionService.getById(id);
      
      if (response.data.success) {
        setContratacion(response.data.data);
      } else {
        setError(response.data.message || 'Contratación no encontrada');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar contratación');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    if (!window.confirm('¿Estás seguro de cancelar esta contratación?')) {
      return;
    }

    try {
      const response = await contratacionService.cancelar(id);
      if (response.data.success) {
        alert('Contratación cancelada exitosamente');
        cargarContratacion();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cancelar contratación');
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de eliminar esta contratación?')) {
      return;
    }

    try {
      const response = await contratacionService.delete(id);
      if (response.data.success) {
        alert('Contratación eliminada exitosamente');
        navigate('/contrataciones');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar contratación');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !contratacion) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error || 'Contratación no encontrada'}</span>
        </div>
        <Link to="/contrataciones" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Volver a Contrataciones
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Detalle de la Contratación</h2>
        <div>
          <Link to={`/contrataciones/editar/${id}`} className="btn btn-warning">
            <i className="fas fa-edit"></i> Editar
          </Link>
          {contratacion.estado !== 'CANCELADA' && (
            <button onClick={handleCancelar} className="btn btn-danger" style={{ marginLeft: '0.5rem' }}>
              <i className="fas fa-times"></i> Cancelar
            </button>
          )}
          <button onClick={handleEliminar} className="btn btn-danger" style={{ marginLeft: '0.5rem' }}>
            <i className="fas fa-trash"></i> Eliminar
          </button>
          <Link to="/contrataciones" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
            <i className="fas fa-arrow-left"></i> Volver
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div>
          <h3>Información Básica</h3>
          <p><strong>ID:</strong> {contratacion.id}</p>
          <p><strong>Cliente:</strong> {contratacion.cliente?.nombre || 'N/A'}</p>
          <p><strong>Servicio:</strong> {contratacion.servicioSeguridad?.nombre || 'N/A'}</p>
          <p><strong>Estado:</strong> 
            <span className={`badge ${
              contratacion.estado === 'CONFIRMADA' || contratacion.estado === 'ACTIVA' ? 'badge-success' :
              contratacion.estado === 'CANCELADA' ? 'badge-danger' :
              'badge-warning'
            }`} style={{ marginLeft: '0.5rem' }}>
              {contratacion.estado || 'N/A'}
            </span>
          </p>
        </div>
        <div>
          <h3>Fechas</h3>
          <p><strong>Fecha Contratación:</strong> {contratacion.fechaContratacion || 'N/A'}</p>
          <p><strong>Fecha Inicio:</strong> {contratacion.fechaInicio || 'N/A'}</p>
          <p><strong>Fecha Fin:</strong> {contratacion.fechaFin || 'N/A'}</p>
        </div>
      </div>

      {contratacion.observaciones && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Observaciones</h3>
          <p>{contratacion.observaciones}</p>
        </div>
      )}

      {contratacion.servicioSeguridad && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Información del Servicio</h3>
          <p><strong>Precio:</strong> ${contratacion.servicioSeguridad.precio ? contratacion.servicioSeguridad.precio.toFixed(2) : '0.00'}</p>
          <p><strong>Ubicación:</strong> {contratacion.servicioSeguridad.ubicacion || 'N/A'}</p>
        </div>
      )}

      {contratacion.cliente && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Información del Cliente</h3>
          <p><strong>Email:</strong> {contratacion.cliente.email || 'N/A'}</p>
          <p><strong>Teléfono:</strong> {contratacion.cliente.telefono || 'N/A'}</p>
          <Link to={`/clientes/detalle/${contratacion.cliente.id}`} className="btn btn-info btn-sm" style={{ marginTop: '0.5rem' }}>
            <i className="fas fa-eye"></i> Ver Cliente
          </Link>
        </div>
      )}
    </div>
  );
};

export default ContratacionDetalle;









