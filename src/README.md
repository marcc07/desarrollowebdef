# Documentación Backend - Sistema de Seguridad y Entrenamiento

## 📁 Estructura del Proyecto Backend

```
src/
├── main/
│   ├── java/
│   │   └── ProyectoFinal/
│   │       └── ProyectoFinal_Ander/
│   │           ├── config/                      # Configuración de Spring
│   │           │   ├── SecurityConfig.java      # Configuración de Spring Security
│   │           │   ├── CorsConfig.java          # Configuración de CORS
│   │           │   └── WebConfig.java           # Configuración web general
│   │           │
│   │           ├── controller/                  # Controllers (API endpoints)
│   │           │   ├── AuthController.java      # Autenticación y registro
│   │           │   ├── ClienteController.java   # Gestión de clientes
│   │           │   ├── ServicioController.java  # Gestión de servicios
│   │           │   ├── ProgramaController.java  # Gestión de programas
│   │           │   ├── ContratacionController.java
│   │           │   ├── ReservaController.java
│   │           │   ├── PagoController.java
│   │           │   ├── DashboardController.java # Estadísticas
│   │           │   ├── InformeController.java   # Reportes
│   │           │   └── UsuarioController.java   # Gestión de usuarios
│   │           │
│   │           ├── service/                     # Lógica de negocio
│   │           │   ├── AuthService.java
│   │           │   ├── ClienteService.java
│   │           │   ├── ServicioService.java
│   │           │   ├── ProgramaService.java
│   │           │   ├── ContratacionService.java
│   │           │   ├── ReservaService.java
│   │           │   ├── PagoService.java
│   │           │   ├── DashboardService.java
│   │           │   ├── InformeService.java
│   │           │   ├── UsuarioService.java
│   │           │   ├── EmailService.java        # Envío de emails
│   │           │   └── ValidationService.java   # Validaciones
│   │           │
│   │           ├── repository/                  # Acceso a datos (JPA)
│   │           │   ├── UsuarioRepository.java
│   │           │   ├── ClienteRepository.java
│   │           │   ├── ServicioRepository.java
│   │           │   ├── ProgramaRepository.java
│   │           │   ├── ContratacionRepository.java
│   │           │   ├── ReservaRepository.java
│   │           │   └── PagoRepository.java
│   │           │
│   │           ├── model/                       # Entidades JPA
│   │           │   ├── Usuario.java
│   │           │   ├── Cliente.java
│   │           │   ├── Servicio.java
│   │           │   ├── Programa.java
│   │           │   ├── Contratacion.java
│   │           │   ├── Reserva.java
│   │           │   ├── Pago.java
│   │           │   └── Rol.java
│   │           │
│   │           ├── dto/                         # Data Transfer Objects
│   │           │   ├── LoginRequest.java
│   │           │   ├── RegisterRequest.java
│   │           │   ├── ClienteDTO.java
│   │           │   ├── ServicioDTO.java
│   │           │   ├── ProgramaDTO.java
│   │           │   ├── ContratacionDTO.java
│   │           │   ├── ReservaDTO.java
│   │           │   ├── PagoDTO.java
│   │           │   └── ApiResponse.java
│   │           │
│   │           ├── exception/                   # Excepciones personalizadas
│   │           │   ├── ResourceNotFoundException.java
│   │           │   ├── BadRequestException.java
│   │           │   ├── UnauthorizedException.java
│   │           │   ├── ValidationException.java
│   │           │   └── GlobalExceptionHandler.java
│   │           │
│   │           ├── security/                    # Seguridad
│   │           │   ├── JwtTokenProvider.java    # Generación y validación JWT
│   │           │   ├── JwtAuthenticationFilter.java
│   │           │   └── CustomUserDetailsService.java
│   │           │
│   │           ├── util/                        # Utilidades
│   │           │   ├── DateUtil.java
│   │           │   ├── NumberUtil.java
│   │           │   └── ValidationUtil.java
│   │           │
│   │           └── ProyectoFinalApplication.java # Main - punto de entrada
│   │
│   └── resources/
│       ├── application.properties               # Configuración principal
│       ├── application-dev.properties           # Configuración desarrollo
│       ├── application-prod.properties          # Configuración producción
│       ├── templates/                           # Vistas Thymeleaf
│       │   ├── login.html
│       │   ├── register.html
│       │   ├── dashboard.html
│       │   ├── layout.html
│       │   ├── clientes/
│       │   ├── servicios/
│       │   ├── programas/
│       │   ├── contrataciones/
│       │   ├── reservas/
│       │   ├── pagos/
│       │   └── informes/
│       │
│       └── static/
│           ├── css/
│           ├── js/
│           └── images/
│
├── test/
│   └── java/
│       └── ProyectoFinal/
│           └── ProyectoFinal_Ander/
│               ├── controller/
│               ├── service/
│               └── repository/
│
├── pom.xml                                      # Dependencias Maven
└── mvnw / mvnw.cmd                              # Maven wrapper
```

