import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contratacionService } from '../services/contratacionService';

const Contrataciones = () => {
  const [contrataciones, setContrataciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    estado: '',
    clienteId: '',
    servicioId: '',
    fechaInicio: '',
    fechaFin: ''
  });

  useEffect(() => {
    cargarContrataciones();
  }, []);

  const cargarContrataciones = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await contratacionService.getAll(params);
      
      if (response.data.success) {
        setContrataciones(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar contrataciones');
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
    if (filtros.servicioId) params.servicioId = filtros.servicioId;
    if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;
    cargarContrataciones(params);
  };

  const handleLimpiar = () => {
    setFiltros({
      estado: '',
      clienteId: '',
      servicioId: '',
      fechaInicio: '',
      fechaFin: ''
    });
    cargarContrataciones();
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta contratación?')) {
      return;
    }

    try {
      const response = await contratacionService.delete(id);
      if (response.data.success) {
        alert('Contratación eliminada exitosamente');
        cargarContrataciones();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar contratación');
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar esta contratación?')) {
      return;
    }

    try {
      const response = await contratacionService.cancelar(id);
      if (response.data.success) {
        alert('Contratación cancelada exitosamente');
        cargarContrataciones();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cancelar contratación');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando contrataciones...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Gestión de Contrataciones</h2>
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={() => cargarContrataciones()} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
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
            <option value="ACTIVA">Activa</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="FINALIZADA">Finalizada</option>
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
            placeholder="ID Servicio" 
            value={filtros.servicioId}
            onChange={(e) => setFiltros({...filtros, servicioId: e.target.value})}
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
        <Link to="/contrataciones/nuevo" className="btn btn-success">
          <i className="fas fa-file-contract"></i> Nueva Contratación
        </Link>
      </div>
      
      <div className="table-container">
        {contrataciones.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>No hay contrataciones registradas</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Fecha Contratación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contrataciones.map((contratacion) => (
                <tr key={contratacion.id}>
                  <td>{contratacion.id}</td>
                  <td>{contratacion.cliente ? contratacion.cliente.nombre : 'N/A'}</td>
                  <td>{contratacion.servicioSeguridad ? contratacion.servicioSeguridad.nombre : 'N/A'}</td>
                  <td>{contratacion.fechaInicio || 'N/A'}</td>
                  <td>{contratacion.fechaFin || 'N/A'}</td>
                  <td>{contratacion.fechaContratacion || 'N/A'}</td>
                  <td>
                    <span className={`badge ${
                      contratacion.estado === 'CONFIRMADA' || contratacion.estado === 'ACTIVA' ? 'badge-success' :
                      contratacion.estado === 'CANCELADA' ? 'badge-danger' :
                      contratacion.estado === 'FINALIZADA' ? 'badge-secondary' :
                      'badge-warning'
                    }`}>
                      {contratacion.estado || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/contrataciones/detalle/${contratacion.id}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i> Ver
                      </Link>
                      <Link to={`/contrataciones/editar/${contratacion.id}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i> Editar
                      </Link>
                      {contratacion.estado !== 'CANCELADA' && (
                        <button 
                          onClick={() => handleCancelar(contratacion.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <i className="fas fa-times"></i> Cancelar
                        </button>
                      )}
                      <button 
                        onClick={() => handleEliminar(contratacion.id)}
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

export default Contrataciones;









