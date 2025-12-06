# Documentación Frontend - Sistema de Seguridad y Entrenamiento

## 📁 Estructura del Proyecto Frontend

```
seguridad-frontend/
├── src/
│   ├── pages/                           # Páginas principales
│   │   ├── Home.jsx                     # Página de inicio
│   │   ├── Login.jsx                    # Formulario de login
│   │   ├── Register.jsx                 # Formulario de registro
│   │   ├── Dashboard.jsx                # Dashboard principal
│   │   ├── Clientes.jsx                 # Gestión de clientes
│   │   ├── ClienteForm.jsx              # Formulario cliente
│   │   ├── ClienteDetalle.jsx           # Detalle de cliente
│   │   ├── Servicios.jsx                # Gestión de servicios
│   │   ├── ServicioForm.jsx             # Formulario servicio
│   │   ├── ServicioDetalle.jsx          # Detalle de servicio
│   │   ├── Programas.jsx                # Gestión de programas
│   │   ├── ProgramaForm.jsx             # Formulario programa
│   │   ├── ProgramaDetalle.jsx          # Detalle de programa
│   │   ├── Contrataciones.jsx           # Gestión de contrataciones
│   │   ├── ContratacionForm.jsx         # Formulario contratación
│   │   ├── ContratacionDetalle.jsx      # Detalle de contratación
│   │   ├── Reservas.jsx                 # Gestión de reservas
│   │   ├── ReservaForm.jsx              # Formulario reserva
│   │   ├── ReservaDetalle.jsx           # Detalle de reserva
│   │   ├── Pagos.jsx                    # Gestión de pagos
│   │   ├── PagoForm.jsx                 # Formulario pago
│   │   ├── PagoDetalle.jsx              # Detalle de pago
│   │   ├── Informes.jsx                 # Reportes e informes
│   │
│   ├── components/                      # Componentes reutilizables
│   │   ├── Layout.jsx                   # Layout principal (Header, Sidebar, Footer)
│   │   ├── Layout.css                   # Estilos del layout
│   │   ├── ProtectedRoute.jsx           # Componente para rutas protegidas
│   │   
│   ├── services/                        # Servicios (API clients)
│   │   ├── api.js                       # Configuración de Axios
│   │   ├── authService.js               # Servicio de autenticación
│   │   ├── clienteService.js            # CRUD de clientes
│   │   ├── servicioService.js           # CRUD de servicios
│   │   ├── programaService.js           # CRUD de programas
│   │   ├── contratacionService.js       # CRUD de contrataciones
│   │   ├── reservaService.js            # CRUD de reservas
│   │   ├── pagoService.js               # CRUD de pagos
│   │   ├── dashboardService.js          # Datos del dashboard
│   │   ├── informeService.js            # Generación de informes
│   │
│   ├── utils/                           # Utilidades
│   │   ├── theme.js                     # Control de tema claro/oscuro
│   │
│   ├── assets/                          # Recursos estáticos
│   │
│   ├── App.jsx                          # Componente raíz
│   ├── App.css                          # Estilos principales
│   ├── main.jsx                         # Punto de entrada
│   ├── index.css                        # Estilos globales
│
├── public/                              # Archivos públicos
│   ├── logo.svg                         # Logo de la aplicación
│
├── package.json                         # Dependencias NPM
├── package-lock.json                    # Lock file de dependencias
├── vite.config.js                       # Configuración de Vite
├── tailwind.config.js                   # Configuración de Tailwind CSS
├── postcss.config.js                    # Configuración de PostCSS
├── eslint.config.js                     # Configuración de ESLint
├── index.html                           # HTML principal
└── .env.local (opcional)                # Variables de entorno
```

---

## 🚀 Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de build
npm run preview

# Linting
npm run lint
```

---

## 🔑 Variables de Entorno

Crear archivo `.env.local` en la raíz de `seguridad-frontend/`:

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Sistema de Seguridad y Entrenamiento
```

---

## 🎯 Servicios API

### `api.js` - Cliente HTTP

Configuración centralizada de Axios para todas las llamadas HTTP:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000
});

// Interceptores para autenticación automática
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Servicios Disponibles

#### `authService.js`
```javascript
export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout')
};
```

#### `clienteService.js`
```javascript
export const clienteService = {
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post('/clientes', data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  delete: (id) => api.delete(`/clientes/${id}`)
};
```

#### `servicioService.js`, `programaService.js`, etc.
Siguen el mismo patrón CRUD.

---

## 🎨 Sistema de Temas

### Archivo: `src/utils/theme.js`

Gestiona el cambio entre tema claro y oscuro usando DOM manipulation:

```javascript
// Inicializar tema desde localStorage
initTheme()

// Toggle entre 'light' y 'dark'
toggleTheme()

// Obtener tema actual
getTheme()
```

### Uso en Componentes

```jsx
import { toggleTheme, getTheme } from '../utils/theme';

const MyComponent = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  return (
    <button onClick={handleToggle}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};
```

### Variables CSS (Dark Mode)

