# Sistema de Seguridad y Entrenamiento

## 📋 Descripción General

**Sistema de Gestión Integral para Empresa de Seguridad y Entrenamiento Profesional**

Es una aplicación web moderna que permite gestionar integralmente los servicios de seguridad privada y programas de entrenamiento profesional. El sistema facilita la administración de clientes, servicios, programas, contrataciones, reservas, pagos e informes.

**Stack Tecnológico:**
- **Backend:** Spring Boot 3.5.7 + Java 17
- **Frontend:** React 19 + Vite + Tailwind CSS + Bootstrap 5
- **Base de Datos:** H2 (desarrollo)
- **Autenticación:** Spring Security

---

## 🏗️ Estructura del Proyecto

```
Desarrollo_web/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ProyectoFinal/
│   │   │       └── ProyectoFinal_Ander/
│   │   │           ├── config/          # Configuraciones (CORS, Security)
│   │   │           ├── controller/      # Controladores REST
│   │   │           ├── dto/             # Data Transfer Objects
│   │   │           ├── model/           # Entidades JPA
│   │   │           ├── repository/      # Interfaces de persistencia
│   │   │           └── service/         # Lógica de negocios
│   │   └── resources/
│   │       ├── application.properties   # Configuración de Spring
│   │       ├── static/                  # Archivos estáticos
│   │       └── templates/               # Plantillas Thymeleaf
│   └── test/
│       └── java/                        # Tests unitarios
├── seguridad-frontend/                  # Aplicación React
│   ├── src/
│   │   ├── pages/                       # Páginas (Login, Home, Dashboard)
│   │   ├── components/                  # Componentes reutilizables
│   │   ├── services/                    # Servicios de API
│   │   ├── utils/                       # Utilidades (tema, etc)
│   │   ├── App.jsx                      # Componente raíz
│   │   ├── main.jsx                     # Punto de entrada
│   │   └── index.css                    # Estilos globales
│   ├── public/                          # Archivos públicos
│   ├── package.json                     # Dependencias Node
│   ├── vite.config.js                   # Configuración Vite
│   ├── tailwind.config.js               # Configuración Tailwind
│   └── index.html                       # HTML principal
├── pom.xml                              # Dependencias Maven
├── mvnw / mvnw.cmd                      # Maven Wrapper
├── run-all.bat                          # Script para ejecutar ambos servicios (Windows)
├── run-all.ps1                          # Script PowerShell para ejecutar servicios
└── iniciar-backend.bat / iniciar-frontend.bat  # Scripts individuales
```

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Java 17+** instalado
- **Node.js 18+** y npm instalados
- **Git** para control de versiones
- Editor de código recomendado: **VS Code**

### Instalación

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/ander0812/Desarrollo_web.git
cd Desarrollo_web
```

#### 2. Configuración Backend (Spring Boot)

```bash
# Navegar a la carpeta raíz del proyecto
cd Desarrollo_web

# Compilar y ejecutar con Maven
mvn clean install
mvn spring-boot:run

# O usando el Maven Wrapper
./mvnw spring-boot:run      # Linux/Mac
mvnw.cmd spring-boot:run    # Windows
```

**Backend disponible en:** `http://localhost:8080`

#### OpenAPI / Swagger UI

Una vez que el backend esté ejecutándose, puedes acceder a la documentación interactiva de la API:

- **Swagger UI (Documentación interactiva):** `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI JSON (Especificación):** `http://localhost:8080/v3/api-docs`

En Swagger UI puedes:
- Ver todos los endpoints disponibles
- Leer descripciones y ejemplos
- Probar los endpoints directamente
- Ver esquemas de solicitud/respuesta

#### 3. Configuración Frontend (React)

```bash
# Navegar a la carpeta del frontend
cd seguridad-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

**Frontend disponible en:** `http://localhost:5173`

### Ejecutar Ambos Servicios Simultáneamente (Windows)

**Opción 1: Script Batch**
```bash
.\run-all.bat
```

**Opción 2: PowerShell**
```powershell
.\run-all.ps1
# O con bypass de policy:
powershell -ExecutionPolicy Bypass -File .\run-all.ps1
```

---

## 🎨 Características Principales

