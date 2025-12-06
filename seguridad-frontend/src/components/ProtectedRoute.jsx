import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Verificar si hay usuario en localStorage
  const user = localStorage.getItem('user');
  
  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, permitir acceso
  // La validación con el backend se hará cuando se intente usar la API
  // Si falla, el interceptor de Axios redirigirá automáticamente
  return children;
};

export default ProtectedRoute;


