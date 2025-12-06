package ProyectoFinal.ProyectoFinal_Ander.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "programas_entrenamiento")
@Schema(description = "Programa de entrenamiento o curso ofrecido")
public class ProgramaEntrenamiento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único del programa", example = "1")
    private Long id;
    
    @NotBlank(message = "El nombre del programa es obligatorio")
    @Schema(description = "Nombre del programa", example = "Curso de Defensa Personal")
    private String nombre;
    
    @NotBlank(message = "El contenido es obligatorio")
    @Column(length = 2000)
    @Schema(description = "Contenido del programa")
    private String contenido;
    
    @Schema(description = "Requisitos para el participante")
    private String requisitos;
    
    @Schema(description = "Instructor a cargo", example = "Carlos Gómez")
    private String instructor;
    
    @DecimalMin(value = "0.0", message = "El costo debe ser mayor o igual a 0")
    @Schema(description = "Costo del programa", example = "299.99")
    private BigDecimal costo;
    
    @Min(value = 1, message = "La duración debe ser al menos 1 día")
    @Schema(description = "Duración en días", example = "3")
    private Integer duracionDias;
    
    @Min(value = 1, message = "El cupo debe ser al menos 1")
    @Schema(description = "Cupo total")
    private Integer cupo;
    
    @Schema(description = "Cupo disponible")
    private Integer cupoDisponible;
    
    @Schema(description = "Fecha de inicio del programa", example = "2025-12-01")
    private LocalDate fechaInicio;
    
    @Schema(description = "Fecha de fin del programa", example = "2025-12-05")
    private LocalDate fechaFin;
    
    @Schema(description = "Temario resumido")
    private String temario;
    
    @Schema(description = "Indica si el programa está activo")
    private boolean activo = true;
    
    @OneToMany(mappedBy = "programaEntrenamiento", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Schema(hidden = true)
    private List<Reserva> reservas = new ArrayList<>();
    
    public ProgramaEntrenamiento() {}
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
    
    public String getContenido() {
        return contenido;
    }
    
    public void setContenido(String contenido) {
        this.contenido = contenido;
    }
    
    public String getRequisitos() {
        return requisitos;
    }
    
    public void setRequisitos(String requisitos) {
        this.requisitos = requisitos;
    }
    
    public String getInstructor() {
        return instructor;
    }
    
    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }
    
    public BigDecimal getCosto() {
        return costo;
    }
    
    public void setCosto(BigDecimal costo) {
        this.costo = costo;
    }
    
    public Integer getDuracionDias() {
        return duracionDias;
    }
    
    public void setDuracionDias(Integer duracionDias) {
        this.duracionDias = duracionDias;
    }
    
    public Integer getCupo() {
        return cupo;
    }
    
    public void setCupo(Integer cupo) {
        this.cupo = cupo;
    }
    
    public Integer getCupoDisponible() {
        return cupoDisponible;
    }
    
    public void setCupoDisponible(Integer cupoDisponible) {
        this.cupoDisponible = cupoDisponible;
    }
    
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }
    
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    
    public LocalDate getFechaFin() {
        return fechaFin;
    }
    
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
    
    public String getTemario() {
        return temario;
    }
    
    public void setTemario(String temario) {
        this.temario = temario;
    }
    
    public boolean isActivo() {
        return activo;
    }
    
    public void setActivo(boolean activo) {
        this.activo = activo;
    }
    
    public List<Reserva> getReservas() {
        return reservas;
    }
    
    public void setReservas(List<Reserva> reservas) {
        this.reservas = reservas;
    }
}

