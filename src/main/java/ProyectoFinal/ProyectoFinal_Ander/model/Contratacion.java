package ProyectoFinal.ProyectoFinal_Ander.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "contrataciones")
@Schema(description = "Representa una contratación de un servicio por un cliente")
public class Contratacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único de la contratación", example = "1")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    @NotNull(message = "El cliente es obligatorio")
    @Schema(description = "Cliente asociado", hidden = true)
    private Cliente cliente;
    
    @ManyToOne
    @JoinColumn(name = "servicio_seguridad_id", nullable = false)
    @NotNull(message = "El servicio de seguridad es obligatorio")
    @Schema(description = "Servicio de seguridad contratado", hidden = true)
    private ServicioSeguridad servicioSeguridad;
    
    @Schema(description = "Fecha de inicio", example = "2025-12-01")
    private LocalDate fechaInicio;
    
    @Schema(description = "Fecha de fin", example = "2025-12-10")
    private LocalDate fechaFin;
    
    @Schema(description = "Estado de la contratación", example = "PENDIENTE")
    private String estado;
    
    @Schema(description = "Observaciones internas")
    private String observaciones;
    
    @Schema(description = "Fecha en que se realizó la contratación")
    private LocalDate fechaContratacion;
    
    @Schema(description = "Indica si se envió confirmación al cliente")
    private boolean confirmacionEnviada = false;
    
    @OneToMany(mappedBy = "contratacion", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Schema(hidden = true)
    private List<Pago> pagos = new ArrayList<>();
    
    public Contratacion() {
        this.fechaContratacion = LocalDate.now();
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
    
    public ServicioSeguridad getServicioSeguridad() {
        return servicioSeguridad;
    }
    
    public void setServicioSeguridad(ServicioSeguridad servicioSeguridad) {
        this.servicioSeguridad = servicioSeguridad;
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
    
    public LocalDate getFechaContratacion() {
        return fechaContratacion;
    }
    
    public void setFechaContratacion(LocalDate fechaContratacion) {
        this.fechaContratacion = fechaContratacion;
    }
    
    public boolean isConfirmacionEnviada() {
        return confirmacionEnviada;
    }
    
    public void setConfirmacionEnviada(boolean confirmacionEnviada) {
        this.confirmacionEnviada = confirmacionEnviada;
    }
    
    public List<Pago> getPagos() {
        return pagos;
    }
    
    public void setPagos(List<Pago> pagos) {
        this.pagos = pagos;
    }
}

