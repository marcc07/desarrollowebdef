import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import './Layout.css';
import { initTheme, toggleTheme, getTheme } from '../utils/theme';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Theme init: only read saved preference from localStorage
  useEffect(() => {
    initTheme();
    setTheme(getTheme());
  }, []);

  const handleToggleTheme = () => {
    const newTheme = toggleTheme();
    if (newTheme) setTheme(newTheme);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/logo.svg" alt="Logo" />
          <h1>Sistema de Seguridad y Entrenamiento</h1>
        </div>
        <div className="user-info">
          <i className="fas fa-user-circle"></i>
          <span>{user?.nombreCompleto || user?.username || 'Usuario'}</span>
          <button
            className="btn btn-sm btn-secondary theme-btn-header"
            onClick={handleToggleTheme}
            title="Cambiar tema (Claro/Oscuro)"
            aria-label="Cambiar tema (Claro/Oscuro)"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="main-container">
        {/* Sidebar */}
        <nav className="sidebar">
          <ul>
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                <i className="fas fa-chart-line"></i> <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/clientes" className={isActive('/clientes') ? 'active' : ''}>
                <i className="fas fa-users"></i> <span>Clientes</span>
              </Link>
            </li>
            <li>
              <Link to="/servicios" className={isActive('/servicios') ? 'active' : ''}>
                <i className="fas fa-shield-alt"></i> <span>Servicios de Seguridad</span>
              </Link>
            </li>
            <li>
              <Link to="/programas" className={isActive('/programas') ? 'active' : ''}>
                <i className="fas fa-graduation-cap"></i> <span>Programas de Entrenamiento</span>
              </Link>
            </li>
            <li>
              <Link to="/contrataciones" className={isActive('/contrataciones') ? 'active' : ''}>
                <i className="fas fa-file-contract"></i> <span>Contrataciones</span>
              </Link>
            </li>
            <li>
              <Link to="/reservas" className={isActive('/reservas') ? 'active' : ''}>
                <i className="fas fa-calendar-check"></i> <span>Reservas</span>
              </Link>
            </li>
            <li>
              <Link to="/pagos" className={isActive('/pagos') ? 'active' : ''}>
                <i className="fas fa-credit-card"></i> <span>Pagos</span>
              </Link>
            </li>
            <li>
              <Link to="/informes" className={isActive('/informes') ? 'active' : ''}>
                <i className="fas fa-chart-bar"></i> <span>Informes</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Content */}
        <main className="content">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <Link to="/"><i className="fas fa-chart-line"></i> Dashboard</Link>
        <Link to="/clientes"><i className="fas fa-users"></i> Clientes</Link>
        <Link to="/servicios"><i className="fas fa-shield-alt"></i> Servicios</Link>
        <Link to="/programas"><i className="fas fa-graduation-cap"></i> Programas</Link>
        <Link to="/contrataciones"><i className="fas fa-file-contract"></i> Contrataciones</Link>
        <Link to="/reservas"><i className="fas fa-calendar-check"></i> Reservas</Link>
        <Link to="/pagos"><i className="fas fa-credit-card"></i> Pagos</Link>
        <Link to="/informes"><i className="fas fa-chart-bar"></i> Informes</Link>
      </footer>
    </div>
  );
};

export default Layout;

