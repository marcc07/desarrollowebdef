import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalServicios: 0,
    totalProgramas: 0,
    totalContrataciones: 0,
    totalReservas: 0,
    totalPagos: 0
  });
  const [estadisticas, setEstadisticas] = useState(null);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboard();
      
      if (response.data.success) {
        const datos = response.data.data;
        setStats({
          totalClientes: datos.totalClientes || 0,
          totalServicios: datos.totalServicios || 0,
          totalProgramas: datos.totalProgramas || 0,
          totalContrataciones: datos.totalContrataciones || 0,
          totalReservas: datos.totalReservas || 0,
          totalPagos: datos.totalPagos || 0
        });
        setEstadisticas(datos.estadisticas || null);
      } else {
        setError(response.data.message || 'Error al cargar dashboard');
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response) {
        // El servidor respondió con un código de error
        setError(err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`);
      } else if (err.request) {
        // La petición se hizo pero no hubo respuesta
        setError('Error al conectar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:8080');
      } else {
        // Error al configurar la petición
        setError('Error al realizar la petición: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <h2><i className="fas fa-chart-line"></i> Dashboard - Sistema de Seguridad y Entrenamiento</h2>
        
        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
            <button onClick={cargarDashboard} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
              Reintentar
            </button>
          </div>
        )}
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-users"></i></div>
            <h3>Clientes</h3>
            <div className="value">{stats.totalClientes}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-shield-alt"></i></div>
            <h3>Servicios</h3>
            <div className="value">{stats.totalServicios}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-graduation-cap"></i></div>
            <h3>Programas</h3>
            <div className="value">{stats.totalProgramas}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-file-contract"></i></div>
            <h3>Contrataciones</h3>
            <div className="value">{stats.totalContrataciones}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-calendar-check"></i></div>
            <h3>Reservas</h3>
            <div className="value">{stats.totalReservas}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-credit-card"></i></div>
            <h3>Pagos</h3>
            <div className="value">{stats.totalPagos}</div>
          </div>
        </div>
      </div>

      {estadisticas && (
        <div className="card">
          <h2><i className="fas fa-chart-bar"></i> Resumen de Actividad</h2>
          <div className="stats-grid">
            {estadisticas.ingresosTotales != null && (
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
                <h3>Ingresos Totales</h3>
                <div className="value">${estadisticas.ingresosTotales.toFixed(2)}</div>
              </div>
            )}
            {estadisticas.contratacionesEsteMes != null && (
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-file-contract"></i></div>
                <h3>Contrataciones Este Mes</h3>
                <div className="value">{estadisticas.contratacionesEsteMes}</div>
              </div>
            )}
            {estadisticas.reservasEsteMes != null && (
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-calendar-check"></i></div>
                <h3>Reservas Este Mes</h3>
                <div className="value">{estadisticas.reservasEsteMes}</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="card">
        <h2><i className="fas fa-bolt"></i> Accesos Rápidos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Link to="/clientes/nuevo" className="btn btn-primary">
            <i className="fas fa-user-plus"></i> Nuevo Cliente
          </Link>
          <Link to="/servicios/nuevo" className="btn btn-primary">
            <i className="fas fa-plus-circle"></i> Nuevo Servicio
          </Link>
          <Link to="/programas/nuevo" className="btn btn-primary">
            <i className="fas fa-plus-circle"></i> Nuevo Programa
          </Link>
          <Link to="/contrataciones/nuevo" className="btn btn-primary">
            <i className="fas fa-file-contract"></i> Nueva Contratación
          </Link>
          <Link to="/reservas/nuevo" className="btn btn-primary">
            <i className="fas fa-calendar-plus"></i> Nueva Reserva
          </Link>
          <Link to="/pagos/nuevo" className="btn btn-primary">
            <i className="fas fa-money-bill-wave"></i> Nuevo Pago
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
