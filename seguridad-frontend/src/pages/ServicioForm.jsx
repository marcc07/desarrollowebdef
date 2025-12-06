import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { servicioService } from '../services/servicioService';

const ServicioForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    descripcion: '',
    ubicacion: '',
    precio: '',
    duracion: '',
    personalAsignado: '',
    horarios: '',
    herramientas: '',
    condiciones: '',
    activo: true
  });

  useEffect(() => {
    if (id) {
      cargarServicio();
    }
  }, [id]);

  const cargarServicio = async () => {
    try {
      setLoading(true);
      const response = await servicioService.getById(id);
      if (response.data.success) {
        const servicio = response.data.data;
        setFormData({
          nombre: servicio.nombre || '',
          tipo: servicio.tipo || '',
          descripcion: servicio.descripcion || '',
          ubicacion: servicio.ubicacion || '',
          precio: servicio.precio || '',
          duracion: servicio.duracion || '',
          personalAsignado: servicio.personalAsignado || '',
          horarios: servicio.horarios || '',
          herramientas: servicio.herramientas || '',
          condiciones: servicio.condiciones || '',
          activo: servicio.activo !== undefined ? servicio.activo : true
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        precio: formData.precio ? parseFloat(formData.precio) : null
      };

      let response;
      if (id) {
        response = await servicioService.update(id, dataToSend);
      } else {
        response = await servicioService.create(dataToSend);
      }

      if (response.data.success) {
        alert(id ? 'Servicio actualizado exitosamente' : 'Servicio creado exitosamente');
        navigate('/servicios');
      } else {
        setError(response.data.message || 'Error al guardar servicio');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al guardar servicio');
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
      <h2>{id ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>

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
          <label htmlFor="tipo">Tipo:</label>
          <select
            id="tipo"
            name="tipo"
            className="form-control"
            value={formData.tipo}
            onChange={handleChange}
          >
            <option value="">Seleccione...</option>
            <option value="VIGILANCIA_FIJA">Vigilancia Fija</option>
            <option value="PATRULLAJE_MOVIL">Patrullaje Móvil</option>
            <option value="ESCOLTA">Escolta</option>
            <option value="MONITOREO">Monitoreo</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción: *</label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="form-control"
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ubicacion">Ubicación:</label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            className="form-control"
            value={formData.ubicacion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            name="precio"
            className="form-control"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="duracion">Duración:</label>
          <input
            type="text"
            id="duracion"
            name="duracion"
            className="form-control"
            placeholder="Ej: Por hora, Por día, Mensual"
            value={formData.duracion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="personalAsignado">Personal Asignado:</label>
          <input
            type="text"
            id="personalAsignado"
            name="personalAsignado"
            className="form-control"
            value={formData.personalAsignado}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="horarios">Horarios:</label>
          <input
            type="text"
            id="horarios"
            name="horarios"
            className="form-control"
            value={formData.horarios}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="herramientas">Herramientas:</label>
          <input
            type="text"
            id="herramientas"
            name="herramientas"
            className="form-control"
            value={formData.herramientas}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="condiciones">Condiciones:</label>
          <textarea
            id="condiciones"
            name="condiciones"
            className="form-control"
            rows="2"
            value={formData.condiciones}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
            /> Activo
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-success" disabled={loading}>
            <i className="fas fa-save"></i> Guardar
          </button>
          <Link to="/servicios" className="btn btn-secondary">
            <i className="fas fa-times"></i> Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ServicioForm;









