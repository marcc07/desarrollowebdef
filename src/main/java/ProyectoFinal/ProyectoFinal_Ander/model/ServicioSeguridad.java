package ProyectoFinal.ProyectoFinal_Ander.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "servicios_seguridad")
@Schema(description = "Servicio de seguridad ofrecido por la empresa")
public class ServicioSeguridad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único del servicio", example = "1")
    private Long id;
    
    @NotBlank(message = "El nombre del servicio es obligatorio")
    @Schema(description = "Nombre del servicio", example = "Vigilancia 24 horas")
    private String nombre;
    
    @Schema(description = "Tipo de servicio", example = "Vigilancia")
    private String tipo;
    
    @NotBlank(message = "La descripción es obligatoria")
    @Column(length = 1000)
    @Schema(description = "Descripción completa del servicio")
    private String descripcion;
    
    @Schema(description = "Ubicación del servicio")
    private String ubicacion;
    
    @DecimalMin(value = "0.0", message = "El precio debe ser mayor o igual a 0")
    @Schema(description = "Precio del servicio", example = "500.00")
    private BigDecimal precio;
    
    @Schema(description = "Duración del servicio", example = "24 horas")
    private String duracion;
    
    @Schema(description = "Personal asignado")
    private String personalAsignado;
    
    @Schema(description = "Horarios de disponibilidad")
    private String horarios;
    
    @Schema(description = "Herramientas y equipos utilizados")
    private String herramientas;
    
    @Schema(description = "Condiciones y restricciones")
    private String condiciones;
    
    @Schema(description = "Indica si el servicio está activo")
    private boolean activo = true;
    
    @OneToMany(mappedBy = "servicioSeguridad", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Schema(hidden = true)
    private List<Contratacion> contrataciones = new ArrayList<>();
    
    public ServicioSeguridad() {}
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getTipo() {
        return tipo;
    }
    
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getUbicacion() {
        return ubicacion;
    }
    
    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }
    
    public BigDecimal getPrecio() {
        return precio;
    }
    
    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }
    
    public String getDuracion() {
        return duracion;
    }
    
    public void setDuracion(String duracion) {
        this.duracion = duracion;
    }
    
    public String getPersonalAsignado() {
        return personalAsignado;
    }
    
    public void setPersonalAsignado(String personalAsignado) {
        this.personalAsignado = personalAsignado;
    }
    
    public String getHorarios() {
        return horarios;
    }
    
    public void setHorarios(String horarios) {
        this.horarios = horarios;
    }
    
    public String getHerramientas() {
        return herramientas;
    }
    
    public void setHerramientas(String herramientas) {
        this.herramientas = herramientas;
    }
    
    public String getCondiciones() {
        return condiciones;
    }
    
    public void setCondiciones(String condiciones) {
        this.condiciones = condiciones;
    }
    
    public boolean isActivo() {
        return activo;
    }
    
    public void setActivo(boolean activo) {
        this.activo = activo;
    }
    
    public List<Contratacion> getContrataciones() {
        return contrataciones;
    }
    
    public void setContrataciones(List<Contratacion> contrataciones) {
        this.contrataciones = contrataciones;
    }
}

