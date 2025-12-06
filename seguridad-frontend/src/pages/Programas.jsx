import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { programaService } from '../services/programaService';

const Programas = () => {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    instructor: '',
    fechaInicio: '',
    fechaFin: '',
    costoMin: '',
    costoMax: ''
  });

  useEffect(() => {
    cargarProgramas();
  }, []);

  const cargarProgramas = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await programaService.getAll(params);
      
      if (response.data.success) {
        setProgramas(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar programas');
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
    if (filtros.instructor) params.instructor = filtros.instructor;
    if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;
    if (filtros.costoMin) params.costoMin = filtros.costoMin;
    if (filtros.costoMax) params.costoMax = filtros.costoMax;
    cargarProgramas(params);
  };

  const handleLimpiar = () => {
    setFiltros({
      busqueda: '',
      instructor: '',
      fechaInicio: '',
      fechaFin: '',
      costoMin: '',
      costoMax: ''
    });
    cargarProgramas();
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este programa?')) {
      return;
    }

    try {
      const response = await programaService.delete(id);
      if (response.data.success) {
        alert('Programa eliminado exitosamente');
        cargarProgramas();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar programa');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando programas...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Gestión de Programas de Entrenamiento</h2>
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={() => cargarProgramas()} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
            Reintentar
          </button>
        </div>
      )}

      <div className="search-bar">
        <form onSubmit={handleBuscar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <input 
            type="text" 
            className="form-control"
            placeholder="Buscar por nombre, contenido..." 
            value={filtros.busqueda}
            onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
          />
          <input 
            type="text" 
            className="form-control"
            placeholder="Instructor" 
            value={filtros.instructor}
            onChange={(e) => setFiltros({...filtros, instructor: e.target.value})}
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
          <input 
            type="number" 
            className="form-control"
            placeholder="Costo mínimo" 
            step="0.01" 
            min="0"
            value={filtros.costoMin}
            onChange={(e) => setFiltros({...filtros, costoMin: e.target.value})}
          />
          <input 
            type="number" 
            className="form-control"
            placeholder="Costo máximo" 
            step="0.01" 
            min="0"
            value={filtros.costoMax}
            onChange={(e) => setFiltros({...filtros, costoMax: e.target.value})}
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
        <Link to="/programas/nuevo" className="btn btn-success">
          <i className="fas fa-plus-circle"></i> Nuevo Programa
        </Link>
      </div>
      
      <div className="table-container">
        {programas.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>No hay programas registrados</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Instructor</th>
                <th>Costo</th>
                <th>Duración (días)</th>
                <th>Cupo Disponible</th>
                <th>Fecha Inicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {programas.map((programa) => (
                <tr key={programa.id}>
                  <td>{programa.id}</td>
                  <td>{programa.nombre}</td>
                  <td>{programa.instructor || 'N/A'}</td>
                  <td>${programa.costo ? programa.costo.toFixed(2) : '0.00'}</td>
                  <td>{programa.duracionDias || 'N/A'}</td>
                  <td>{programa.cupoDisponible !== null ? programa.cupoDisponible : programa.cupo || 'N/A'}</td>
                  <td>{programa.fechaInicio || 'N/A'}</td>
                  <td>
                    <span className={`badge ${programa.activo ? 'badge-success' : 'badge-danger'}`}>
                      {programa.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/programas/detalle/${programa.id}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i> Ver
                      </Link>
                      <Link to={`/programas/editar/${programa.id}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i> Editar
                      </Link>
                      <button 
                        onClick={() => handleEliminar(programa.id)}
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

export default Programas;