### 1. **Sistema de Autenticación**
- Login con usuario y contraseña
- Registro de nuevos usuarios
- Sesiones seguras con Spring Security
- Protección de rutas con JWT/Session tokens

### 2. **Gestión de Clientes**
- CRUD completo de clientes
- Visualización de detalles
- Búsqueda y filtrado
- Historial de contrataciones

### 3. **Servicios de Seguridad**
- Catálogo de servicios disponibles
- Descripción y precios
- Disponibilidad temporal
- Asignación a clientes

### 4. **Programas de Entrenamiento**
- Gestión de programas de capacitación
- Horarios y duraciones
- Instructores asignados
- Seguimiento de participantes

### 5. **Contrataciones**
- Creación de contratos
- Asignación de servicios y programas
- Seguimiento de estado
- Historial de cambios

### 6. **Reservas**
- Sistema de disponibilidad
- Calendario interactivo
- Confirmación automática
- Notificaciones

### 7. **Gestión de Pagos**
- Registro de pagos
- Estados de pago (pendiente, pagado, vencido)
- Facturas e invoices
- Reportes financieros

### 8. **Informes**
- Reportes de ingresos
- Análisis de clientes
- Frecuencia de servicios
- Estadísticas generales

### 9. **Tema Claro/Oscuro**
- Toggle de tema en la página Home (esquina superior derecha)
- Toggle de tema en el header (al lado del nombre de usuario)
- Preferencia guardada en localStorage
- Transiciones suaves entre temas
- Estilos optimizados para legibilidad en ambos modos

---

## 🛠️ Configuración

### Backend - `application.properties`

```properties
# Puerto del servidor
server.port=8080

# Base de datos H2
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.h2.console.enabled=true

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update

# Thymeleaf
spring.thymeleaf.cache=false
```

### Frontend - Variables de Entorno

Crear `.env.local` en `seguridad-frontend/`:

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Sistema de Seguridad y Entrenamiento
```

### CORS Configuration

El backend incluye configuración CORS para permitir requests desde `http://localhost:5173`.

---

## 📱 Páginas y Rutas

### Frontend (React Router)

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Home (Dashboard público) | Público |
| `/login` | Formulario de login | Público |
| `/register` | Registro de nuevos usuarios | Público |
| `/dashboard` | Dashboard principal | Autenticado |
| `/clientes` | Gestión de clientes | Autenticado |
| `/servicios` | Gestión de servicios | Autenticado |
| `/programas` | Gestión de programas | Autenticado |
| `/contrataciones` | Gestión de contrataciones | Autenticado |
| `/reservas` | Gestión de reservas | Autenticado |
| `/pagos` | Gestión de pagos | Autenticado |
| `/informes` | Reportes e informes | Autenticado |

---

## 🔐 Autenticación y Seguridad

### Flujo de Login

1. Usuario ingresa credenciales en `/login`
2. Frontend envía POST a `/api/auth/login`
3. Backend valida contra BD y retorna token/sesión
4. Frontend almacena datos en `localStorage`
5. Rutas protegidas verifican autenticación

### Protección de Rutas

```jsx
// Componente ProtectedRoute en React
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

---

## 🎨 Diseño y Estilos

### Tecnologías CSS

- **Tailwind CSS:** Utilidades de diseño responsivo
- **Bootstrap 5:** Componentes prediseñados
- **CSS Custom Variables:** Para tema claro/oscuro
- **Transiciones suaves:** Animaciones al cambiar tema

### Sistema de Temas

**Archivo clave:** `seguridad-frontend/src/utils/theme.js`

```javascript
// Toggle tema (alterna entre 'light' y 'dark')
toggleTheme()

// Obtener tema actual
getTheme()

// Inicializar tema desde localStorage
initTheme()
```

**Variables CSS en modo oscuro:**
- Fondo: `#071024` a `#0f172a`
- Texto: `#e6eef6` (blanco claro)
- Superficies: `#0b1220`
- Iconos: Naranja `#f39c12`

---

## 📦 Dependencias Principales

### Backend (Maven)

```xml
<!-- Spring Boot -->
<spring-boot-starter-web>
<spring-boot-starter-data-jpa>
<spring-boot-starter-security>

<!-- Database -->
<h2database>

<!-- View Template -->
<spring-boot-starter-thymeleaf>
```

