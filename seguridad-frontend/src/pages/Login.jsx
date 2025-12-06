import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import '../index.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si ya hay un usuario logueado, redirigir al dashboard
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard', { replace: true });
      return;
    }

    if (location.state?.message) {
      setMessage(location.state.message);
      // Limpiar el mensaje después de 5 segundos
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(username, password);
      console.log('Respuesta del login:', response);
      
      if (response && response.success) {
        // Guardar información del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('Usuario guardado en localStorage');
        // Pequeño delay para asegurar que se guarda antes de navegar
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        setError(response?.message || 'Error al iniciar sesión');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Error response:', err.response);
      if (err.response) {
        const errorMessage = err.response.data?.message || 
                           `Error ${err.response.status}: ${err.response.statusText}`;
        setError(errorMessage);
      } else if (err.request) {
        setError('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
      } else {
        setError('Error al iniciar sesión: ' + err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <img 
            src="/logo.svg" 
            alt="Logo"
            style={{ width: '100px', height: '100px', borderRadius: '20px', background: 'rgba(30, 60, 114, 0.1)', padding: '15px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
          />
        </div>
        <h2>Iniciar Sesión</h2>
        
        {message && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle"></i> <span>{message}</span>
          </div>
        )}
        
        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Usuario:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              required
              autoFocus
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Contraseña:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              required
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Iniciando sesión...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
              </>
            )}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '2px solid #e0e0e0' }}>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>¿No tienes una cuenta?</p>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%' }}
            onClick={() => navigate('/register')}
          >
            <i className="fas fa-user-plus"></i> Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

