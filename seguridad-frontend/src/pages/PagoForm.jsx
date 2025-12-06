import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { pagoService } from '../services/pagoService';
import { clienteService } from '../services/clienteService';
import { contratacionService } from '../services/contratacionService';

const PagoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [contrataciones, setContrataciones] = useState([]);
  const [formData, setFormData] = useState({
    cliente: { id: null },
    contratacion: { id: null },
    monto: '',
    fechaPago: '',
    medioPago: '',
    estado: 'PENDIENTE',
    numeroReferencia: '',
    observaciones: ''
  });

  useEffect(() => {
    cargarDatosIniciales();
    if (id) {
      cargarPago();
    } else {
      setFormData(prev => ({ ...prev, fechaPago: new Date().toISOString().split('T')[0] }));
    }
  }, [id]);

  const cargarDatosIniciales = async () => {
    try {
      setLoadingData(true);
      const [clientesRes, contratacionesRes] = await Promise.all([
        clienteService.getAll(),
        contratacionService.getAll()
      ]);
      
      if (clientesRes.data.success) {
        setClientes(clientesRes.data.data);
      }
      if (contratacionesRes.data.success) {
        setContrataciones(contratacionesRes.data.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos');
    } finally {
      setLoadingData(false);
    }
  };

  const cargarPago = async () => {
    try {
      setLoading(true);
      const response = await pagoService.getById(id);
      if (response.data.success) {
        const pago = response.data.data;
        setFormData({
          cliente: { id: pago.cliente?.id || null },
          contratacion: { id: pago.contratacion?.id || null },
          monto: pago.monto || '',
          fechaPago: pago.fechaPago || '',
          medioPago: pago.medioPago || '',
          estado: pago.estado || 'PENDIENTE',
          numeroReferencia: pago.numeroReferencia || '',
          observaciones: pago.observaciones || ''
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar pago');
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
    } else if (name === 'contratacionId') {
      setFormData({
        ...formData,
        contratacion: { id: value ? parseInt(value) : null }
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
        contratacion: formData.contratacion.id ? { id: formData.contratacion.id } : null,
        monto: formData.monto ? parseFloat(formData.monto) : null
      };

      let response;
      if (id) {
        response = await pagoService.update(id, dataToSend);
      } else {
        response = await pagoService.create(dataToSend);
      }

      if (response.data.success) {
        alert(id ? 'Pago actualizado exitosamente' : 'Pago creado exitosamente');
        navigate('/pagos');
      } else {
        setError(response.data.message || 'Error al guardar pago');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al guardar pago');
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
      <h2>{id ? 'Editar Pago' : 'Nuevo Pago'}</h2>

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
          <label htmlFor="contratacionId">Contratación (Opcional):</label>
          <select
            id="contratacionId"
            name="contratacionId"
            className="form-control"
            value={formData.contratacion.id || ''}
            onChange={handleChange}
          >
            <option value="">Ninguna</option>
            {contrataciones.map((contratacion) => (
              <option key={contratacion.id} value={contratacion.id}>
                {contratacion.cliente?.nombre || 'N/A'} - {contratacion.servicioSeguridad?.nombre || 'N/A'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="monto">Monto: *</label>
          <input
            type="number"
            id="monto"
            name="monto"
            className="form-control"
            step="0.01"
            min="0.01"
            value={formData.monto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fechaPago">Fecha de Pago:</label>
          <input
            type="date"
            id="fechaPago"
            name="fechaPago"
            className="form-control"
            value={formData.fechaPago}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="medioPago">Medio de Pago:</label>
          <select
            id="medioPago"
            name="medioPago"
            className="form-control"
            value={formData.medioPago}
            onChange={handleChange}
          >
            <option value="">Seleccione...</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="CHEQUE">Cheque</option>
          </select>
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
            <option value="COMPLETADO">Completado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="numeroReferencia">Número de Referencia:</label>
          <input
            type="text"
            id="numeroReferencia"
            name="numeroReferencia"
            className="form-control"
            value={formData.numeroReferencia}
            onChange={handleChange}
          />
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
          <Link to="/pagos" className="btn btn-secondary">
            <i className="fas fa-times"></i> Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PagoForm;









