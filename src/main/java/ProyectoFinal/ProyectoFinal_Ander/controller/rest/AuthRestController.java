package ProyectoFinal.ProyectoFinal_Ander.controller.rest;

import ProyectoFinal.ProyectoFinal_Ander.dto.ApiResponse;
import ProyectoFinal.ProyectoFinal_Ander.model.Usuario;
import ProyectoFinal.ProyectoFinal_Ander.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Auth", description = "Operaciones de autenticación y usuarios")
public class AuthRestController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * POST /api/auth/login
     * Inicia sesión con usuario y contraseña
     */
    @PostMapping("/login")
        @io.swagger.v3.oas.annotations.Operation(summary = "Iniciar sesión", description = "Autentica al usuario con username y password")
        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Credenciales: {username, password}")
        @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login exitoso"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Credenciales incorrectas")
        })
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(
            @RequestBody Map<String, String> credentials,
            HttpServletRequest request) {
        
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");

            if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Usuario y contraseña son requeridos"));
            }

            Optional<Usuario> usuarioOpt = usuarioService.buscarPorUsername(username);
            
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Usuario o contraseña incorrectos"));
            }

            Usuario usuario = usuarioOpt.get();
            
            if (!usuario.isActivo()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Usuario inactivo"));
            }

            // Intentar autenticar con Spring Security
            try {
                Authentication authRequest = new UsernamePasswordAuthenticationToken(username, password);
                Authentication authentication = authenticationManager.authenticate(authRequest);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Usuario o contraseña incorrectos"));
            }

            Map<String, Object> datos = new HashMap<>();
            datos.put("username", usuario.getUsername());
            datos.put("nombreCompleto", usuario.getNombreCompleto());
            datos.put("email", usuario.getEmail());
            datos.put("rol", usuario.getRol());
            datos.put("id", usuario.getId());

            return ResponseEntity.ok(ApiResponse.success("Login exitoso", datos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al iniciar sesión: " + e.getMessage()));
        }
    }

    /**
     * POST /api/auth/logout
     * Cierra la sesión del usuario
     */
    @PostMapping("/logout")
    @io.swagger.v3.oas.annotations.Operation(summary = "Cerrar sesión", description = "Cierra la sesión del usuario autenticado")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                new SecurityContextLogoutHandler().logout(request, response, auth);
            }
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(ApiResponse.success("Sesión cerrada exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al cerrar sesión: " + e.getMessage()));
        }
    }

    /**
     * GET /api/auth/current
     * Obtiene el usuario actual autenticado
     */
    @GetMapping("/current")
        @io.swagger.v3.oas.annotations.Operation(summary = "Usuario actual", description = "Obtiene información del usuario autenticado")
        @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Usuario obtenido"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "No autenticado")
        })
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("No hay usuario autenticado"));
            }

            String username = auth.getName();
            Optional<Usuario> usuarioOpt = usuarioService.buscarPorUsername(username);
            
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Usuario no encontrado"));
            }

            Usuario usuario = usuarioOpt.get();
            Map<String, Object> datos = new HashMap<>();
            datos.put("username", usuario.getUsername());
            datos.put("nombreCompleto", usuario.getNombreCompleto());
            datos.put("email", usuario.getEmail());
            datos.put("rol", usuario.getRol());
            datos.put("id", usuario.getId());

            return ResponseEntity.ok(ApiResponse.success("Usuario obtenido exitosamente", datos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener usuario: " + e.getMessage()));
        }
    }

    /**
     * POST /api/auth/register
     * Registra un nuevo usuario
     */
    @PostMapping("/register")
        @io.swagger.v3.oas.annotations.Operation(summary = "Registrar usuario", description = "Registra un nuevo usuario en el sistema")
        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Usuario a registrar")
        @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Usuario registrado"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Errores de validación")
        })
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(
            @Valid @RequestBody Usuario usuario,
            BindingResult result) {
        
        try {
            if (result.hasErrors()) {
                StringBuilder errores = new StringBuilder();
                result.getFieldErrors().forEach(error -> 
                    errores.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("; ")
                );
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Errores de validación: " + errores.toString()));
            }

            if (usuarioService.existeUsername(usuario.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("El nombre de usuario ya existe"));
            }

            if (usuarioService.existeEmail(usuario.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("El email ya está registrado"));
            }

            usuario.setRol("USER");
            usuario.setActivo(true);
            Usuario usuarioGuardado = usuarioService.guardar(usuario);

            Map<String, Object> datos = new HashMap<>();
            datos.put("username", usuarioGuardado.getUsername());
            datos.put("nombreCompleto", usuarioGuardado.getNombreCompleto());
            datos.put("email", usuarioGuardado.getEmail());
            datos.put("rol", usuarioGuardado.getRol());
            datos.put("id", usuarioGuardado.getId());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Usuario registrado exitosamente", datos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al registrar usuario: " + e.getMessage()));
        }
    }
}