---

## 🔧 Tecnologías

- **Spring Boot:** 3.5.7
- **Java:** 17
- **Base de Datos:** H2 (desarrollo), PostgreSQL (producción)
- **ORM:** Hibernate/JPA
- **Autenticación:** Spring Security + JWT
- **Build:** Maven 3.8.1+

---

## 📦 Dependencias Principales

### `pom.xml`

```xml
<!-- Spring Boot Web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT Token -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.11.5</version>
</dependency>

<!-- Base de Datos H2 -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- PostgreSQL (opcional) -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Thymeleaf -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<!-- Email -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- Testing -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

---

## ⚙️ Configuración

### `application.properties`

```properties
# Servidor
server.port=8080
server.servlet.context-path=/

# Base de Datos H2 (Desarrollo)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true

# JPA
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# JWT
jwt.secret=your_secret_key_here_change_in_production
jwt.expiration=86400000

# Email (opcional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Logging
logging.level.root=INFO
logging.level.com.proyectofinal=DEBUG
```

### `application-prod.properties`

```properties
# Servidor
server.port=8080

# Base de Datos PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/seguridad_db
spring.datasource.username=postgres
spring.datasource.password=password
spring.datasource.driverClassName=org.postgresql.Driver

# JPA
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL10Dialect
spring.jpa.hibernate.ddl-auto=validate

# JWT (cambiar en producción)
jwt.secret=${JWT_SECRET:your_secret_key}
jwt.expiration=${JWT_EXPIRATION:86400000}

# Logging
logging.level.root=WARN
```

---

## 🔐 Seguridad

### JWT (JSON Web Tokens)

#### `JwtTokenProvider.java`

```java
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    // Generar token
    public String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
    
    // Extraer username de token
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
    
    // Validar token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

### Spring Security Config

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/auth/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtAuthenticationFilter(), 
                UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## 🎯 Entidades y Relaciones

### `Usuario.java`

```java
@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String email;
    
    private String nombre;
    private String apellido;
    
    @Enumerated(EnumType.STRING)
    private Rol rol;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaCreacion;
    
    private boolean activo = true;
}
```

### `Cliente.java`

```java
@Entity
@Table(name = "clientes")
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    private String apellido;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String telefono;
    
    private String direccion;
    
    @ManyToMany
    private Set<Servicio> servicios = new HashSet<>();
    
    @OneToMany(mappedBy = "cliente")
    private List<Contratacion> contrataciones = new ArrayList<>();
}
```

### Relaciones

```
Usuario (1:N) → Contratación
     ↓
   Rol

Cliente (1:N) → Contratación
Cliente (N:M) → Servicio
Cliente (1:N) → Reserva

Servicio (1:N) → Programa
Servicio (N:M) → Cliente
Servicio (1:N) → Contratación

Programa (N:1) → Servicio
Programa (1:N) → Reserva

Contratación (N:1) → Cliente
Contratación (N:1) → Usuario
Contratación (1:N) → Pago
Contratación (1:N) → Reserva

Pago (N:1) → Contratación

Reserva (N:1) → Cliente
Reserva (N:1) → Programa
Reserva (1:N) → Contratación
```

