import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clienteService } from '../services/clienteService';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipoCliente: '',
    ciudad: '',
    email: '',
    telefono: '',
    documento: ''
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await clienteService.getAll(params);
      
      if (response.data.success) {
        setClientes(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar clientes');
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
    if (filtros.tipoCliente) params.tipoCliente = filtros.tipoCliente;
    if (filtros.ciudad) params.ciudad = filtros.ciudad;
    if (filtros.email) params.email = filtros.email;
    if (filtros.telefono) params.telefono = filtros.telefono;
    if (filtros.documento) params.documento = filtros.documento;
    cargarClientes(params);
  };

  const handleLimpiar = () => {
    setFiltros({
      busqueda: '',
      tipoCliente: '',
      ciudad: '',
      email: '',
      telefono: '',
      documento: ''
    });
    cargarClientes();
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) {
      return;
    }

    try {
      const response = await clienteService.delete(id);
      if (response.data.success) {
        alert('Cliente eliminado exitosamente');
        cargarClientes();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar cliente');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Gestión de Clientes</h2>
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={() => cargarClientes()} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
            Reintentar
          </button>
        </div>
      )}

      <div className="search-bar">
        <form onSubmit={handleBuscar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <input 
            type="text" 
            className="form-control"
            placeholder="Buscar por nombre, email, documento..." 
            value={filtros.busqueda}
            onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
          />
          <select 
            className="form-control"
            value={filtros.tipoCliente}
            onChange={(e) => setFiltros({...filtros, tipoCliente: e.target.value})}
          >
            <option value="">Todos los tipos</option>
            <option value="PERSONA">Persona</option>
            <option value="EMPRESA">Empresa</option>
          </select>
          <input 
            type="text" 
            className="form-control"
            placeholder="Ciudad" 
            value={filtros.ciudad}
            onChange={(e) => setFiltros({...filtros, ciudad: e.target.value})}
          />
          <input 
            type="email" 
            className="form-control"
            placeholder="Email" 
            value={filtros.email}
            onChange={(e) => setFiltros({...filtros, email: e.target.value})}
          />
          <input 
            type="text" 
            className="form-control"
            placeholder="Teléfono" 
            value={filtros.telefono}
            onChange={(e) => setFiltros({...filtros, telefono: e.target.value})}
          />
          <input 
            type="text" 
            className="form-control"
            placeholder="Documento" 
            value={filtros.documento}
            onChange={(e) => setFiltros({...filtros, documento: e.target.value})}
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
        <Link to="/clientes/nuevo" className="btn btn-success">
          <i className="fas fa-user-plus"></i> Nuevo Cliente
        </Link>
      </div>
      
      <div className="table-container">
        {clientes.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>No hay clientes registrados</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.tipoCliente || 'N/A'}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.ciudad}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/clientes/detalle/${cliente.id}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i> Ver
                      </Link>
                      <Link to={`/clientes/editar/${cliente.id}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i> Editar
                      </Link>
                      <button 
                        onClick={() => handleEliminar(cliente.id)}
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

export default Clientes;
