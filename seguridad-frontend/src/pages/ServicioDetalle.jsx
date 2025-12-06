import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { servicioService } from '../services/servicioService';

const ServicioDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicio, setServicio] = useState(null);

  useEffect(() => {
    cargarServicio();
  }, [id]);

  const cargarServicio = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicioService.getById(id);
      
      if (response.data.success) {
        setServicio(response.data.data);
      } else {
        setError(response.data.message || 'Servicio no encontrado');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) {
      return;
    }

    try {
      const response = await servicioService.delete(id);
      if (response.data.success) {
        alert('Servicio eliminado exitosamente');
        navigate('/servicios');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar servicio');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !servicio) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error || 'Servicio no encontrado'}</span>
        </div>
        <Link to="/servicios" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Volver a Servicios
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Detalle del Servicio</h2>
        <div>
          <Link to={`/servicios/editar/${id}`} className="btn btn-warning">
            <i className="fas fa-edit"></i> Editar
          </Link>
          <button onClick={handleEliminar} className="btn btn-danger" style={{ marginLeft: '0.5rem' }}>
            <i className="fas fa-trash"></i> Eliminar
          </button>
          <Link to="/servicios" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
            <i className="fas fa-arrow-left"></i> Volver
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div>
          <h3>Información Básica</h3>
          <p><strong>ID:</strong> {servicio.id}</p>
          <p><strong>Nombre:</strong> {servicio.nombre}</p>
          <p><strong>Tipo:</strong> {servicio.tipo || 'N/A'}</p>
          <p><strong>Precio:</strong> ${servicio.precio ? servicio.precio.toFixed(2) : '0.00'}</p>
          <p><strong>Ubicación:</strong> {servicio.ubicacion || 'N/A'}</p>
          <p><strong>Duración:</strong> {servicio.duracion || 'N/A'}</p>
          <p><strong>Estado:</strong> 
            <span className={`badge ${servicio.activo ? 'badge-success' : 'badge-danger'}`} style={{ marginLeft: '0.5rem' }}>
              {servicio.activo ? 'Activo' : 'Inactivo'}
            </span>
          </p>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>Descripción</h3>
        <p>{servicio.descripcion || 'N/A'}</p>
      </div>

      {servicio.personalAsignado && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Personal Asignado</h3>
          <p>{servicio.personalAsignado}</p>
        </div>
      )}

      {servicio.horarios && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Horarios</h3>
          <p>{servicio.horarios}</p>
        </div>
      )}

      {servicio.herramientas && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Herramientas</h3>
          <p>{servicio.herramientas}</p>
        </div>
      )}

      {servicio.condiciones && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Condiciones</h3>
          <p>{servicio.condiciones}</p>
        </div>
      )}
    </div>
  );
};

export default ServicioDetalle;









