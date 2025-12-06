import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { clienteService } from '../services/clienteService';

const ClienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipoCliente: '',
    documentoIdentidad: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    notas: ''
  });

  useEffect(() => {
    if (id) {
      cargarCliente();
    }
  }, [id]);

  const cargarCliente = async () => {
    try {
      setLoading(true);
      const response = await clienteService.getById(id);
      if (response.data.success) {
        const cliente = response.data.data.cliente;
        setFormData({
          nombre: cliente.nombre || '',
          tipoCliente: cliente.tipoCliente || '',
          documentoIdentidad: cliente.documentoIdentidad || '',
          email: cliente.email || '',
          telefono: cliente.telefono || '',
          direccion: cliente.direccion || '',
          ciudad: cliente.ciudad || '',
          pais: cliente.pais || '',
          notas: cliente.notas || ''
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (id) {
        response = await clienteService.update(id, formData);
      } else {
        response = await clienteService.create(formData);
      }

      if (response.data.success) {
        alert(id ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
        navigate('/clientes');
      } else {
        setError(response.data.message || 'Error al guardar cliente');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="card">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>{id ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>

      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre: *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipoCliente">Tipo de Cliente: *</label>
          <select
            id="tipoCliente"
            name="tipoCliente"
            className="form-control"
            value={formData.tipoCliente}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione...</option>
            <option value="PERSONA">Persona</option>
            <option value="EMPRESA">Empresa</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="documentoIdentidad">Documento de Identidad:</label>
          <input
            type="text"
            id="documentoIdentidad"
            name="documentoIdentidad"
            className="form-control"
            value={formData.documentoIdentidad}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            className="form-control"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            className="form-control"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ciudad">Ciudad:</label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            className="form-control"
            value={formData.ciudad}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pais">País:</label>
          <input
            type="text"
            id="pais"
            name="pais"
            className="form-control"
            value={formData.pais}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notas">Notas:</label>
          <textarea
            id="notas"
            name="notas"
            className="form-control"
            rows="3"
            value={formData.notas}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-success" disabled={loading}>
            <i className="fas fa-save"></i> Guardar
          </button>
          <Link to="/clientes" className="btn btn-secondary">
            <i className="fas fa-times"></i> Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;









