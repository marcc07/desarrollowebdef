import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../index.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombreCompleto: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register(formData);
      
      if (response.success) {
        // Registro exitoso, redirigir al login
        navigate('/login', { 
          state: { message: 'Registro exitoso. Por favor inicia sesión.' } 
        });
      } else {
        setError(response.message || 'Error al registrar usuario');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al conectar con el servidor');
    } finally {
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
        <h2>Registro de Usuario</h2>
        
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
              placeholder="Ingresa tu usuario"
              value={formData.username}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nombreCompleto">
              <i className="fas fa-id-card"></i> Nombre Completo:
            </label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              className="form-control"
              required
              placeholder="Ingresa tu nombre completo"
              value={formData.nombreCompleto}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              required
              placeholder="Ingresa tu email"
              value={formData.email}
              onChange={handleChange}
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
                <i className="fas fa-spinner fa-spin"></i> Registrando...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i> Registrarse
              </>
            )}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '2px solid #e0e0e0' }}>
          <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>¿Ya tienes una cuenta?</p>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%' }}
            onClick={() => navigate('/login')}
          >
            <i className="fas fa-arrow-left"></i> Volver al Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;


