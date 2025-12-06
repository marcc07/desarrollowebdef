import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { contratacionService } from '../services/contratacionService';
import { clienteService } from '../services/clienteService';
import { servicioService } from '../services/servicioService';

const ContratacionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [formData, setFormData] = useState({
    cliente: { id: null },
    servicioSeguridad: { id: null },
    fechaInicio: '',
    fechaFin: '',
    estado: 'PENDIENTE',
    observaciones: ''
  });

  useEffect(() => {
    cargarDatosIniciales();
    if (id) {
      cargarContratacion();
    }
  }, [id]);

  const cargarDatosIniciales = async () => {
    try {
      setLoadingData(true);
      const [clientesRes, serviciosRes] = await Promise.all([
        clienteService.getAll(),
        servicioService.getAll()
      ]);
      
      if (clientesRes.data.success) {
        setClientes(clientesRes.data.data);
      }
      if (serviciosRes.data.success) {
        setServicios(serviciosRes.data.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos');
    } finally {
      setLoadingData(false);
    }
  };

  const cargarContratacion = async () => {
    try {
      setLoading(true);
      const response = await contratacionService.getById(id);
      if (response.data.success) {
        const contratacion = response.data.data;
        setFormData({
          cliente: { id: contratacion.cliente?.id || null },
          servicioSeguridad: { id: contratacion.servicioSeguridad?.id || null },
          fechaInicio: contratacion.fechaInicio || '',
          fechaFin: contratacion.fechaFin || '',
          estado: contratacion.estado || 'PENDIENTE',
          observaciones: contratacion.observaciones || ''
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar contratación');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'clienteId') {
      setFormData({
        ...formData,
        cliente: { id: value ? parseInt(value) : null }
      });
    } else if (name === 'servicioId') {
      setFormData({
        ...formData,
        servicioSeguridad: { id: value ? parseInt(value) : null }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        cliente: formData.cliente.id ? { id: formData.cliente.id } : null,
        servicioSeguridad: formData.servicioSeguridad.id ? { id: formData.servicioSeguridad.id } : null
      };

      let response;
      if (id) {
        response = await contratacionService.update(id, dataToSend);
      } else {
        response = await contratacionService.create(dataToSend);
      }

      if (response.data.success) {
        const mensaje = id ? 'Contratación actualizada exitosamente' : 'Contratación creada exitosamente';
        const estadoInfo = (formData.estado === 'CONFIRMADA' || formData.estado === 'ACTIVA') 
          ? '\n\n📧 Se enviará un email automático al cliente si tiene email configurado.' 
          : '';
        alert(mensaje + estadoInfo);
        navigate('/contrataciones');
      } else {
        setError(response.data.message || 'Error al guardar contratación');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al guardar contratación');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="card">
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>{id ? 'Editar Contratación' : 'Nueva Contratación'}</h2>

      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="clienteId">Cliente: *</label>
          <select
            id="clienteId"
            name="clienteId"
            className="form-control"
            value={formData.cliente.id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un cliente...</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="servicioId">Servicio de Seguridad: *</label>
          <select
            id="servicioId"
            name="servicioId"
            className="form-control"
            value={formData.servicioSeguridad.id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un servicio...</option>
            {servicios.map((servicio) => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fechaInicio">Fecha Inicio:</label>
          <input
            type="date"
            id="fechaInicio"
            name="fechaInicio"
            className="form-control"
            value={formData.fechaInicio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fechaFin">Fecha Fin:</label>
          <input
            type="date"
            id="fechaFin"
            name="fechaFin"
            className="form-control"
            value={formData.fechaFin}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado: *</label>
          <select
            id="estado"
            name="estado"
            className="form-control"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="PENDIENTE">Pendiente</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="ACTIVA">Activa</option>
            <option value="FINALIZADA">Finalizada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <small className="form-text">
            <strong>📧 Nota:</strong> Se enviará un email automático al cliente cuando el estado sea "Confirmada" o "Activa"
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="observaciones">Observaciones:</label>
          <textarea
            id="observaciones"
            name="observaciones"
            className="form-control"
            rows="3"
            value={formData.observaciones}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-success" disabled={loading}>
            <i className="fas fa-save"></i> Guardar
          </button>
          <Link to="/contrataciones" className="btn btn-secondary">
            <i className="fas fa-times"></i> Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ContratacionForm;









