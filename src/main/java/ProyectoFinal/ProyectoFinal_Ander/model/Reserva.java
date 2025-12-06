package ProyectoFinal.ProyectoFinal_Ander.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "reservas")
@Schema(description = "Representa una reserva de un programa por un cliente")
public class Reserva {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único de la reserva", example = "1")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    @NotNull(message = "El cliente es obligatorio")
    @Schema(description = "Cliente asociado", hidden = true)
    private Cliente cliente;
    
    @ManyToOne
    @JoinColumn(name = "programa_entrenamiento_id", nullable = false)
    @NotNull(message = "El programa de entrenamiento es obligatorio")
    @Schema(description = "Programa asociado", hidden = true)
    private ProgramaEntrenamiento programaEntrenamiento;
    
    @Schema(description = "Fecha de la reserva", example = "2025-12-05")
    private LocalDate fechaReserva;
    
    @Schema(description = "Estado de la reserva", example = "PENDIENTE")
    private String estado;
    
    @Schema(description = "Observaciones")
    private String observaciones;
    
    @Schema(description = "Indica si se envió confirmación")
    private boolean confirmacionEnviada = false;
    
    public Reserva() {
        this.fechaReserva = LocalDate.now();
        this.estado = "PENDIENTE";
    }
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Cliente getCliente() {
        return cliente;
    }
    
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    
    public ProgramaEntrenamiento getProgramaEntrenamiento() {
        return programaEntrenamiento;
    }
    
    public void setProgramaEntrenamiento(ProgramaEntrenamiento programaEntrenamiento) {
        this.programaEntrenamiento = programaEntrenamiento;
    }
    
    public LocalDate getFechaReserva() {
        return fechaReserva;
    }
    
    public void setFechaReserva(LocalDate fechaReserva) {
        this.fechaReserva = fechaReserva;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public String getObservaciones() {
        return observaciones;
    }
    
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    
    public boolean isConfirmacionEnviada() {
        return confirmacionEnviada;
    }
    
    public void setConfirmacionEnviada(boolean confirmacionEnviada) {
        this.confirmacionEnviada = confirmacionEnviada;
    }
}

