import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservaService } from '../services/reservaService';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    estado: '',
    clienteId: '',
    programaId: '',
    fechaInicio: '',
    fechaFin: ''
  });

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservaService.getAll(params);
      
      if (response.data.success) {
        setReservas(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar reservas');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:8080');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    const params = {};
    if (filtros.estado) params.estado = filtros.estado;
    if (filtros.clienteId) params.clienteId = filtros.clienteId;
    if (filtros.programaId) params.programaId = filtros.programaId;
    if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;
    cargarReservas(params);
  };

  const handleLimpiar = () => {
    setFiltros({
      estado: '',
      clienteId: '',
      programaId: '',
      fechaInicio: '',
      fechaFin: ''
    });
    cargarReservas();
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      return;
    }

    try {
      const response = await reservaService.delete(id);
      if (response.data.success) {
        alert('Reserva eliminada exitosamente');
        cargarReservas();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar reserva');
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      return;
    }

    try {
      const response = await reservaService.cancelar(id);
      if (response.data.success) {
        alert('Reserva cancelada exitosamente');
        cargarReservas();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cancelar reserva');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando reservas...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Gestión de Reservas</h2>
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={() => cargarReservas()} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
            Reintentar
          </button>
        </div>
      )}

      <div className="search-bar">
        <form onSubmit={handleBuscar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <select 
            className="form-control"
            value={filtros.estado}
            onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="ACTIVA">Activa</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <input 
            type="text" 
            className="form-control"
            placeholder="ID Cliente" 
            value={filtros.clienteId}
            onChange={(e) => setFiltros({...filtros, clienteId: e.target.value})}
          />
          <input 
            type="text" 
            className="form-control"
            placeholder="ID Programa" 
            value={filtros.programaId}
            onChange={(e) => setFiltros({...filtros, programaId: e.target.value})}
          />
          <input 
            type="date" 
            className="form-control"
            placeholder="Fecha inicio" 
            value={filtros.fechaInicio}
            onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
          />
          <input 
            type="date" 
            className="form-control"
            placeholder="Fecha fin" 
            value={filtros.fechaFin}
            onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
          />
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-search"></i> Buscar
          </button>
          <button type="button" onClick={handleLimpiar} className="btn btn-secondary">
            <i className="fas fa-times"></i> Limpiar
          </button>
        </form>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/reservas/nuevo" className="btn btn-success">
          <i className="fas fa-calendar-plus"></i> Nueva Reserva
        </Link>
      </div>
      
      <div className="table-container">
        {reservas.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>No hay reservas registradas</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
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
                  <td>{reserva.cliente ? reserva.cliente.nombre : 'N/A'}</td>
                  <td>{reserva.programaEntrenamiento ? reserva.programaEntrenamiento.nombre : 'N/A'}</td>
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
                    <div className="action-buttons">
                      <Link to={`/reservas/detalle/${reserva.id}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i> Ver
                      </Link>
                      <Link to={`/reservas/editar/${reserva.id}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i> Editar
                      </Link>
                      {reserva.estado !== 'CANCELADA' && (
                        <button 
                          onClick={() => handleCancelar(reserva.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <i className="fas fa-times"></i> Cancelar
                        </button>
                      )}
                      <button 
                        onClick={() => handleEliminar(reserva.id)}
                        className="btn btn-danger btn-sm"
                      >
                        <i className="fas fa-trash"></i> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reservas;









