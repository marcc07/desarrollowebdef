import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { reservaService } from '../services/reservaService';
import { clienteService } from '../services/clienteService';
import { programaService } from '../services/programaService';

const ReservaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [formData, setFormData] = useState({
    cliente: { id: null },
    programaEntrenamiento: { id: null },
    fechaReserva: '',
    estado: 'PENDIENTE',
    observaciones: ''
  });

  useEffect(() => {
    cargarDatosIniciales();
    if (id) {
      cargarReserva();
    }
  }, [id]);

  const cargarDatosIniciales = async () => {
    try {
      setLoadingData(true);
      const [clientesRes, programasRes] = await Promise.all([
        clienteService.getAll(),
        programaService.getAll()
      ]);
      
      if (clientesRes.data.success) {
        setClientes(clientesRes.data.data);
      }
      if (programasRes.data.success) {
        setProgramas(programasRes.data.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos');
    } finally {
      setLoadingData(false);
    }
  };

  const cargarReserva = async () => {
    try {
      setLoading(true);
      const response = await reservaService.getById(id);
      if (response.data.success) {
        const reserva = response.data.data;
        setFormData({
          cliente: { id: reserva.cliente?.id || null },
          programaEntrenamiento: { id: reserva.programaEntrenamiento?.id || null },
          fechaReserva: reserva.fechaReserva || '',
          estado: reserva.estado || 'PENDIENTE',
          observaciones: reserva.observaciones || ''
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar reserva');
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
    } else if (name === 'programaId') {
      setFormData({
        ...formData,
        programaEntrenamiento: { id: value ? parseInt(value) : null }
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
        programaEntrenamiento: formData.programaEntrenamiento.id ? { id: formData.programaEntrenamiento.id } : null
      };

      let response;
      if (id) {
        response = await reservaService.update(id, dataToSend);
      } else {
        response = await reservaService.create(dataToSend);
      }

      if (response.data.success) {
        const mensaje = id ? 'Reserva actualizada exitosamente' : 'Reserva creada exitosamente';
        const estadoInfo = (formData.estado === 'CONFIRMADA' || formData.estado === 'ACTIVA') 
          ? '\n\n📧 Se enviará un email automático al cliente si tiene email configurado.' 
          : '';
        alert(mensaje + estadoInfo);
        navigate('/reservas');
      } else {
        setError(response.data.message || 'Error al guardar reserva');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al guardar reserva');
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
      <h2>{id ? 'Editar Reserva' : 'Nueva Reserva'}</h2>

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
          <label htmlFor="programaId">Programa de Entrenamiento: *</label>
          <select
            id="programaId"
            name="programaId"
            className="form-control"
            value={formData.programaEntrenamiento.id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un programa...</option>
            {programas.map((programa) => (
              <option key={programa.id} value={programa.id}>
                {programa.nombre} (Cupo: {programa.cupoDisponible !== null ? programa.cupoDisponible : programa.cupo || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fechaReserva">Fecha Reserva:</label>
          <input
            type="date"
            id="fechaReserva"
            name="fechaReserva"
            className="form-control"
            value={formData.fechaReserva}
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
            <option value="CANCELADA">Cancelada</option>
            <option value="COMPLETADA">Completada</option>
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
          <Link to="/reservas" className="btn btn-secondary">
            <i className="fas fa-times"></i> Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ReservaForm;









