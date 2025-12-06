import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import ClienteForm from './pages/ClienteForm';
import ClienteDetalle from './pages/ClienteDetalle';
import Servicios from './pages/Servicios';
import ServicioForm from './pages/ServicioForm';
import ServicioDetalle from './pages/ServicioDetalle';
import Programas from './pages/Programas';
import ProgramaForm from './pages/ProgramaForm';
import ProgramaDetalle from './pages/ProgramaDetalle';
import Contrataciones from './pages/Contrataciones';
import ContratacionForm from './pages/ContratacionForm';
import ContratacionDetalle from './pages/ContratacionDetalle';
import Reservas from './pages/Reservas';
import ReservaForm from './pages/ReservaForm';
import ReservaDetalle from './pages/ReservaDetalle';
import Pagos from './pages/Pagos';
import PagoForm from './pages/PagoForm';
import PagoDetalle from './pages/PagoDetalle';
import Informes from './pages/Informes';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas */}
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
          
          {/* Clientes */}
          <Route path="/clientes" element={
            <ProtectedRoute>
              <Layout>
                <Clientes />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/clientes/nuevo" element={
            <ProtectedRoute>
              <Layout>
                <ClienteForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/clientes/editar/:id" element={
            <ProtectedRoute>
              <Layout>
                <ClienteForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/clientes/detalle/:id" element={
            <ProtectedRoute>
              <Layout>
                <ClienteDetalle />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Servicios */}
          <Route path="/servicios" element={
            <ProtectedRoute>
              <Layout>
                <Servicios />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/servicios/nuevo" element={
            <ProtectedRoute>
              <Layout>
                <ServicioForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/servicios/editar/:id" element={
            <ProtectedRoute>
              <Layout>
                <ServicioForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/servicios/detalle/:id" element={
            <ProtectedRoute>
              <Layout>
                <ServicioDetalle />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Programas */}
          <Route path="/programas" element={
            <ProtectedRoute>
              <Layout>
                <Programas />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/programas/nuevo" element={
            <ProtectedRoute>
              <Layout>
                <ProgramaForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/programas/editar/:id" element={
            <ProtectedRoute>
              <Layout>
                <ProgramaForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/programas/detalle/:id" element={
            <ProtectedRoute>
              <Layout>
                <ProgramaDetalle />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Contrataciones */}
          <Route path="/contrataciones" element={
            <ProtectedRoute>
              <Layout>
                <Contrataciones />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/contrataciones/nuevo" element={
            <ProtectedRoute>
              <Layout>
                <ContratacionForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/contrataciones/editar/:id" element={
            <ProtectedRoute>
              <Layout>
                <ContratacionForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/contrataciones/detalle/:id" element={
            <ProtectedRoute>
              <Layout>
                <ContratacionDetalle />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Reservas */}
          <Route path="/reservas" element={
            <ProtectedRoute>
              <Layout>
                <Reservas />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reservas/nuevo" element={
            <ProtectedRoute>
              <Layout>
                <ReservaForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reservas/editar/:id" element={
            <ProtectedRoute>
              <Layout>
                <ReservaForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reservas/detalle/:id" element={
            <ProtectedRoute>
              <Layout>
                <ReservaDetalle />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Pagos */}
          <Route path="/pagos" element={
            <ProtectedRoute>
              <Layout>
                <Pagos />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pagos/nuevo" element={
            <ProtectedRoute>
              <Layout>
                <PagoForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pagos/editar/:id" element={
            <ProtectedRoute>
              <Layout>
                <PagoForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pagos/detalle/:id" element={
            <ProtectedRoute>
              <Layout>
                <PagoDetalle />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Informes */}
          <Route path="/informes" element={
            <ProtectedRoute>
              <Layout>
                <Informes />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
    </Router>
  );
}

export default App;
