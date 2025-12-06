import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { programaService } from '../services/programaService';

const ProgramaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    contenido: '',
    requisitos: '',
    instructor: '',
    costo: '',
    duracionDias: '',
    cupo: '',
    fechaInicio: '',
    fechaFin: '',
    temario: '',
    activo: true
  });

  useEffect(() => {
    if (id) {
      cargarPrograma();
    }
  }, [id]);

  const cargarPrograma = async () => {
    try {
      setLoading(true);
      const response = await programaService.getById(id);
      if (response.data.success) {
        const programa = response.data.data;
        setFormData({
          nombre: programa.nombre || '',
          contenido: programa.contenido || '',
          requisitos: programa.requisitos || '',
          instructor: programa.instructor || '',
          costo: programa.costo || '',
          duracionDias: programa.duracionDias || '',
          cupo: programa.cupo || '',
          fechaInicio: programa.fechaInicio || '',
          fechaFin: programa.fechaFin || '',
          temario: programa.temario || '',
          activo: programa.activo !== undefined ? programa.activo : true
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar programa');
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
        costo: formData.costo ? parseFloat(formData.costo) : null,
        duracionDias: formData.duracionDias ? parseInt(formData.duracionDias) : null,
        cupo: formData.cupo ? parseInt(formData.cupo) : null
      };

      let response;
      if (id) {
        response = await programaService.update(id, dataToSend);
      } else {
        response = await programaService.create(dataToSend);
      }

      if (response.data.success) {
        alert(id ? 'Programa actualizado exitosamente' : 'Programa creado exitosamente');
        navigate('/programas');
      } else {
        setError(response.data.message || 'Error al guardar programa');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al guardar programa');
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
      <h2>{id ? 'Editar Programa' : 'Nuevo Programa'}</h2>

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
          <label htmlFor="contenido">Contenido: *</label>
          <textarea
            id="contenido"
            name="contenido"
            className="form-control"
            rows="4"
            value={formData.contenido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="requisitos">Requisitos:</label>
          <textarea
            id="requisitos"
            name="requisitos"
            className="form-control"
            rows="2"
            value={formData.requisitos}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructor">Instructor:</label>
          <input
            type="text"
            id="instructor"
            name="instructor"
            className="form-control"
            value={formData.instructor}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="costo">Costo:</label>
          <input
            type="number"
            id="costo"
            name="costo"
            className="form-control"
            step="0.01"
            min="0"
            value={formData.costo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="duracionDias">Duración (días):</label>
          <input
            type="number"
            id="duracionDias"
            name="duracionDias"
            className="form-control"
            min="1"
            value={formData.duracionDias}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cupo">Cupo:</label>
          <input
            type="number"
            id="cupo"
            name="cupo"
            className="form-control"
            min="1"
            value={formData.cupo}
            onChange={handleChange}
          />
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
          <label htmlFor="temario">Temario:</label>
          <textarea
            id="temario"
            name="temario"
            className="form-control"
            rows="4"
            value={formData.temario}
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
          <Link to="/programas" className="btn btn-secondary">
            <i className="fas fa-times"></i> Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProgramaForm;