---

## 📡 Endpoints API

### Autenticación

```
POST   /api/auth/login              - Iniciar sesión
POST   /api/auth/register           - Registrarse
POST   /api/auth/logout             - Cerrar sesión
GET    /api/auth/me                 - Obtener usuario actual
POST   /api/auth/refresh-token      - Refrescar JWT
```

### Clientes

```
GET    /api/clientes                - Listar todos
GET    /api/clientes/{id}           - Obtener por ID
POST   /api/clientes                - Crear nuevo
PUT    /api/clientes/{id}           - Actualizar
DELETE /api/clientes/{id}           - Eliminar
GET    /api/clientes/{id}/servicios - Servicios del cliente
```

### Servicios

```
GET    /api/servicios               - Listar todos
GET    /api/servicios/{id}          - Obtener por ID
POST   /api/servicios               - Crear nuevo
PUT    /api/servicios/{id}          - Actualizar
DELETE /api/servicios/{id}          - Eliminar
GET    /api/servicios/{id}/programas - Programas del servicio
```

### Programas

```
GET    /api/programas               - Listar todos
GET    /api/programas/{id}          - Obtener por ID
POST   /api/programas               - Crear nuevo
PUT    /api/programas/{id}          - Actualizar
DELETE /api/programas/{id}          - Eliminar
```

### Contrataciones

```
GET    /api/contrataciones          - Listar todas
GET    /api/contrataciones/{id}     - Obtener por ID
POST   /api/contrataciones          - Crear nueva
PUT    /api/contrataciones/{id}     - Actualizar
DELETE /api/contrataciones/{id}     - Eliminar
GET    /api/contrataciones/{id}/pagos - Pagos
```

### Reservas

```
GET    /api/reservas                - Listar todas
GET    /api/reservas/{id}           - Obtener por ID
POST   /api/reservas                - Crear nueva
PUT    /api/reservas/{id}           - Actualizar
DELETE /api/reservas/{id}           - Eliminar
GET    /api/reservas/cliente/{id}   - Reservas por cliente
```

### Pagos

```
GET    /api/pagos                   - Listar todos
GET    /api/pagos/{id}              - Obtener por ID
POST   /api/pagos                   - Registrar pago
PUT    /api/pagos/{id}              - Actualizar
DELETE /api/pagos/{id}              - Eliminar
GET    /api/pagos/contratacion/{id} - Pagos por contratación
```

### Dashboard

```
GET    /api/dashboard/stats         - Estadísticas generales
GET    /api/dashboard/revenue       - Ingresos totales
GET    /api/dashboard/clients-count - Número de clientes
GET    /api/dashboard/services-count - Número de servicios
```

### Informes

```
GET    /api/informes/ingresos       - Reporte de ingresos
GET    /api/informes/servicios      - Reporte de servicios
GET    /api/informes/clientes       - Reporte de clientes
GET    /api/informes/frecuencia     - Análisis de frecuencia
POST   /api/informes/export-pdf     - Exportar a PDF
POST   /api/informes/export-excel   - Exportar a Excel
```

---

## 🔄 Patrones de Diseño

### Controller → Service → Repository

```java
// Controller
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    
    @Autowired
    private ClienteService service;
    
    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Cliente> clientes = service.getAll();
        return ResponseEntity.ok(clientes);
    }
    
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ClienteDTO dto) {
        Cliente cliente = service.create(dto);
        return ResponseEntity.status(201).body(cliente);
    }
}

// Service
@Service
public class ClienteService {
    
    @Autowired
    private ClienteRepository repository;
    
    public List<Cliente> getAll() {
        return repository.findAll();
    }
    
    public Cliente create(ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        // Mapear más campos...
        return repository.save(cliente);
    }
}

// Repository
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByEmail(String email);
    List<Cliente> findByNombreContaining(String nombre);
}
```

