package ProyectoFinal.ProyectoFinal_Ander.controller.rest;

import ProyectoFinal.ProyectoFinal_Ander.dto.ApiResponse;
import ProyectoFinal.ProyectoFinal_Ander.model.Contratacion;
import ProyectoFinal.ProyectoFinal_Ander.service.ContratacionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contrataciones")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Contrataciones", description = "Operaciones sobre contrataciones")
public class ContratacionRestController {

    @Autowired
    private ContratacionService contratacionService;

    @GetMapping
    @Transactional(readOnly = true)
        @io.swagger.v3.oas.annotations.Operation(summary = "Listar contrataciones", description = "Lista contrataciones con filtros opcionales")
    public ResponseEntity<ApiResponse<List<Contratacion>>> listar(
            @io.swagger.v3.oas.annotations.Parameter(description = "Estado de la contratación") @RequestParam(required = false) String estado,
            @io.swagger.v3.oas.annotations.Parameter(description = "ID del cliente") @RequestParam(required = false) Long clienteId,
            @io.swagger.v3.oas.annotations.Parameter(description = "ID del servicio") @RequestParam(required = false) Long servicioId,
            @io.swagger.v3.oas.annotations.Parameter(description = "Fecha inicio (YYYY-MM-DD)") @RequestParam(required = false) String fechaInicio,
            @io.swagger.v3.oas.annotations.Parameter(description = "Fecha fin (YYYY-MM-DD)") @RequestParam(required = false) String fechaFin) {
        
        try {
            List<Contratacion> contrataciones;
            
            LocalDate inicio = null;
            LocalDate fin = null;
            
            if (fechaInicio != null && !fechaInicio.isEmpty()) {
                try {
                    inicio = LocalDate.parse(fechaInicio);
                } catch (Exception e) {
                }
            }
            
            if (fechaFin != null && !fechaFin.isEmpty()) {
                try {
                    fin = LocalDate.parse(fechaFin);
                } catch (Exception e) {
                }
            }
            
            boolean hayFiltros = estado != null || clienteId != null || servicioId != null || inicio != null || fin != null;
            
            if (hayFiltros) {
                contrataciones = contratacionService.buscarConFiltros(clienteId, servicioId, estado, inicio, fin);
            } else {
                contrataciones = contratacionService.listarTodos();
            }
            
            return ResponseEntity.ok(ApiResponse.success("Contrataciones obtenidas exitosamente", contrataciones));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener contrataciones: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    @io.swagger.v3.oas.annotations.Operation(summary = "Obtener contratación por ID", description = "Obtiene una contratación por su identificador")
    public ResponseEntity<ApiResponse<Contratacion>> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<Contratacion> contratacionOpt = contratacionService.buscarPorId(id);
            
            if (contratacionOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Contratación no encontrada"));
            }
            
            return ResponseEntity.ok(ApiResponse.success("Contratación obtenida exitosamente", contratacionOpt.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener contratación: " + e.getMessage()));
        }
    }

    @PostMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Crear contratación", description = "Crea una nueva contratación")
    public ResponseEntity<ApiResponse<Contratacion>> crear(
            @Valid @RequestBody Contratacion contratacion,
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
            
            Contratacion contratacionGuardada = contratacionService.guardar(contratacion);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Contratación creada exitosamente", contratacionGuardada));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear contratación: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @io.swagger.v3.oas.annotations.Operation(summary = "Actualizar contratación", description = "Actualiza una contratación existente")
    public ResponseEntity<ApiResponse<Contratacion>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Contratacion contratacion,
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
            
            Optional<Contratacion> contratacionExistente = contratacionService.buscarPorId(id);
            if (contratacionExistente.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Contratación no encontrada"));
            }
            
            contratacion.setId(id);
            Contratacion contratacionActualizada = contratacionService.guardar(contratacion);
            return ResponseEntity.ok(ApiResponse.success("Contratación actualizada exitosamente", contratacionActualizada));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar contratación: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @io.swagger.v3.oas.annotations.Operation(summary = "Eliminar contratación", description = "Elimina una contratación por su ID")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        try {
            Optional<Contratacion> contratacionOpt = contratacionService.buscarPorId(id);
            if (contratacionOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Contratación no encontrada"));
            }
            
            contratacionService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("Contratación eliminada exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar contratación: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/cancelar")
    @io.swagger.v3.oas.annotations.Operation(summary = "Cancelar contratación", description = "Cancela una contratación por su ID")
    public ResponseEntity<ApiResponse<Contratacion>> cancelar(@PathVariable Long id) {
        try {
            Contratacion contratacionCancelada = contratacionService.cancelar(id);
            if (contratacionCancelada == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Contratación no encontrada"));
            }
            return ResponseEntity.ok(ApiResponse.success("Contratación cancelada exitosamente", contratacionCancelada));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al cancelar contratación: " + e.getMessage()));
        }
    }
}









