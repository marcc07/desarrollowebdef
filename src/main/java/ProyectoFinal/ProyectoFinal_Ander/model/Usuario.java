package ProyectoFinal.ProyectoFinal_Ander.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "usuarios")
@Schema(description = "Usuario del sistema")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único del usuario", example = "1")
    private Long id;
    
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    @Column(unique = true, nullable = false)
    @Schema(description = "Nombre de usuario único", example = "juan123")
    private String username;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 4, message = "La contraseña debe tener al menos 4 caracteres")
    @Schema(description = "Contraseña encriptada", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String password;
    
    @NotBlank(message = "El nombre completo es obligatorio")
    @Schema(description = "Nombre completo del usuario", example = "Juan Pérez García")
    private String nombreCompleto;
    
    @NotBlank(message = "El email es obligatorio")
    @Column(unique = true)
    @Schema(description = "Correo electrónico del usuario", example = "juan@ejemplo.com")
    private String email;
    
    @Schema(description = "Rol del usuario", example = "USER")
    private String rol = "USER";
    
    @Schema(description = "Indica si el usuario está activo en el sistema")
    private boolean activo = true;
    
    public Usuario() {}
    
    public Usuario(String username, String password, String nombreCompleto, String email) {
        this.username = username;
        this.password = password;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
    }
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getNombreCompleto() {
        return nombreCompleto;
    }
    
    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRol() {
        return rol;
    }
    
    public void setRol(String rol) {
        this.rol = rol;
    }
    
    public boolean isActivo() {
        return activo;
    }
    
    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}

