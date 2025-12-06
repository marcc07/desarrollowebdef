import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { pagoService } from '../services/pagoService';

const PagoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pago, setPago] = useState(null);

  useEffect(() => {
    cargarPago();
  }, [id]);

  const cargarPago = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pagoService.getById(id);
      
      if (response.data.success) {
        setPago(response.data.data);
      } else {
        setError(response.data.message || 'Pago no encontrado');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar pago');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este pago?')) {
      return;
    }

    try {
      const response = await pagoService.delete(id);
      if (response.data.success) {
        alert('Pago eliminado exitosamente');
        navigate('/pagos');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar pago');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !pago) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error || 'Pago no encontrado'}</span>
        </div>
        <Link to="/pagos" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Volver a Pagos
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Detalle del Pago</h2>
        <div>
          <Link to={`/pagos/editar/${id}`} className="btn btn-warning">
            <i className="fas fa-edit"></i> Editar
          </Link>
          <button onClick={handleEliminar} className="btn btn-danger" style={{ marginLeft: '0.5rem' }}>
            <i className="fas fa-trash"></i> Eliminar
          </button>
          <Link to="/pagos" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
            <i className="fas fa-arrow-left"></i> Volver
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div>
          <h3>Información Básica</h3>
          <p><strong>ID:</strong> {pago.id}</p>
          <p><strong>Cliente:</strong> {pago.cliente?.nombre || 'N/A'}</p>
          <p><strong>Monto:</strong> ${pago.monto ? pago.monto.toFixed(2) : '0.00'}</p>
          <p><strong>Fecha Pago:</strong> {pago.fechaPago || 'N/A'}</p>
          <p><strong>Medio de Pago:</strong> {pago.medioPago || 'N/A'}</p>
          <p><strong>Estado:</strong> 
            <span className={`badge ${
              pago.estado === 'COMPLETADO' ? 'badge-success' :
              pago.estado === 'CANCELADO' ? 'badge-danger' :
              'badge-warning'
            }`} style={{ marginLeft: '0.5rem' }}>
              {pago.estado || 'N/A'}
            </span>
          </p>
        </div>
        <div>
          <h3>Información Adicional</h3>
          <p><strong>Contratación:</strong> {pago.contratacion ? `#${pago.contratacion.id}` : 'N/A'}</p>
          <p><strong>Número de Referencia:</strong> {pago.numeroReferencia || 'N/A'}</p>
        </div>
      </div>

      {pago.observaciones && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Observaciones</h3>
          <p>{pago.observaciones}</p>
        </div>
      )}

      {pago.cliente && (
        <div style={{ marginTop: '1.5rem' }}>
          <Link to={`/clientes/detalle/${pago.cliente.id}`} className="btn btn-info">
            <i className="fas fa-eye"></i> Ver Cliente
          </Link>
        </div>
      )}

      {pago.contratacion && (
        <div style={{ marginTop: '1.5rem' }}>
          <Link to={`/contrataciones/detalle/${pago.contratacion.id}`} className="btn btn-info">
            <i className="fas fa-eye"></i> Ver Contratación
          </Link>
        </div>
      )}
    </div>
  );
};

export default PagoDetalle;









