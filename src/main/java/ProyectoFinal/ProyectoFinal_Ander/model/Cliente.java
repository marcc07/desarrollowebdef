package ProyectoFinal.ProyectoFinal_Ander.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "clientes")
@Schema(description = "Representa un cliente del sistema")
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único del cliente", example = "1")
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Schema(description = "Nombre completo del cliente", example = "Juan Pérez")
    private String nombre;
    
    @Schema(description = "Tipo de cliente (por ejemplo 'Empresa' o 'Particular')", example = "Empresa")
    private String tipoCliente;
    
    @Schema(description = "Documento de identidad o NIF", example = "12345678A")
    private String documentoIdentidad;
    
    @Email(message = "El email debe ser válido")
    @Schema(description = "Correo electrónico", example = "cliente@ejemplo.com")
    private String email;
    
    @Schema(description = "Teléfono de contacto", example = "+34123456789")
    private String telefono;
    
    @Schema(description = "Dirección postal")
    private String direccion;
    
    @Schema(description = "Ciudad")
    private String ciudad;
    
    @Schema(description = "País")
    private String pais;
    
    @Schema(description = "Fecha de registro en el sistema")
    private LocalDate fechaRegistro;
    
    @Schema(description = "Notas internas sobre el cliente", nullable = true)
    private String notas;
    
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Schema(hidden = true)
    private List<Contratacion> contrataciones = new ArrayList<>();
    
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Schema(hidden = true)
    private List<Reserva> reservas = new ArrayList<>();
    
    public Cliente() {
        this.fechaRegistro = LocalDate.now();
    }
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
    
    public String getTipoCliente() {
        return tipoCliente;
    }
    
    public void setTipoCliente(String tipoCliente) {
        this.tipoCliente = tipoCliente;
    }
    
    public String getDocumentoIdentidad() {
        return documentoIdentidad;
    }
    
    public void setDocumentoIdentidad(String documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public String getDireccion() {
        return direccion;
    }
    
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    
    public String getCiudad() {
        return ciudad;
    }
    
    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }
    
    public String getPais() {
        return pais;
    }
    
    public void setPais(String pais) {
        this.pais = pais;
    }
    
    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }
    
    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    
    public String getNotas() {
        return notas;
    }
    
    public void setNotas(String notas) {
        this.notas = notas;
    }
    
    public List<Contratacion> getContrataciones() {
        return contrataciones;
    }
    
    public void setContrataciones(List<Contratacion> contrataciones) {
        this.contrataciones = contrataciones;
    }
    
    public List<Reserva> getReservas() {
        return reservas;
    }
    
    public void setReservas(List<Reserva> reservas) {
        this.reservas = reservas;
    }
}

