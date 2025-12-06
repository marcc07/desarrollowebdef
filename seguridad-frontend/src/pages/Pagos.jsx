import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pagoService } from '../services/pagoService';

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    clienteId: '',
    contratacionId: '',
    estado: '',
    medioPago: '',
    fechaInicio: '',
    fechaFin: '',
    montoMin: '',
    montoMax: ''
  });

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await pagoService.getAll(params);
      
      if (response.data.success) {
        setPagos(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar pagos');
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
    if (filtros.clienteId) params.clienteId = filtros.clienteId;
    if (filtros.contratacionId) params.contratacionId = filtros.contratacionId;
    if (filtros.estado) params.estado = filtros.estado;
    if (filtros.medioPago) params.medioPago = filtros.medioPago;
    if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;
    if (filtros.montoMin) params.montoMin = filtros.montoMin;
    if (filtros.montoMax) params.montoMax = filtros.montoMax;
    cargarPagos(params);
  };

  const handleLimpiar = () => {
    setFiltros({
      clienteId: '',
      contratacionId: '',
      estado: '',
      medioPago: '',
      fechaInicio: '',
      fechaFin: '',
      montoMin: '',
      montoMax: ''
    });
    cargarPagos();
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este pago?')) {
      return;
    }

    try {
      const response = await pagoService.delete(id);
      if (response.data.success) {
        alert('Pago eliminado exitosamente');
        cargarPagos();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar pago');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando pagos...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Gestión de Pagos</h2>
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={() => cargarPagos()} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
            Reintentar
          </button>
        </div>
      )}

      <div className="search-bar">
        <form onSubmit={handleBuscar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
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
            placeholder="ID Contratación" 
            value={filtros.contratacionId}
            onChange={(e) => setFiltros({...filtros, contratacionId: e.target.value})}
          />
          <select 
            className="form-control"
            value={filtros.estado}
            onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="COMPLETADO">Completado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
          <select 
            className="form-control"
            value={filtros.medioPago}
            onChange={(e) => setFiltros({...filtros, medioPago: e.target.value})}
          >
            <option value="">Todos los medios</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
          </select>
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
          <input 
            type="number" 
            className="form-control"
            placeholder="Monto mínimo" 
            step="0.01" 
            min="0"
            value={filtros.montoMin}
            onChange={(e) => setFiltros({...filtros, montoMin: e.target.value})}
          />
          <input 
            type="number" 
            className="form-control"
            placeholder="Monto máximo" 
            step="0.01" 
            min="0"
            value={filtros.montoMax}
            onChange={(e) => setFiltros({...filtros, montoMax: e.target.value})}
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
        <Link to="/pagos/nuevo" className="btn btn-success">
          <i className="fas fa-money-bill-wave"></i> Nuevo Pago
        </Link>
        <Link to="/pagos/reconciliacion" className="btn btn-info" style={{ marginLeft: '0.5rem' }}>
          <i className="fas fa-balance-scale"></i> Reconciliación
        </Link>
      </div>
      
      <div className="table-container">
        {pagos.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>No hay pagos registrados</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Contratación</th>
                <th>Monto</th>
                <th>Fecha Pago</th>
                <th>Medio de Pago</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.id}>
                  <td>{pago.id}</td>
                  <td>{pago.cliente ? pago.cliente.nombre : 'N/A'}</td>
                  <td>{pago.contratacion ? `#${pago.contratacion.id}` : 'N/A'}</td>
                  <td>${pago.monto ? pago.monto.toFixed(2) : '0.00'}</td>
                  <td>{pago.fechaPago || 'N/A'}</td>
                  <td>{pago.medioPago || 'N/A'}</td>
                  <td>
                    <span className={`badge ${
                      pago.estado === 'COMPLETADO' ? 'badge-success' :
                      pago.estado === 'CANCELADO' ? 'badge-danger' :
                      'badge-warning'
                    }`}>
                      {pago.estado || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/pagos/detalle/${pago.id}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i> Ver
                      </Link>
                      <Link to={`/pagos/editar/${pago.id}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i> Editar
                      </Link>
                      <button 
                        onClick={() => handleEliminar(pago.id)}
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

export default Pagos;