En `index.css`:

```css
:root {
  --bg-color: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  --text-color: #1f2937;
  --surface: #ffffff;
}

html.dark {
  --bg-color: linear-gradient(135deg, #071024 0%, #0f172a 100%);
  --text-color: #e6eef6;
  --surface: #0b1220;
}
```

---

## 🔐 Autenticación y Rutas Protegidas

### `ProtectedRoute.jsx`

Componente que protege rutas que requieren autenticación:

```jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
```

### Uso en App.jsx

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<Home />} />
  
  <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/clientes" element={<Clientes />} />
    {/* Más rutas protegidas */}
  </Route>
</Routes>
```

---

## 📱 Componentes Principales

### `Layout.jsx` - Layout Principal

Estructura básica de todas las páginas protegidas:

- **Header:** Logo, nombre de usuario, botón de tema, cerrar sesión
- **Sidebar:** Menú de navegación
- **Content:** Área de contenido dinámico
- **Footer:** Links y copyright

```jsx
<Layout>
  {children} {/* Contenido específico de la página */}
</Layout>
```

### `Home.jsx` - Página de Inicio

Página pública con:
- Sección Hero
- Información sobre la empresa
- Misión y Visión
- Valores
- Servicios preview
- Call-to-action
- **Botón de tema en esquina superior derecha**

### `Login.jsx` - Formulario de Login

```jsx
<form onSubmit={handleSubmit}>
  <input type="text" placeholder="Usuario" value={username} />
  <input type="password" placeholder="Contraseña" value={password} />
  <button type="submit">Iniciar Sesión</button>
</form>
```

### Páginas CRUD (Clientes, Servicios, etc.)

Estructura típica:

```jsx
// Lista
<Clientes />
  ├─ Tabla con listado
  ├─ Botones de editar/eliminar
  └─ Botón crear nuevo

// Formulario
<ClienteForm />
  ├─ Campos de entrada
  └─ Botones guardar/cancelar

// Detalle
<ClienteDetalle />
  ├─ Vista de lectura
  └─ Botones editar/volver
```

---

## 🎨 Estilos y CSS

### Tailwind CSS

Configuración en `tailwind.config.js`:

```javascript
export default {
  darkMode: 'class',  // Activa modo oscuro por clase
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3c72',
        secondary: '#f39c12',
      },
    },
  },
};
```

### Bootstrap CSS

Importado en `index.css`:

```css
@import 'bootstrap/dist/css/bootstrap.min.css';
```

### CSS Global (`index.css`)

Define:
- Variables CSS para colores y sombras
- Estilos base para elementos
- Respuesta del sistema a cambio de tema
- Transiciones suaves

---

## 🔄 Flujo de Datos

### Ejemplo: Gestión de Clientes

```
Home/Dashboard
    ↓
Clientes.jsx (lista)
    ↓
clienteService.getAll() → API Backend
    ↓
Renderizar tabla
    ↓
Click "Editar"
    ↓
ClienteForm.jsx (formulario)
    ↓
clienteService.update() → API Backend
    ↓
Actualizar lista / Volver a Clientes.jsx
```

---

## 🧪 Testing (Opcional)

Aunque no está implementado, se puede añadir Vitest:

```bash
npm install -D vitest
```

Crear `__tests__/components/Button.test.jsx`:

```javascript
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../../src/components/Button';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## 🚢 Build y Deploy

### Compilar para Producción

```bash
npm run build
```

Genera carpeta `dist/` con archivos optimizados.

### Servir Producción Localmente

```bash
npm run preview
```

### Deploy en Vercel

```bash
npm install -g vercel
vercel
```

### Deploy en Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🐛 Debugging

### React DevTools

Instalar extensión de navegador:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

### Vite Inspect

```bash
npm run dev -- --inspect
```

### Logs en Consola

```javascript
console.log('Valor:', valor);
console.table(arrayData);
console.error('Error:', error);
```

---

## 📝 Convenciones de Código

### Nombres de Archivos

- Componentes: `MiComponente.jsx` (PascalCase)
- Servicios: `miService.js` (camelCase)
- Utilidades: `miUtil.js` (camelCase)
- Estilos: `MiComponente.css` (igual al componente)

### Estructura de Componente

```jsx
import { useState, useEffect } from 'react';
import { serviceName } from '../services/serviceName';
import './MiComponente.css';

const MiComponente = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Efecto
  }, [dependencies]);

  const handleClick = () => {
    // Handler
  };

  return (
    <div className="mi-componente">
      {/* JSX */}
    </div>
  );
};

export default MiComponente;
```

### Imports

```javascript
// React
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Servicios
import { serviceName } from '../services/serviceName';

// Componentes
import Layout from '../components/Layout';

// Estilos
import './MiComponente.css';
```

---

## 🔗 Referencias Útiles

- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Bootstrap Docs](https://getbootstrap.com)
- [Vite Docs](https://vitejs.dev)
- [Axios Docs](https://axios-http.com)

---

**Última actualización:** Diciembre 4, 2025
