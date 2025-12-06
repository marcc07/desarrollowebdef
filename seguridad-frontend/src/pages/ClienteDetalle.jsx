import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clienteService } from '../services/clienteService';

const ClienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [contrataciones, setContrataciones] = useState([]);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clienteService.getById(id);
      
      if (response.data.success) {
        setCliente(response.data.data.cliente);
        setContrataciones(response.data.data.contrataciones || []);
        setReservas(response.data.data.reservas || []);
      } else {
        setError(response.data.message || 'Cliente no encontrado');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) {
      return;
    }

    try {
      const response = await clienteService.delete(id);
      if (response.data.success) {
        alert('Cliente eliminado exitosamente');
        navigate('/clientes');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar cliente');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error || 'Cliente no encontrado'}</span>
        </div>
        <Link to="/clientes" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Volver a Clientes
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Detalle del Cliente</h2>
          <div>
            <Link to={`/clientes/editar/${id}`} className="btn btn-warning">
              <i className="fas fa-edit"></i> Editar
            </Link>
            <button onClick={handleEliminar} className="btn btn-danger" style={{ marginLeft: '0.5rem' }}>
              <i className="fas fa-trash"></i> Eliminar
            </button>
            <Link to="/clientes" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
              <i className="fas fa-arrow-left"></i> Volver
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h3>Información Personal</h3>
            <p><strong>ID:</strong> {cliente.id}</p>
            <p><strong>Nombre:</strong> {cliente.nombre}</p>
            <p><strong>Tipo:</strong> {cliente.tipoCliente || 'N/A'}</p>
            <p><strong>Documento:</strong> {cliente.documentoIdentidad || 'N/A'}</p>
            <p><strong>Email:</strong> {cliente.email || 'N/A'}</p>
            <p><strong>Teléfono:</strong> {cliente.telefono || 'N/A'}</p>
          </div>

          <div>
            <h3>Información de Ubicación</h3>
            <p><strong>Dirección:</strong> {cliente.direccion || 'N/A'}</p>
            <p><strong>Ciudad:</strong> {cliente.ciudad || 'N/A'}</p>
            <p><strong>País:</strong> {cliente.pais || 'N/A'}</p>
            <p><strong>Fecha de Registro:</strong> {cliente.fechaRegistro || 'N/A'}</p>
          </div>
        </div>

        {cliente.notas && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Notas</h3>
            <p>{cliente.notas}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Historial de Contrataciones</h3>
        {contrataciones.length === 0 ? (
          <p>No hay contrataciones registradas para este cliente.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Servicio</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contrataciones.map((contratacion) => (
                  <tr key={contratacion.id}>
                    <td>{contratacion.id}</td>
                    <td>{contratacion.servicioSeguridad?.nombre || 'N/A'}</td>
                    <td>{contratacion.fechaInicio || 'N/A'}</td>
                    <td>{contratacion.fechaFin || 'N/A'}</td>
                    <td>
                      <span className={`badge ${
                        contratacion.estado === 'CONFIRMADA' || contratacion.estado === 'ACTIVA' ? 'badge-success' :
                        contratacion.estado === 'CANCELADA' ? 'badge-danger' :
                        'badge-warning'
                      }`}>
                        {contratacion.estado || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/contrataciones/detalle/${contratacion.id}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i> Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Historial de Reservas</h3>
        {reservas.length === 0 ? (
          <p>No hay reservas registradas para este cliente.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Programa</th>
                  <th>Fecha Reserva</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>{reserva.id}</td>
                    <td>{reserva.programaEntrenamiento?.nombre || 'N/A'}</td>
                    <td>{reserva.fechaReserva || 'N/A'}</td>
                    <td>
                      <span className={`badge ${
                        reserva.estado === 'CONFIRMADA' || reserva.estado === 'ACTIVA' ? 'badge-success' :
                        reserva.estado === 'CANCELADA' ? 'badge-danger' :
                        'badge-warning'
                      }`}>
                        {reserva.estado || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/reservas/detalle/${reserva.id}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i> Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ClienteDetalle;









