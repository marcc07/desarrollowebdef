import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { programaService } from '../services/programaService';

const ProgramaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [programa, setPrograma] = useState(null);

  useEffect(() => {
    cargarPrograma();
  }, [id]);

  const cargarPrograma = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await programaService.getById(id);
      
      if (response.data.success) {
        setPrograma(response.data.data);
      } else {
        setError(response.data.message || 'Programa no encontrado');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar programa');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este programa?')) {
      return;
    }

    try {
      const response = await programaService.delete(id);
      if (response.data.success) {
        alert('Programa eliminado exitosamente');
        navigate('/programas');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar programa');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !programa) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error || 'Programa no encontrado'}</span>
        </div>
        <Link to="/programas" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Volver a Programas
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Detalle del Programa</h2>
        <div>
          <Link to={`/programas/editar/${id}`} className="btn btn-warning">
            <i className="fas fa-edit"></i> Editar
          </Link>
          <button onClick={handleEliminar} className="btn btn-danger" style={{ marginLeft: '0.5rem' }}>
            <i className="fas fa-trash"></i> Eliminar
          </button>
          <Link to="/programas" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
            <i className="fas fa-arrow-left"></i> Volver
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div>
          <h3>Información Básica</h3>
          <p><strong>ID:</strong> {programa.id}</p>
          <p><strong>Nombre:</strong> {programa.nombre}</p>
          <p><strong>Instructor:</strong> {programa.instructor || 'N/A'}</p>
          <p><strong>Costo:</strong> ${programa.costo ? programa.costo.toFixed(2) : '0.00'}</p>
          <p><strong>Duración:</strong> {programa.duracionDias || 'N/A'} días</p>
          <p><strong>Cupo Total:</strong> {programa.cupo || 'N/A'}</p>
          <p><strong>Cupo Disponible:</strong> {programa.cupoDisponible !== null ? programa.cupoDisponible : programa.cupo || 'N/A'}</p>
          <p><strong>Estado:</strong> 
            <span className={`badge ${programa.activo ? 'badge-success' : 'badge-danger'}`} style={{ marginLeft: '0.5rem' }}>
              {programa.activo ? 'Activo' : 'Inactivo'}
            </span>
          </p>
        </div>
        <div>
          <h3>Fechas</h3>
          <p><strong>Fecha Inicio:</strong> {programa.fechaInicio || 'N/A'}</p>
          <p><strong>Fecha Fin:</strong> {programa.fechaFin || 'N/A'}</p>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>Contenido</h3>
        <p>{programa.contenido || 'N/A'}</p>
      </div>

      {programa.requisitos && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Requisitos</h3>
          <p>{programa.requisitos}</p>
        </div>
      )}

      {programa.temario && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Temario</h3>
          <p>{programa.temario}</p>
        </div>
      )}
    </div>
  );
};

export default ProgramaDetalle;









