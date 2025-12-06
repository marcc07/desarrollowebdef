# Guía de Troubleshooting - Solución de Problemas

## 🔍 Tabla de Contenidos

1. [Problemas Comunes Backend](#problemas-comunes-backend)
2. [Problemas Comunes Frontend](#problemas-comunes-frontend)
3. [Problemas de Base de Datos](#problemas-de-base-de-datos)
4. [Problemas de Autenticación](#problemas-de-autenticación)
5. [Problemas de CORS](#problemas-de-cors)
6. [Problemas de Rendimiento](#problemas-de-rendimiento)
7. [Problemas de Deployment](#problemas-de-deployment)

---

## 🔧 Problemas Comunes Backend

### Error: "Port 8080 is already in use"

**Síntoma:** La aplicación no inicia porque el puerto 8080 está ocupado.

**Solución 1: Cambiar el puerto**
```properties
# src/main/resources/application.properties
server.port=9090
```

**Solución 2: Liberar el puerto (Windows)**
```powershell
# Encontrar el proceso usando el puerto
netstat -ano | findstr :8080

# Matar el proceso (reemplazar PID)
taskkill /PID 12345 /F
```

**Solución 3: Liberar el puerto (Linux/Mac)**
```bash
lsof -i :8080
kill -9 <PID>
```

---

### Error: "Cannot find symbol" en compilación

**Síntoma:**
```
[ERROR] error: cannot find symbol
[ERROR]   symbol:   class MiClase
```

**Causas y Soluciones:**

1. **Dependencia faltante:**
```bash
# Limpiar e reinstalar
mvn clean install -U

# -U fuerza actualización de dependencias
```

2. **Paquete incorrecto:**
```java
// ❌ Incorrecto
import MiClase;

// ✅ Correcto
import com.proyectofinal.model.MiClase;
```

3. **Archivo no guardado:**
- Guardar archivo con Ctrl+S

---

### Error: "Connection refused" en Base de Datos

**Síntoma:**
```
Caused by: java.sql.SQLException: Cannot get a connection, pool error
```

**Soluciones:**

1. **Verificar configuración de BD:**
```properties
spring.datasource.url=jdbc:h2:mem:testdb  # Correcto para H2
spring.datasource.username=sa
spring.datasource.password=
```

2. **Verificar si PostgreSQL está ejecutándose:**
```bash
# Windows
Get-Service postgresql-x64*

# Linux
sudo service postgresql status

# Mac
brew services list | grep postgres
```

3. **Reiniciar servicio de BD:**
```bash
# PostgreSQL en Windows
net stop postgresql-x64-14
net start postgresql-x64-14

# PostgreSQL en Linux
sudo systemctl restart postgresql

# PostgreSQL en Mac
brew services restart postgresql
```

---

### Error: "No converter found for return value"

**Síntoma:**
```
No converter found for return value of type: java.util.List
```

**Causa:** Jackson no puede serializar el objeto a JSON.

**Solución:**
```java
// ❌ Incorrecto
@GetMapping
public List<Cliente> getAll() {
    return clienteService.getAll();
}

// ✅ Correcto
@GetMapping
public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(clienteService.getAll());
}
```

---

### Error: "Circular reference detected"

**Síntoma:**
```
Caused by: com.fasterxml.jackson.databind.JsonMappingException: 
Infinite recursion (StackOverflowError)
```

**Causa:** Relaciones bidirecionales en entidades.

**Solución:**
```java
// En la clase Cliente
@OneToMany(mappedBy = "cliente")
@JsonIgnore  // Agregar esta anotación
private List<Contratacion> contrataciones;

// O usar @JsonBackReference/@JsonManagedReference
@OneToMany(mappedBy = "cliente")
@JsonBackReference
private List<Contratacion> contrataciones;
```

---

### Error: "Duplicate entry for key 'email'"

**Síntoma:**
```
org.hibernate.exception.ConstraintViolationException: 
Duplicate entry 'user@example.com' for key 'email'
```

**Solución:**

1. **Verificar constraint en BD:**
```sql
-- Mostrar restricciones
SHOW CREATE TABLE usuarios;

-- Remover constraint
ALTER TABLE usuarios DROP INDEX email;
```

2. **Limpiar datos duplicados:**
```sql
DELETE FROM usuarios WHERE email = 'user@example.com';
```

3. **Validar antes de guardar:**
```java
@Service
public class UsuarioService {
    
    public Usuario crear(UsuarioDTO dto) {
        if (repository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ValidationException("Email ya existe");
        }
        // Crear usuario...
    }
}
```

---

### Error: "401 Unauthorized" en endpoints protegidos

**Síntoma:**
```
{
  "error": "Unauthorized",
  "message": "Access Denied",
  "status": 401
}
```

**Soluciones:**

1. **Verificar que incluyas el JWT token:**
```bash
# ❌ Incorrecto
curl http://localhost:8080/api/clientes

# ✅ Correcto
curl -H "Authorization: Bearer <tu-token>" \
  http://localhost:8080/api/clientes
```

2. **Token expirado:**
- Hacer login nuevamente para obtener token fresco
- O implementar refresh token

3. **Token inválido:**
- Verificar que el token sea válido en jwt.io
- Puede estar corrupto o modificado

---

## 🎨 Problemas Comunes Frontend

### Error: "Module not found"

**Síntoma:**
```
Error: Cannot find module 'react-router-dom'
```

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json

npm install

# Instalar módulo específico
npm install react-router-dom
```

---

### Estilos CSS no se aplican

**Síntoma:** Los estilos Tailwind o CSS no aparecen.

**Soluciones:**

1. **Verificar que los archivos CSS estén importados:**
```jsx
// App.jsx
import './App.css';
import './index.css';
```

2. **Tailwind: Verificar configuración:**
```javascript
// tailwind.config.js
content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",  // Asegurar que incluye todos los archivos
],
```

3. **Limpiar caché y reiniciar:**
```bash
npm run dev
# Presionar Ctrl+C, luego:
npm run dev
```

4. **Compilar Tailwind manualmente:**
```bash
npx tailwindcss -i ./src/index.css -o ./src/output.css
```

---

### Componentes no se renderizan

**Síntoma:** La página está en blanco o no muestra contenido.

**Soluciones:**

1. **Ver errores en la consola del navegador (F12)**
   - Ir a pestaña "Console"
   - Ver errores en rojo

2. **Verificar que la ruta sea correcta:**
```jsx
// App.jsx
import Clientes from './pages/Clientes';  // ¿Existe este archivo?
```

3. **Verificar exports/imports:**
```javascript
// ❌ Incorrecto
function MiComponente() { }
export { MiComponente };  // Named export
import MiComponente from './MiComponente';  // Intenta default import

// ✅ Correcto
function MiComponente() { }
export default MiComponente;
```

---

### Datos no cargan de la API

**Síntoma:** La página se carga pero no muestra datos de la API.

**Soluciones:**

1. **Verificar que el backend está ejecutándose:**
```bash
# En otra terminal
mvn spring-boot:run

# O verificar puerto
netstat -ano | findstr :8080
```

2. **Revisar Network en DevTools (F12):**
   - Ir a pestaña "Network"
   - Ejecutar la acción que falla
   - Ver status code de la llamada
   - Si es 404: endpoint incorrecto
   - Si es 500: error en backend
   - Si es 0: server no responde

3. **Verificar URL de API:**
```javascript
// services/api.js
const api = axios.create({
  baseURL: 'http://localhost:8080/api'  // Asegurar que es correcto
});
```

4. **Verificar CORS (error en consola):**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

Solución: Ver [Problemas de CORS](#problemas-de-cors)

---

### Rutas no funcionan

**Síntoma:** Al navegar, la URL cambia pero el contenido no se actualiza.

**Solución:**

1. **Verificar que React Router está correctamente configurado:**
```jsx
// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </Router>
  );
}
```

2. **Usar Link en lugar de `<a href=>`:**
```jsx
// ❌ Incorrecto (causa recarga)
<a href="/clientes">Clientes</a>

// ✅ Correcto (navegación SPA)
import { Link } from 'react-router-dom';
<Link to="/clientes">Clientes</Link>
```

---

### Variables de entorno no se cargen

**Síntoma:** `import.meta.env.VITE_API_URL` retorna undefined.

**Soluciones:**

1. **Las variables deben empezar con `VITE_`:**
```env
# ✅ Correcto
VITE_API_URL=http://localhost:8080

# ❌ Incorrecto (no será cargado)
API_URL=http://localhost:8080
```

2. **Guardar archivo .env y reiniciar dev server:**
```bash
npm run dev
```

3. **Acceder correctamente:**
```javascript
// ✅ Correcto
console.log(import.meta.env.VITE_API_URL)

// ❌ Incorrecto
console.log(process.env.VITE_API_URL)  // process.env es para Node
```

---

### Autenticación no persiste

**Síntoma:** Al refrescar la página, pierdo la sesión.

**Solución:**

1. **Guardar token en localStorage:**
```javascript
// authService.js
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  const { token, user } = response.data;
  
  localStorage.setItem('token', token);      // Guardar token
  localStorage.setItem('user', JSON.stringify(user));
  
  return response.data;
};
```

2. **Cargar token al iniciar:**
```jsx
// Layout.jsx
useEffect(() => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (token) {
    // Usuario logueado
    setUser(JSON.parse(user));
  }
}, []);
```

---

## 🗄️ Problemas de Base de Datos

### H2 Console no aparece

**Síntoma:** `http://localhost:8080/h2-console` da 404.

**Solución:**
```properties
# src/main/resources/application.properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

Luego reiniciar: `mvn spring-boot:run`

---

### "Database lock" en H2

**Síntoma:**
```
Caused by: org.h2.jdbc.JdbcSQLException: 
Connection is broken: "java.io.EOFException"
```

**Solución:**

H2 en memoria no persiste datos entre reinicios, esto es normal. 
Si necesitas persistencia:

```properties
# En archivo
spring.datasource.url=jdbc:h2:file:~/seguridad-db

# Carpeta será creada en home
```

---

### PostgreSQL: "FATAL: role 'username' does not exist"

**Síntoma:**
```
Caused by: org.postgresql.util.PSQLException: 
FATAL: role "seguridad_user" does not exist
```

**Solución:**
```sql
-- Crear el usuario
CREATE USER seguridad_user WITH PASSWORD 'password123';

-- Crear la BD
CREATE DATABASE seguridad_db OWNER seguridad_user;

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE seguridad_db TO seguridad_user;
```

---

### "Too many connections"

**Síntoma:**
```
FATAL: too many connections for database
```

**Solución:**

1. **Configurar connection pool:**
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

2. **Matar conexiones viejas:**
```sql
-- PostgreSQL
SELECT pid, usename, application_name 
FROM pg_stat_activity 
WHERE datname = 'seguridad_db';

SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'seguridad_db' AND pid <> pg_backend_pid();
```

---

## 🔐 Problemas de Autenticación

### "Invalid JWT Token"

**Síntoma:**
```
io.jsonwebtoken.SignatureException: JWT signature does not match locally computed signature
```

**Causas:**

1. **JWT_SECRET cambiado:** Todos los tokens anteriores se invalidan
2. **Token corrupto:** Fue modificado o parcialmente enviado
3. **Versión de librería incompatible**

**Soluciones:**

```bash
# Opción 1: Hacer login nuevamente
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Opción 2: Usar token nuevo en siguiente request
curl -H "Authorization: Bearer <nuevo-token>" \
  http://localhost:8080/api/clientes
```

---

### "JWT Token expired"

**Síntoma:**
```
io.jsonwebtoken.ExpiredJwtException: JWT claims string is empty
```

**Solución:**

Obtener un token nuevo:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

O implementar refresh token (más avanzado).

---

### "Usuario no encontrado en login"

**Síntoma:**
```json
{
  "error": "Usuario no encontrado"
}
```

**Soluciones:**

1. **Verificar que el usuario existe en BD:**
```sql
SELECT * FROM usuarios WHERE username = 'admin';
```

2. **Crear usuario si no existe:**
```sql
INSERT INTO usuarios (username, password, email, nombre) 
VALUES ('admin', '$2a$10$...', 'admin@example.com', 'Administrador');
```

3. **Usar credenciales correctas:**
```bash
# ✅ Correcto
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# ❌ Incorrecto
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ADMIN","password":"wrong"}'  # Mayúsculas, password incorrecto
```

---

## 🌐 Problemas de CORS

### "Access to XMLHttpRequest has been blocked by CORS policy"

**Síntoma (en Console del navegador):**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/clientes' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Solución en Backend:**

```java
// src/main/java/.../config/CorsConfig.java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173", "http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

**O en application.properties:**
```properties
cors.allowed-origins=http://localhost:5173,http://localhost:3000
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.max-age=3600
```

---

### Preflight request (OPTIONS) falla

**Síntoma:** Las solicitudes OPTIONS retornan 403/404

**Solución:** Asegurar que OPTIONS está en los métodos permitidos:

```java
.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
```

---

## ⚡ Problemas de Rendimiento

### Aplicación lenta

**Soluciones:**

1. **Habilitar caché de Hibernate:**
```properties
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

2. **Usar índices en BD:**
```sql
CREATE INDEX idx_cliente_email ON clientes(email);
CREATE INDEX idx_usuario_username ON usuarios(username);
```

3. **Lazy loading vs Eager loading:**
```java
// ❌ Carga todo de una vez
@OneToMany(fetch = FetchType.EAGER)
private List<Contratacion> contrataciones;

// ✅ Carga solo cuando se accede
@OneToMany(fetch = FetchType.LAZY)
private List<Contratacion> contrataciones;
```

---

### Frontend lento

**Soluciones:**

1. **Optimizar componentes:**
```jsx
// Usar useMemo para cálculos costosos
const datosProcessados = useMemo(() => {
  return data.filter(...).map(...);
}, [data]);
```

2. **Lazy loading de componentes:**
```jsx
import { lazy, Suspense } from 'react';

const Clientes = lazy(() => import('./pages/Clientes'));

<Suspense fallback={<Loading />}>
  <Clientes />
</Suspense>
```

3. **Implementar paginación:**
```javascript
// services/clienteService.js
getAll: (page = 0, size = 10) => 
  api.get(`/clientes?page=${page}&size=${size}`)
```

---

## 🚀 Problemas de Deployment

### Error: "Cannot find 'npm' command"

**En servidor Linux:**
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Verificar
npm --version
```

---

### Error: "Cannot find 'java' command"

**En servidor Linux:**
```bash
# Instalar Java 17
sudo apt install openjdk-17-jdk -y

# Verificar
java -version
```

---

### Error: "Port already in use" en servidor

**Solución:**
```bash
# Encontrar proceso en puerto
sudo lsof -i :8080

# Matar proceso
kill -9 <PID>

# O cambiar puerto en application.properties
server.port=9090
```

---

### Docker build falla

**Síntoma:**
```
ERROR: failed to solve with frontend dockerfile.v0
```

**Soluciones:**

1. **Verificar Dockerfile:**
```dockerfile
# Asegurar que Maven compiló la app
# Antes de Docker, ejecutar:
mvn clean package
```

2. **Erro en FROM:**
```dockerfile
# ✅ Correcto
FROM openjdk:17-slim

# ❌ Incorrecto
FROM openjdk:17  # Muy pesado, > 500MB
```

3. **Caché Docker:**
```bash
docker build --no-cache -t proyectofinal:1.0 .
```

---

### Aplicación se cae en producción

**Verificar logs:**
```bash
# Docker
docker logs <container-id>

# Azure App Service
az webapp log tail -n myApp -g myGroup

# Linux
tail -f /var/log/app/app.log
```

**Errores comunes:**

1. **Memory leak:** Aumentar memoria
```bash
java -Xmx1024m -jar app.jar
```

2. **Puerto no disponible:**
```bash
java -Dserver.port=8080 -jar app.jar
```

3. **BD no accesible:** Verificar conexión y credenciales

---

## 📞 Recursos de Ayuda

**Canales de soporte:**
- Stack Overflow: https://stackoverflow.com/
- Spring Boot Issues: https://github.com/spring-projects/spring-boot/issues
- React Issues: https://github.com/facebook/react/issues

**Cómo reportar un problema:**
1. Incluir stack trace completo
2. Describir pasos para reproducir
3. Versiones de software
4. Logs relevantes

---

**Última actualización:** Diciembre 4, 2025
