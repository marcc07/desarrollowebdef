package ProyectoFinal.ProyectoFinal_Ander.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDate;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "pagos")
@Schema(description = "Registro de un pago realizado por un cliente")
public class Pago {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único del pago", example = "1")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    @NotNull(message = "El cliente es obligatorio")
    @Schema(description = "Cliente que realiza el pago", hidden = true)
    private Cliente cliente;
    
    @ManyToOne
    @JoinColumn(name = "contratacion_id")
    @Schema(description = "Contratación asociada al pago", hidden = true)
    private Contratacion contratacion;
    
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    @NotNull(message = "El monto es obligatorio")
    @Schema(description = "Monto del pago", example = "150.00")
    private BigDecimal monto;
    
    @Schema(description = "Fecha del pago", example = "2025-12-05")
    private LocalDate fechaPago;
    
    @Schema(description = "Medio de pago utilizado", example = "TARJETA")
    private String medioPago;
    
    @Schema(description = "Estado del pago", example = "PENDIENTE")
    private String estado;
    
    @Schema(description = "Número de referencia del pago")
    private String numeroReferencia;
    
    @Schema(description = "Observaciones sobre el pago")
    private String observaciones;
    
    public Pago() {
        this.fechaPago = LocalDate.now();
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
    
    public Contratacion getContratacion() {
        return contratacion;
    }
    
    public void setContratacion(Contratacion contratacion) {
        this.contratacion = contratacion;
    }
    
    public BigDecimal getMonto() {
        return monto;
    }
    
    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
    
    public LocalDate getFechaPago() {
        return fechaPago;
    }
    
    public void setFechaPago(LocalDate fechaPago) {
        this.fechaPago = fechaPago;
    }
    
    public String getMedioPago() {
        return medioPago;
    }
    
    public void setMedioPago(String medioPago) {
        this.medioPago = medioPago;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public String getNumeroReferencia() {
        return numeroReferencia;
    }
    
    public void setNumeroReferencia(String numeroReferencia) {
        this.numeroReferencia = numeroReferencia;
    }
    
    public String getObservaciones() {
        return observaciones;
    }
    
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}

