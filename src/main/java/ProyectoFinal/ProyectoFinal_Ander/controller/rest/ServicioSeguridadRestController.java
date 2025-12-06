package ProyectoFinal.ProyectoFinal_Ander.controller.rest;

import ProyectoFinal.ProyectoFinal_Ander.dto.ApiResponse;
import ProyectoFinal.ProyectoFinal_Ander.model.ServicioSeguridad;
import ProyectoFinal.ProyectoFinal_Ander.service.ServicioSeguridadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/servicios")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Servicios", description = "Operaciones sobre servicios de seguridad")
public class ServicioSeguridadRestController {

    @Autowired
    private ServicioSeguridadService servicioService;

    @GetMapping
    @Transactional(readOnly = true)
        @io.swagger.v3.oas.annotations.Operation(summary = "Listar servicios", description = "Lista servicios con filtros opcionales")
    public ResponseEntity<ApiResponse<List<ServicioSeguridad>>> listar(
            @io.swagger.v3.oas.annotations.Parameter(description = "Texto para búsqueda") @RequestParam(required = false) String busqueda,
            @io.swagger.v3.oas.annotations.Parameter(description = "Tipo de servicio") @RequestParam(required = false) String tipo,
            @io.swagger.v3.oas.annotations.Parameter(description = "Ubicación del servicio") @RequestParam(required = false) String ubicacion,
            @io.swagger.v3.oas.annotations.Parameter(description = "Duración del servicio") @RequestParam(required = false) String duracion,
            @io.swagger.v3.oas.annotations.Parameter(description = "Precio mínimo") @RequestParam(required = false) String precioMin,
            @io.swagger.v3.oas.annotations.Parameter(description = "Precio máximo") @RequestParam(required = false) String precioMax) {
        
        try {
            List<ServicioSeguridad> servicios;
            
            if (busqueda != null && !busqueda.isEmpty()) {
                servicios = servicioService.buscarPorTexto(busqueda);
            } else {
                BigDecimal min = null;
                BigDecimal max = null;
                
                if (precioMin != null && !precioMin.isEmpty()) {
                    try {
                        min = new BigDecimal(precioMin);
                    } catch (NumberFormatException e) {
                    }
                }
                
                if (precioMax != null && !precioMax.isEmpty()) {
                    try {
                        max = new BigDecimal(precioMax);
                    } catch (NumberFormatException e) {
                    }
                }
                
                boolean hayFiltros = (tipo != null && !tipo.isEmpty()) ||
                                    (ubicacion != null && !ubicacion.isEmpty()) ||
                                    (duracion != null && !duracion.isEmpty()) ||
                                    (min != null || max != null);
                
                if (hayFiltros) {
                    servicios = servicioService.listarTodos();
                    
                    if (tipo != null && !tipo.isEmpty()) {
                        servicios = servicios.stream()
                                .filter(s -> tipo.equals(s.getTipo()))
                                .toList();
                    }
                    if (ubicacion != null && !ubicacion.isEmpty()) {
                        servicios = servicios.stream()
                                .filter(s -> s.getUbicacion() != null && s.getUbicacion().toLowerCase().contains(ubicacion.toLowerCase()))
                                .toList();
                    }
                    if (duracion != null && !duracion.isEmpty()) {
                        servicios = servicios.stream()
                                .filter(s -> s.getDuracion() != null && s.getDuracion().equals(duracion))
                                .toList();
                    }
                    if (min != null || max != null) {
                        BigDecimal finalMin = min;
                        BigDecimal finalMax = max;
                        servicios = servicios.stream()
                                .filter(s -> {
                                    if (s.getPrecio() == null) return false;
                                    if (finalMin != null && s.getPrecio().compareTo(finalMin) < 0) return false;
                                    if (finalMax != null && s.getPrecio().compareTo(finalMax) > 0) return false;
                                    return true;
                                })
                                .toList();
                    }
                } else {
                    servicios = servicioService.listarTodos();
                }
            }
            
            return ResponseEntity.ok(ApiResponse.success("Servicios obtenidos exitosamente", servicios));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener servicios: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    @io.swagger.v3.oas.annotations.Operation(summary = "Obtener servicio por ID", description = "Obtiene un servicio por su identificador")
    public ResponseEntity<ApiResponse<ServicioSeguridad>> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<ServicioSeguridad> servicioOpt = servicioService.buscarPorId(id);
            
            if (servicioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Servicio no encontrado"));
            }
            
            return ResponseEntity.ok(ApiResponse.success("Servicio obtenido exitosamente", servicioOpt.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener servicio: " + e.getMessage()));
        }
    }

    @PostMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Crear servicio", description = "Crea un nuevo servicio de seguridad")
    public ResponseEntity<ApiResponse<ServicioSeguridad>> crear(
            @Valid @RequestBody ServicioSeguridad servicio,
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
            
            ServicioSeguridad servicioGuardado = servicioService.guardar(servicio);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Servicio creado exitosamente", servicioGuardado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear servicio: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @io.swagger.v3.oas.annotations.Operation(summary = "Actualizar servicio", description = "Actualiza un servicio existente")
    public ResponseEntity<ApiResponse<ServicioSeguridad>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ServicioSeguridad servicio,
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
            
            Optional<ServicioSeguridad> servicioExistente = servicioService.buscarPorId(id);
            if (servicioExistente.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Servicio no encontrado"));
            }
            
            servicio.setId(id);
            ServicioSeguridad servicioActualizado = servicioService.guardar(servicio);
            return ResponseEntity.ok(ApiResponse.success("Servicio actualizado exitosamente", servicioActualizado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar servicio: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @io.swagger.v3.oas.annotations.Operation(summary = "Eliminar servicio", description = "Elimina un servicio por su ID")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        try {
            Optional<ServicioSeguridad> servicioOpt = servicioService.buscarPorId(id);
            if (servicioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Servicio no encontrado"));
            }
            
            servicioService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("Servicio eliminado exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar servicio: " + e.getMessage()));
        }
    }
}









