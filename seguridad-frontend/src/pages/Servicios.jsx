import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicioService } from '../services/servicioService';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipo: '',
    ubicacion: '',
    duracion: '',
    precioMin: '',
    precioMax: ''
  });

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicioService.getAll(params);
      
      if (response.data.success) {
        setServicios(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar servicios');
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
    if (filtros.busqueda) params.busqueda = filtros.busqueda;
    if (filtros.tipo) params.tipo = filtros.tipo;
    if (filtros.ubicacion) params.ubicacion = filtros.ubicacion;
    if (filtros.duracion) params.duracion = filtros.duracion;
    if (filtros.precioMin) params.precioMin = filtros.precioMin;
    if (filtros.precioMax) params.precioMax = filtros.precioMax;
    cargarServicios(params);
  };

  const handleLimpiar = () => {
    setFiltros({
      busqueda: '',
      tipo: '',
      ubicacion: '',
      duracion: '',
      precioMin: '',
      precioMax: ''
    });
    cargarServicios();
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) {
      return;
    }

    try {
      const response = await servicioService.delete(id);
      if (response.data.success) {
        alert('Servicio eliminado exitosamente');
        cargarServicios();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar servicio');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando servicios...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Gestión de Servicios de Seguridad</h2>
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={() => cargarServicios()} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
            Reintentar
          </button>
        </div>
      )}

      <div className="search-bar">
        <form onSubmit={handleBuscar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <input 
            type="text" 
            className="form-control"
            placeholder="Buscar por nombre, tipo, ubicación..." 
            value={filtros.busqueda}
            onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
          />
          <select 
            className="form-control"
            value={filtros.tipo}
            onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
          >
            <option value="">Todos los tipos</option>
            <option value="VIGILANCIA_FIJA">Vigilancia Fija</option>
            <option value="PATRULLAJE_MOVIL">Patrullaje Móvil</option>
            <option value="ESCOLTA">Escolta</option>
            <option value="MONITOREO">Monitoreo</option>
            <option value="OTRO">Otro</option>
          </select>
          <input 
            type="text" 
            className="form-control"
            placeholder="Ubicación" 
            value={filtros.ubicacion}
            onChange={(e) => setFiltros({...filtros, ubicacion: e.target.value})}
          />
          <input 
            type="text" 
            className="form-control"
            placeholder="Duración" 
            value={filtros.duracion}
            onChange={(e) => setFiltros({...filtros, duracion: e.target.value})}
          />
          <input 
            type="number" 
            className="form-control"
            placeholder="Precio mínimo" 
            step="0.01" 
            min="0"
            value={filtros.precioMin}
            onChange={(e) => setFiltros({...filtros, precioMin: e.target.value})}
          />
          <input 
            type="number" 
            className="form-control"
            placeholder="Precio máximo" 
            step="0.01" 
            min="0"
            value={filtros.precioMax}
            onChange={(e) => setFiltros({...filtros, precioMax: e.target.value})}
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
        <Link to="/servicios/nuevo" className="btn btn-success">
          <i className="fas fa-plus-circle"></i> Nuevo Servicio
        </Link>
      </div>
      
      <div className="table-container">
        {servicios.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>No hay servicios registrados</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Ubicación</th>
                <th>Precio</th>
                <th>Duración</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio.id}>
                  <td>{servicio.id}</td>
                  <td>{servicio.nombre}</td>
                  <td>{servicio.tipo || 'N/A'}</td>
                  <td>{servicio.ubicacion || 'N/A'}</td>
                  <td>${servicio.precio ? servicio.precio.toFixed(2) : '0.00'}</td>
                  <td>{servicio.duracion || 'N/A'}</td>
                  <td>
                    <span className={`badge ${servicio.activo ? 'badge-success' : 'badge-danger'}`}>
                      {servicio.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/servicios/detalle/${servicio.id}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i> Ver
                      </Link>
                      <Link to={`/servicios/editar/${servicio.id}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i> Editar
                      </Link>
                      <button 
                        onClick={() => handleEliminar(servicio.id)}
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

export default Servicios;









