import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { reservaService } from '../services/reservaService';

const ReservaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserva, setReserva] = useState(null);

  useEffect(() => {
    cargarReserva();
  }, [id]);

  const cargarReserva = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservaService.getById(id);
      
      if (response.data.success) {
        setReserva(response.data.data);
      } else {
        setError(response.data.message || 'Reserva no encontrada');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      return;
    }

    try {
      const response = await reservaService.cancelar(id);
      if (response.data.success) {
        alert('Reserva cancelada exitosamente');
        cargarReserva();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cancelar reserva');
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      return;
    }

    try {
      const response = await reservaService.delete(id);
      if (response.data.success) {
        alert('Reserva eliminada exitosamente');
        navigate('/reservas');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar reserva');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error || 'Reserva no encontrada'}</span>
        </div>
        <Link to="/reservas" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Volver a Reservas
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Detalle de la Reserva</h2>
        <div>
          <Link to={`/reservas/editar/${id}`} className="btn btn-warning">
            <i className="fas fa-edit"></i> Editar
          </Link>
          {reserva.estado !== 'CANCELADA' && (
            <button onClick={handleCancelar} className="btn btn-danger" style={{ marginLeft: '0.5rem' }}>
              <i className="fas fa-times"></i> Cancelar
            </button>
          )}
          <button onClick={handleEliminar} className="btn btn-danger" style={{ marginLeft: '0.5rem' }}>
            <i className="fas fa-trash"></i> Eliminar
          </button>
          <Link to="/reservas" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
            <i className="fas fa-arrow-left"></i> Volver
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div>
          <h3>Información Básica</h3>
          <p><strong>ID:</strong> {reserva.id}</p>
          <p><strong>Cliente:</strong> {reserva.cliente?.nombre || 'N/A'}</p>
          <p><strong>Programa:</strong> {reserva.programaEntrenamiento?.nombre || 'N/A'}</p>
          <p><strong>Fecha Reserva:</strong> {reserva.fechaReserva || 'N/A'}</p>
          <p><strong>Estado:</strong> 
            <span className={`badge ${
              reserva.estado === 'CONFIRMADA' || reserva.estado === 'ACTIVA' ? 'badge-success' :
              reserva.estado === 'CANCELADA' ? 'badge-danger' :
              'badge-warning'
            }`} style={{ marginLeft: '0.5rem' }}>
              {reserva.estado || 'N/A'}
            </span>
          </p>
        </div>
      </div>

      {reserva.observaciones && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Observaciones</h3>
          <p>{reserva.observaciones}</p>
        </div>
      )}

      {reserva.programaEntrenamiento && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Información del Programa</h3>
          <p><strong>Instructor:</strong> {reserva.programaEntrenamiento.instructor || 'N/A'}</p>
          <p><strong>Costo:</strong> ${reserva.programaEntrenamiento.costo ? reserva.programaEntrenamiento.costo.toFixed(2) : '0.00'}</p>
          <p><strong>Fecha Inicio:</strong> {reserva.programaEntrenamiento.fechaInicio || 'N/A'}</p>
          <Link to={`/programas/detalle/${reserva.programaEntrenamiento.id}`} className="btn btn-info btn-sm" style={{ marginTop: '0.5rem' }}>
            <i className="fas fa-eye"></i> Ver Programa
          </Link>
        </div>
      )}

      {reserva.cliente && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Información del Cliente</h3>
          <p><strong>Email:</strong> {reserva.cliente.email || 'N/A'}</p>
          <p><strong>Teléfono:</strong> {reserva.cliente.telefono || 'N/A'}</p>
          <Link to={`/clientes/detalle/${reserva.cliente.id}`} className="btn btn-info btn-sm" style={{ marginTop: '0.5rem' }}>
            <i className="fas fa-eye"></i> Ver Cliente
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReservaDetalle;