### DTO Pattern

```java
public class ClienteDTO {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    
    // Getters y Setters
}
```

### Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404)
            .body(new ApiError("Not Found", ex.getMessage()));
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<?> handleValidation(ValidationException ex) {
        return ResponseEntity.status(400)
            .body(new ApiError("Bad Request", ex.getMessage()));
    }
}
```

---

## 🧪 Testing

### Test Unitario

```java
@SpringBootTest
class ClienteServiceTest {
    
    @MockBean
    private ClienteRepository repository;
    
    @Autowired
    private ClienteService service;
    
    @Test
    void testGetById() {
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNombre("Juan");
        
        when(repository.findById(1L)).thenReturn(Optional.of(cliente));
        
        Cliente result = service.getById(1L);
        
        assertEquals("Juan", result.getNombre());
        verify(repository, times(1)).findById(1L);
    }
}
```

### Test de Integración

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ClienteControllerTest {
    
    @LocalServerPort
    private int port;
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void testGetClientes() {
        ResponseEntity<List> response = restTemplate.getForEntity(
            "http://localhost:" + port + "/api/clientes",
            List.class
        );
        
        assertEquals(200, response.getStatusCodeValue());
    }
}
```

---

## 🚀 Construcción y Ejecución

### Maven

```bash
# Limpiar y compilar
mvn clean compile

# Ejecutar tests
mvn test

# Construir WAR/JAR
mvn clean package

# Ejecutar aplicación
java -jar target/proyectofinal-1.0.jar

# O usando Maven
mvn spring-boot:run

# Con perfil específico
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

### Desde Windows

```batch
# Compilar
mvnw.cmd clean compile

# Ejecutar tests
mvnw.cmd test

# Compilar jar
mvnw.cmd clean package

# Ejecutar
java -jar target\proyectofinal-1.0.jar
```

---

## 📧 Servicio de Email

```java
@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendWelcomeEmail(String to, String nombre) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Bienvenido a Sistema de Seguridad");
        message.setText("Hola " + nombre + 
            ",\n\nBienvenido a nuestra plataforma.");
        mailSender.send(message);
    }
}
```

---

## 📊 Queries Útiles

### H2 Console

Acceder en: `http://localhost:8080/h2-console`

```sql
-- Ver usuarios
SELECT * FROM usuarios;

-- Ver clientes
SELECT * FROM clientes;

-- Contar clientes por estado
SELECT COUNT(*) FROM clientes WHERE activo = true;

-- Listar contrataciones recientes
SELECT * FROM contrataciones 
ORDER BY fecha_creacion DESC 
LIMIT 10;

-- Ingresos totales
SELECT SUM(monto) as total_ingresos 
FROM pagos 
WHERE estado = 'COMPLETADO';
```

---

## 🔗 CORS Configuration

```java
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

---

## 🐛 Logging

```java
private static final Logger logger = LoggerFactory.getLogger(MyClass.class);

logger.info("Información: " + mensaje);
logger.warn("Advertencia: " + mensaje);
logger.error("Error: " + mensaje, exception);
logger.debug("Debug: " + mensaje);
```

---

## 📝 Convenciones de Código

### Nombres
- Controllers: `MiEntidadController`
- Services: `MiEntidadService`
- Repositories: `MiEntidadRepository`
- DTOs: `MiEntidadDTO`
- Entidades: `MiEntidad`

### Estructura de Método

```java
@GetMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> getById(@PathVariable Long id) {
    try {
        MiEntidad entidad = service.getById(id);
        return ResponseEntity.ok(entidad);
    } catch (ResourceNotFoundException e) {
        return ResponseEntity.status(404)
            .body(new ApiError("Not Found", e.getMessage()));
    }
}
```

---

## 🔗 Referencias

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT](https://jwt.io)
- [Maven](https://maven.apache.org)

---

**Última actualización:** Diciembre 4, 2025