### Frontend (npm)

```json
{
  "react": "^19.2.0",
  "react-router-dom": "^6.28.0",
  "axios": "^1.7.9",
  "bootstrap": "^5.3.3",
  "tailwindcss": "latest"
}
```

---

## 🧪 Testing

### Backend - JUnit + MockMvc

```bash
mvn test
```

### Frontend - Vitest (opcional)

```bash
npm run test
```

---

## 📚 API Endpoints (Ejemplos)

### Autenticación

```
POST   /api/auth/login          - Iniciar sesión
POST   /api/auth/register       - Registrarse
POST   /api/auth/logout         - Cerrar sesión
```

### Clientes

```
GET    /api/clientes            - Listar clientes
POST   /api/clientes            - Crear cliente
GET    /api/clientes/{id}       - Obtener cliente
PUT    /api/clientes/{id}       - Actualizar cliente
DELETE /api/clientes/{id}       - Eliminar cliente
```

### Servicios

```
GET    /api/servicios           - Listar servicios
POST   /api/servicios           - Crear servicio
GET    /api/servicios/{id}      - Obtener servicio
PUT    /api/servicios/{id}      - Actualizar servicio
DELETE /api/servicios/{id}      - Eliminar servicio
```

### Programas

```
GET    /api/programas           - Listar programas
POST   /api/programas           - Crear programa
GET    /api/programas/{id}      - Obtener programa
PUT    /api/programas/{id}      - Actualizar programa
DELETE /api/programas/{id}      - Eliminar programa
```

*(Similar para contrataciones, reservas, pagos, informes)*

---

## 🐛 Troubleshooting

### Backend no inicia

```bash
# Verificar que el puerto 8080 esté disponible
# En Windows:
netstat -ano | findstr :8080

# Cambiar puerto en application.properties
server.port=8081
```

### Frontend no carga

```bash
# Limpiar caché y reinstalar
rm -rf node_modules
npm install
npm run dev
```

### CORS errors

Verificar que `application.properties` incluya:

```properties
# Configuración CORS en backend
server.servlet.context-path=/api
```

### Tema oscuro no se aplica

1. Reiniciar dev server (requiere recompilación de Tailwind)
2. Limpiar caché: `Ctrl+F5` en navegador
3. Verificar que `tailwind.config.js` tenga `darkMode: 'class'`

---

## 📝 Guía de Desarrollo

### Agregar nueva página

1. Crear archivo en `seguridad-frontend/src/pages/MiPagina.jsx`
2. Importar en `App.jsx` y crear ruta
3. Conectar servicio API en `seguridad-frontend/src/services/`
4. Añadir styles globales en `index.css` si es necesario

### Crear nuevo componente

1. Crear en `seguridad-frontend/src/components/MiComponente.jsx`
2. Exportar y reutilizar en múltiples páginas
3. Mantener componentes pequeños y reutilizables

### Estructura de un Service

```javascript
// seguridad-frontend/src/services/miService.js
import api from './api';

export const miService = {
  getAll: () => api.get('/mi-ruta'),
  getById: (id) => api.get(`/mi-ruta/${id}`),
  create: (data) => api.post('/mi-ruta', data),
  update: (id, data) => api.put(`/mi-ruta/${id}`, data),
  delete: (id) => api.delete(`/mi-ruta/${id}`)
};
```

---

## 🚢 Despliegue

### Build Frontend para Producción

```bash
cd seguridad-frontend
npm run build
# Genera carpeta 'dist/' lista para servir
```

### Build Backend para Producción

```bash
mvn clean package -DskipTests
# Genera JAR en target/ ejecutable
java -jar target/ProyectoFinal-Ander-0.0.1-SNAPSHOT.jar
```

### Opciones de Hosting

- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Heroku, AWS EC2, Railway, Render
- **Base de Datos:** PostgreSQL en producción (cambiar H2)

---

## 📞 Contacto y Soporte

**Autor:** Ander  
**Repositorio:** https://github.com/ander0812/Desarrollo_web  
**Issues:** Reportar bugs en la sección Issues del repositorio

---

## 📄 Licencia

Este proyecto está bajo licencia libre para uso educativo y comercial.

---

**Última actualización:** Diciembre 4, 2025
