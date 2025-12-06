# Guía de Desarrollo - Sistema de Seguridad y Entrenamiento

## 📚 Tabla de Contenidos

1. [Ambiente de Desarrollo](#ambiente-de-desarrollo)
2. [Primeros Pasos](#primeros-pasos)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Flujo de Trabajo](#flujo-de-trabajo)
5. [Convenciones de Código](#convenciones-de-código)
6. [Debugging](#debugging)
7. [Deployment](#deployment)
8. [FAQ](#faq)

---

## 🖥️ Ambiente de Desarrollo

### Requisitos Previos

```
- Windows 10/11 o Linux/Mac
- Java 17+
- Node.js 18+ con npm
- Git
- IDE: Visual Studio Code o IntelliJ IDEA
- Postman (opcional, para testing de API)
```

### Herramientas Recomendadas

**Para Backend:**
- IntelliJ IDEA Community (gratuito)
- Spring Tools Suite (gratuito)
- Postman para testing de API
- DBeaver para visualizar BD

**Para Frontend:**
- Visual Studio Code
- React DevTools (extensión navegador)
- ESLint (extensión VSCode)
- Prettier (extensión VSCode)

### Instalación del Ambiente

#### Windows

```powershell
# 1. Instalar Chocolatey (si no está instalado)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
irm https://community.chocolatey.org/install.ps1 | iex

# 2. Instalar dependencias
choco install nodejs openjdk17 git -y

# 3. Verificar instalación
java -version
node --version
npm --version
```

#### Linux (Ubuntu/Debian)

```bash
# Actualizar
sudo apt update && sudo apt upgrade -y

# Instalar Java 17
sudo apt install openjdk-17-jdk -y

# Instalar Node.js y npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Verificar
java -version
node --version
npm --version
```

---

## 🚀 Primeros Pasos

### 1. Clonar el Repositorio

```bash
cd c:/ruta/proyecto
git clone <url-repositorio>
cd Desarrollo_web
```

### 2. Configurar Backend

```bash
# Navegar a raíz del proyecto
cd c:/Users/Marlon\ Alexis\ CC/Downloads/Desarrollo_web

# Compilar
mvnw.cmd clean install

# O usando Maven instalado globalmente
mvn clean install

# Ejecutar
mvn spring-boot:run
```

Backend estará en: **http://localhost:8080**

### 3. Configurar Frontend

```bash
# Navegar a carpeta frontend
cd seguridad-frontend

# Instalar dependencias
npm install

# Ejecutar desarrollo
npm run dev
```

Frontend estará en: **http://localhost:5173**

### 4. Ejecutar Ambos Simultáneamente

**Opción A: Script PowerShell**
```powershell
# En Windows PowerShell
.\run-all.ps1
```

**Opción B: Script Batch**
```cmd
# En CMD
run-all.bat
```

**Opción C: Manual**
```bash
# Terminal 1: Backend
mvn spring-boot:run

# Terminal 2: Frontend
cd seguridad-frontend
npm run dev
```

---

## 📁 Estructura del Proyecto

### Raíz del Proyecto

```
Desarrollo_web/
├── pom.xml                      # Dependencias Maven (Backend)
├── mvnw/mvnw.cmd               # Maven Wrapper
├── run-all.ps1                 # Script para ejecutar ambos
├── run-all.bat                 # Script Windows batch
├── iniciar-backend.bat         # Script solo backend
├── iniciar-frontend.bat        # Script solo frontend
├── ejecutar-react.sh           # Script solo frontend (Linux)
├── src/                        # Código Backend (Java/Spring)
├── seguridad-frontend/         # Código Frontend (React)
├── target/                     # Compilados Backend
└── LICENSE
```

### Backend: `src/main/java/.../`

**Estructura por capas (Arquitectura Limpia):**

```
├── config/              Controllers
├── controller/          HTTP Endpoints
├── service/             Lógica de negocio
├── repository/          Acceso a datos (JPA)
├── model/              Entidades
├── dto/                Data Transfer Objects
├── security/           Autenticación/JWT
├── exception/          Manejo de errores
└── util/               Utilidades
```

**Flujo de una solicitud:**
```
HTTP Request
    ↓
Controller (recibe datos)
    ↓
Service (procesa lógica)
    ↓
Repository (consulta BD)
    ↓
Model (entidad)
    ↓
Service (transforma a DTO)
    ↓
Controller (devuelve respuesta)
    ↓
HTTP Response
```

### Frontend: `seguridad-frontend/src/`

**Estructura por características:**

```
├── pages/              Páginas principales
├── components/         Componentes reutilizables
├── services/           Llamadas a API
├── utils/              Funciones auxiliares
├── assets/             Imágenes, fuentes
├── App.jsx             Enrutador principal
├── main.jsx            Punto de entrada
└── index.css           Estilos globales
```

**Flujo de datos:**
```
App.jsx (rutas)
    ↓
ProtectedRoute (si necesita auth)
    ↓
Layout (estructura)
    ↓
Page Component
    ↓
useEffect → Service API call
    ↓
setState (actualizar UI)
    ↓
Render
```

---

## 📋 Flujo de Trabajo

### Trabajar en una Nueva Funcionalidad

#### Ejemplo: Agregar nuevo módulo "Evaluaciones"

**Backend:**

1. **Crear la Entidad (Model)**
```java
// src/main/java/.../model/Evaluacion.java
@Entity
@Table(name = "evaluaciones")
public class Evaluacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String titulo;
    private String descripcion;
    // más campos...
}
```

2. **Crear el Repository**
```java
// src/main/java/.../repository/EvaluacionRepository.java
@Repository
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    List<Evaluacion> findByProgramaId(Long programaId);
}
```

3. **Crear el Service**
```java
// src/main/java/.../service/EvaluacionService.java
@Service
public class EvaluacionService {
    @Autowired
    private EvaluacionRepository repository;
    
    public List<Evaluacion> getAll() {
        return repository.findAll();
    }
    
    public Evaluacion create(EvaluacionDTO dto) {
        Evaluacion evaluacion = new Evaluacion();
        evaluacion.setTitulo(dto.getTitulo());
        return repository.save(evaluacion);
    }
}
```

4. **Crear el DTO**
```java
// src/main/java/.../dto/EvaluacionDTO.java
public class EvaluacionDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    // getters/setters...
}
```

5. **Crear el Controller**
```java
// src/main/java/.../controller/EvaluacionController.java
@RestController
@RequestMapping("/api/evaluaciones")
public class EvaluacionController {
    @Autowired
    private EvaluacionService service;
    
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
    
    @PostMapping
    public ResponseEntity<?> create(@RequestBody EvaluacionDTO dto) {
        return ResponseEntity.status(201).body(service.create(dto));
    }
}
```

6. **Crear Tests**
```java
// src/test/java/.../service/EvaluacionServiceTest.java
@SpringBootTest
class EvaluacionServiceTest {
    // pruebas unitarias...
}
```

**Frontend:**

1. **Crear el Servicio API**
```javascript
// seguridad-frontend/src/services/evaluacionService.js
import api from './api';

export const evaluacionService = {
  getAll: () => api.get('/evaluaciones'),
  getById: (id) => api.get(`/evaluaciones/${id}`),
  create: (data) => api.post('/evaluaciones', data),
  update: (id, data) => api.put(`/evaluaciones/${id}`, data),
  delete: (id) => api.delete(`/evaluaciones/${id}`)
};
```

2. **Crear Componentes**
```jsx
// seguridad-frontend/src/pages/Evaluaciones.jsx
import { useEffect, useState } from 'react';
import { evaluacionService } from '../services/evaluacionService';
import Layout from '../components/Layout';

const Evaluaciones = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);

  useEffect(() => {
    cargarEvaluaciones();
  }, []);

  const cargarEvaluaciones = async () => {
    try {
      const response = await evaluacionService.getAll();
      setEvaluaciones(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Layout>
      <h1>Evaluaciones</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {evaluaciones.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.titulo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Evaluaciones;
```

3. **Agregar Ruta en App.jsx**
```jsx
import Evaluaciones from './pages/Evaluaciones';

<Routes>
  <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
    <Route path="/evaluaciones" element={<Evaluaciones />} />
  </Route>
</Routes>
```

4. **Agregar al Menú (Layout.jsx)**
```jsx
<li><Link to="/evaluaciones">Evaluaciones</Link></li>
```

---

## 📝 Convenciones de Código

### Backend (Java)

**Nombres de clases:**
- Controllers: `MiEntidadController`
- Services: `MiEntidadService`
- Repositories: `MiEntidadRepository`
- DTOs: `MiEntidadDTO`
- Entidades: `MiEntidad`

**Convenciones:**
```java
// ✅ Bueno
@GetMapping("/{id}")
public ResponseEntity<MiEntidadDTO> getById(@PathVariable Long id) {
    MiEntidad entidad = service.getById(id);
    return ResponseEntity.ok(new MiEntidadDTO(entidad));
}

// ❌ Malo
@GetMapping("/{id}")
public MiEntidad get(@PathVariable Long id) {
    return service.get(id);
}
```

### Frontend (JavaScript/React)

**Nombres:**
- Componentes: `MiComponente.jsx` (PascalCase)
- Servicios: `miService.js` (camelCase)
- Variables: `miVariable` (camelCase)
- Constantes: `MI_CONSTANTE` (UPPER_SNAKE_CASE)

**Estructura de componentes:**
```javascript
// ✅ Bueno
const MiComponente = ({ titulo, onClick }) => {
  const [estado, setEstado] = useState(initialValue);

  useEffect(() => {
    // efecto...
  }, []);

  const manejarClick = () => {
    // lógica...
  };

  return (
    <div className="mi-componente">
      {/* JSX */}
    </div>
  );
};

// ❌ Malo
function MiComponente(props) {
  var estado = props.estado;
  
  return <div>{estado}</div>;
}
```

---

## 🐛 Debugging

### Backend

**Logs:**
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

private static final Logger logger = LoggerFactory.getLogger(MyClass.class);

logger.info("Mensaje informativo");
logger.warn("Advertencia");
logger.error("Error: ", exception);
```

**Breakpoints en IntelliJ:**
1. Click al lado del número de línea
2. Run → Debug (Shift+F9)
3. Step Over (F10), Step Into (F11)

**H2 Console (en desarrollo):**
- URL: `http://localhost:8080/h2-console`
- Driver: `org.h2.Driver`
- URL JDBC: `jdbc:h2:mem:testdb`

### Frontend

**DevTools de React:**
1. Instalar extensión "React Developer Tools"
2. Abrir DevTools del navegador (F12)
3. Ir a pestaña "Components"

**Console del navegador:**
```javascript
console.log('Valor:', valor);
console.table(array);
console.error('Error:', error);
```

**Network Tab:**
- Ver todas las llamadas HTTP
- Inspeccionar request/response
- Verificar status codes

---

## 🚢 Deployment

### Backend a Azure App Service

```bash
# 1. Crear JAR
mvn clean package

# 2. Crear App Service
az appservice plan create --name myPlan --resource-group myGroup --sku B1 --is-linux

az webapp create --resource-group myGroup --plan myPlan --name myApp --runtime "JAVA|17-java17"

# 3. Deploy
az webapp deployment source config-zip --resource-group myGroup --name myApp --src target/*.jar
```

### Frontend a Vercel

```bash
cd seguridad-frontend

# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

### Frontend a Netlify

```bash
cd seguridad-frontend

# 1. Build
npm run build

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir=dist
```

---

## ❓ FAQ

### P: ¿Cómo cambio la configuración de la base de datos?
**R:** Edita `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:h2:mem:testdb  # Cambiar aquí
spring.jpa.hibernate.ddl-auto=update
```

### P: ¿Cómo agrego una nueva dependencia en Backend?
**R:** Edita `pom.xml` y añade:
```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>mi-libreria</artifactId>
    <version>1.0.0</version>
</dependency>
```
Luego: `mvn clean install`

### P: ¿Cómo agrego una nueva dependencia en Frontend?
**R:** En `seguridad-frontend/`:
```bash
npm install nombre-paquete
```

### P: ¿Cómo debuggeo una llamada API que falla?
**R:** 
1. Abre DevTools (F12) → Network
2. Ejecuta la acción que falla
3. Busca la llamada y revisa:
   - Status code
   - Request body
   - Response

### P: ¿Cómo reseteo la base de datos?
**R:** Si usas H2 en memoria, la BD se resetea al reiniciar la app.
Si usas PostgreSQL:
```sql
DROP TABLE nombre_tabla CASCADE;
```

### P: El proyecto no compila, ¿qué hago?
**R:**
```bash
# Backend
mvn clean install -U  # -U fuerza descargar dependencias

# Frontend
rm -rf node_modules package-lock.json
npm install
```

### P: ¿Cómo obtengo un JWT token desde Postman?
**R:**
1. POST a `http://localhost:8080/api/auth/login`
2. Body (JSON):
```json
{
  "username": "admin",
  "password": "admin123"
}
```
3. Copia el token de la respuesta
4. En siguientes requests, agrega Header:
```
Authorization: Bearer <tu-token>
```

### P: React no detecta cambios en archivos, ¿qué hago?
**R:**
```bash
# Reinicia el servidor
npm run dev

# O si persiste
rm -rf node_modules
npm install
npm run dev
```

### P: ¿Cómo cambio el puerto del backend?
**R:** Edita `src/main/resources/application.properties`:
```properties
server.port=9090
```

### P: ¿Cómo cambio el puerto del frontend?
**R:** Edita `seguridad-frontend/vite.config.js`:
```javascript
export default {
  server: {
    port: 3000
  }
}
```

---

## 📚 Recursos Adicionales

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Maven Guide](https://maven.apache.org/guides/)
- [JWT.io](https://jwt.io)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Última actualización:** Diciembre 4, 2025
