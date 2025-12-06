# Guía de Configuración y Deployment

## 📋 Tabla de Contenidos

1. [Configuración del Proyecto](#configuración-del-proyecto)
2. [Variables de Entorno](#variables-de-entorno)
3. [Base de Datos](#base-de-datos)
4. [Seguridad](#seguridad)
5. [Build y Compilación](#build-y-compilación)
6. [Deployment](#deployment)
7. [Monitoreo y Logs](#monitoreo-y-logs)

---

## ⚙️ Configuración del Proyecto

### Backend: `application.properties`

**Ubicación:** `src/main/resources/application.properties`

```properties
# ============================================
# SERVIDOR
# ============================================
server.port=8080
server.servlet.context-path=/
server.error.include-message=always
server.error.include-stacktrace=on_param

# ============================================
# DATABASE H2 (DESARROLLO)
# ============================================
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# ============================================
# JPA/HIBERNATE
# ============================================
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# ============================================
# JWT (JSON WEB TOKENS)
# ============================================
jwt.secret=your-super-secret-key-change-in-production-min-32-chars!
jwt.expiration=86400000
jwt.refresh-expiration=604800000

# ============================================
# CORS
# ============================================
cors.allowed-origins=http://localhost:5173,http://localhost:3000
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.max-age=3600

# ============================================
# MAIL (GMAIL)
# ============================================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# ============================================
# LOGGING
# ============================================
logging.level.root=INFO
logging.level.com.proyectofinal=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate=INFO
logging.file.name=logs/app.log
logging.file.max-size=10MB
logging.file.max-history=10

# ============================================
# ACTUATOR (MONITOREO)
# ============================================
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always

# ============================================
# THYMELEAF (VISTAS)
# ============================================
spring.thymeleaf.cache=false
spring.thymeleaf.check-template-location=true
spring.thymeleaf.enabled=true
spring.thymeleaf.encoding=UTF-8
spring.thymeleaf.mode=HTML
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html

# ============================================
# JACKSON (JSON SERIALIZATION)
# ============================================
spring.jackson.default-property-inclusion=non_null
spring.jackson.serialization.write-dates-as-timestamps=false
spring.jackson.time-zone=UTC

# ============================================
# TASK SCHEDULING
# ============================================
spring.task.scheduling.pool.size=10
spring.task.execution.pool.core-size=5
```

### Backend: `application-prod.properties`

**Ubicación:** `src/main/resources/application-prod.properties`

```properties
# ============================================
# SERVIDOR
# ============================================
server.port=8080
server.error.include-message=never
server.error.include-stacktrace=never

# ============================================
# DATABASE POSTGRESQL (PRODUCCIÓN)
# ============================================
spring.datasource.url=jdbc:postgresql://db-host:5432/seguridad_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000

# ============================================
# JPA/HIBERNATE
# ============================================
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.jdbc.batch_size=50

# ============================================
# JWT
# ============================================
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}

# ============================================
# CORS
# ============================================
cors.allowed-origins=${CORS_ORIGINS}
cors.allowed-methods=GET,POST,PUT,DELETE
cors.max-age=7200

# ============================================
# LOGGING
# ============================================
logging.level.root=WARN
logging.level.com.proyectofinal=INFO
logging.file.name=/var/log/app/app.log
logging.file.max-size=50MB

# ============================================
# MAIL
# ============================================
spring.mail.host=${MAIL_HOST}
spring.mail.port=${MAIL_PORT}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

### Frontend: `.env`

**Ubicación:** `seguridad-frontend/.env.local`

```env
# ============================================
# API
# ============================================
VITE_API_URL=http://localhost:8080

# ============================================
# APP
# ============================================
VITE_APP_NAME=Sistema de Seguridad y Entrenamiento
VITE_APP_VERSION=1.0.0

# ============================================
# FEATURES
# ============================================
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### Frontend: `.env.production`

**Ubicación:** `seguridad-frontend/.env.production`

```env
VITE_API_URL=https://api.tudominio.com
VITE_APP_NAME=Sistema de Seguridad y Entrenamiento
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

---

## 🔐 Variables de Entorno

### Ejecutar con Variables de Entorno

**Windows (PowerShell):**
```powershell
$env:JWT_SECRET="tu-secret-key-super-seguro"
$env:DB_USERNAME="usuario_db"
$env:DB_PASSWORD="password_db"

java -jar target/proyectofinal.jar
```

**Linux/Mac:**
```bash
export JWT_SECRET="tu-secret-key-super-seguro"
export DB_USERNAME="usuario_db"
export DB_PASSWORD="password_db"

java -jar target/proyectofinal.jar
```

### Archivo `.env` (Recomendado en Producción)

**Crear archivo de secretos:**
```bash
cat > .env << EOF
JWT_SECRET=tu-secret-key-super-seguro-min-32-caracteres
DB_USERNAME=postgres
DB_PASSWORD=tu-password-seguro
DB_HOST=localhost
DB_PORT=5432
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password
CORS_ORIGINS=https://tudominio.com
EOF
```

**Ejecutar con archivo:**
```bash
# Usar herramienta como 'direnv' o 'dotenv'
source .env
java -jar target/proyectofinal.jar
```

---

## 🗄️ Base de Datos

### H2 (Desarrollo)

H2 es una BD embebida ideal para desarrollo:

**Acceder a H2 Console:**
- URL: `http://localhost:8080/h2-console`
- Driver: `org.h2.Driver`
- URL JDBC: `jdbc:h2:mem:testdb`
- Usuario: `sa`
- Contraseña: (vacía)

**Queries útiles:**
```sql
-- Ver todas las tablas
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC';

-- Ver estructura de tabla
DESCRIBE usuarios;

-- Insertar datos de prueba
INSERT INTO usuarios (username, password, email, nombre) 
VALUES ('admin', '$2a$10$...', 'admin@example.com', 'Administrador');

-- Limpiar tabla
TRUNCATE TABLE usuarios;
DELETE FROM usuarios; -- Opción alternativa
```

### PostgreSQL (Producción)

**Instalación en Windows:**
```powershell
choco install postgresql -y
```

**Crear Base de Datos:**
```sql
CREATE USER seguridad_user WITH PASSWORD 'password123';
CREATE DATABASE seguridad_db OWNER seguridad_user;

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE seguridad_db TO seguridad_user;
```

**Configurar en `application-prod.properties`:**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/seguridad_db
spring.datasource.username=seguridad_user
spring.datasource.password=password123
```

**Ejecutar con PostgreSQL:**
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

### Backups

**Backup H2:**
```bash
# H2 guarda datos en archivo (si configurado)
# Por defecto en memoria, no necesita backup
```

**Backup PostgreSQL:**
```bash
# Desde terminal
pg_dump -U seguridad_user seguridad_db > backup.sql

# Con timestamp
pg_dump -U seguridad_user seguridad_db > backup_$(date +%Y%m%d).sql

# Restaurar
psql -U seguridad_user seguridad_db < backup.sql
```

---

## 🔐 Seguridad

### JWT Configuration

**Generar Secret Key seguro (32+ caracteres):**

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Ejemplo de JWT Token:**
```
eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwMTYyNDAwMCwiZXhwIjoxNzAxNzEwNDAwfQ.
xxxxx...
```

### Password Encoding

Todos los passwords se encriptan con **BCrypt**:

```java
// En código
PasswordEncoder encoder = new BCryptPasswordEncoder();
String encrypted = encoder.encode("password123");

// BCrypt genera hashes diferentes cada vez
```

### CORS Configuration

**Configurar dominio permitido:**

```java
// En SecurityConfig.java
registry.addMapping("/api/**")
    .allowedOrigins("https://tudominio.com")
    .allowedMethods("GET", "POST", "PUT", "DELETE")
    .maxAge(3600);
```

### SSL/TLS (HTTPS)

**Generar certificado (desarrollo):**
```bash
keytool -genkey -alias tomcat -storetype PKCS12 -keyalg RSA \
  -keysize 2048 -keystore keystore.p12 -validity 365

# Contraseña: changeit
```

**Configurar en `application.properties`:**
```properties
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=changeit
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
server.port=8443
```

---

## 🔨 Build y Compilación

### Backend: Build

**Maven:**
```bash
# Compilar
mvn clean compile

# Ejecutar tests
mvn test

# Crear JAR (producción)
mvn clean package

# Crear JAR sin tests
mvn clean package -DskipTests

# Ver dependencias
mvn dependency:tree
```

**Salida:**
```
target/
├── proyectofinal-1.0.jar          # JAR ejecutable
├── proyectofinal-1.0.jar.original # JAR original
├── classes/                        # Clases compiladas
└── ...
```

### Frontend: Build

```bash
# Compilar para desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de build
npm run preview

# Linting
npm run lint

# Linting automático
npm run lint --fix
```

**Salida:**
```
dist/
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   ├── index-xxxxx.css
│   └── ...
└── ...
```

---

## 🚀 Deployment

### Local Development

**Backend:**
```bash
mvn spring-boot:run
```

**Frontend:**
```bash
cd seguridad-frontend
npm run dev
```

**Ambos simultáneamente:**
```bash
# Windows
run-all.ps1

# Linux/Mac
./ejecutar-react.sh
```

### Docker Deployment

**Crear `Dockerfile` para Backend:**
```dockerfile
FROM openjdk:17-slim

WORKDIR /app

COPY target/proyectofinal.jar app.jar

EXPOSE 8080

ENV JWT_SECRET=your-secret \
    DB_URL=jdbc:h2:mem:testdb

CMD ["java", "-jar", "app.jar"]
```

**Build Docker Image:**
```bash
mvn clean package

docker build -t proyectofinal:1.0 .

docker run -p 8080:8080 \
  -e JWT_SECRET="tu-secret" \
  -e DB_USERNAME="sa" \
  proyectofinal:1.0
```

**Crear `Dockerfile` para Frontend:**
```dockerfile
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Cloud Deployment

#### Azure App Service

**Backend:**
```bash
# Crear grupo de recursos
az group create --name myResourceGroup --location eastus

# Crear App Service Plan
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku B1 --is-linux

# Crear App Service
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name myBackendApp \
  --runtime "JAVA|17-java17"

# Compilar JAR
mvn clean package

# Deploy
az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name myBackendApp \
  --src target/proyectofinal.jar
```

#### Vercel (Frontend)

```bash
cd seguridad-frontend

# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Con variables de entorno
vercel --prod \
  --env VITE_API_URL=https://api.tudominio.com
```

#### Netlify (Frontend)

```bash
cd seguridad-frontend

# Build
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### AWS EC2

```bash
# Conectar a EC2
ssh -i "key.pem" ec2-user@your-ec2-ip

# Instalar Java
sudo yum install java-17-amazon-corretto -y

# Instalar Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y

# Copiar archivos
scp -i "key.pem" target/*.jar ec2-user@your-ec2-ip:~/app/

# Ejecutar
java -jar ~/app/proyectofinal.jar &
```

---

## 📊 Monitoreo y Logs

### Logs en Desarrollo

**Ubicación:**
```
logs/app.log
```

**Ver logs en tiempo real:**
```bash
tail -f logs/app.log
```

**Nivel de logs en `application.properties`:**
```properties
logging.level.root=INFO
logging.level.com.proyectofinal=DEBUG
logging.level.org.springframework.security=DEBUG
```

### Logs en Producción

**Configurar rotación de logs:**
```properties
logging.file.name=/var/log/app/app.log
logging.file.max-size=50MB
logging.file.max-history=30
```

**Centralizar logs (Elasticsearch + Kibana):**
```xml
<!-- Agregar a pom.xml -->
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>6.6</version>
</dependency>
```

### Health Check

**Endpoint de salud:**
```bash
curl http://localhost:8080/actuator/health
```

**Respuesta:**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "H2"
      }
    }
  }
}
```

### Métricas

**Ver métricas:**
```bash
curl http://localhost:8080/actuator/metrics
```

**Métricas específicas:**
```bash
# CPU
curl http://localhost:8080/actuator/metrics/process.cpu.usage

# Memoria
curl http://localhost:8080/actuator/metrics/jvm.memory.used

# Requests HTTP
curl http://localhost:8080/actuator/metrics/http.server.requests
```

---

**Última actualización:** Diciembre 4, 2025
