package ProyectoFinal.ProyectoFinal_Ander.controller.rest;

import ProyectoFinal.ProyectoFinal_Ander.dto.ApiResponse;
import ProyectoFinal.ProyectoFinal_Ander.model.Reserva;
import ProyectoFinal.ProyectoFinal_Ander.service.ReservaService;
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
@RequestMapping("/api/reservas")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Reservas", description = "Operaciones sobre reservas")
public class ReservaRestController {

    @Autowired
    private ReservaService reservaService;

    @GetMapping
    @Transactional(readOnly = true)
        @io.swagger.v3.oas.annotations.Operation(summary = "Listar reservas", description = "Lista reservas con filtros opcionales")
    public ResponseEntity<ApiResponse<List<Reserva>>> listar(
            @io.swagger.v3.oas.annotations.Parameter(description = "Estado de la reserva") @RequestParam(required = false) String estado,
            @io.swagger.v3.oas.annotations.Parameter(description = "ID del cliente") @RequestParam(required = false) Long clienteId,
            @io.swagger.v3.oas.annotations.Parameter(description = "ID del programa") @RequestParam(required = false) Long programaId,
            @io.swagger.v3.oas.annotations.Parameter(description = "Fecha inicio (YYYY-MM-DD)") @RequestParam(required = false) String fechaInicio,
            @io.swagger.v3.oas.annotations.Parameter(description = "Fecha fin (YYYY-MM-DD)") @RequestParam(required = false) String fechaFin) {
        
        try {
            List<Reserva> reservas;
            
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
            
            boolean hayFiltros = estado != null || clienteId != null || programaId != null || inicio != null || fin != null;
            
            if (hayFiltros) {
                reservas = reservaService.buscarConFiltros(clienteId, programaId, estado, inicio, fin);
            } else {
                reservas = reservaService.listarTodos();
            }
            
            return ResponseEntity.ok(ApiResponse.success("Reservas obtenidas exitosamente", reservas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener reservas: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    @io.swagger.v3.oas.annotations.Operation(summary = "Obtener reserva por ID", description = "Obtiene una reserva por su identificador")
    public ResponseEntity<ApiResponse<Reserva>> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<Reserva> reservaOpt = reservaService.buscarPorId(id);
            
            if (reservaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Reserva no encontrada"));
            }
            
            return ResponseEntity.ok(ApiResponse.success("Reserva obtenida exitosamente", reservaOpt.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener reserva: " + e.getMessage()));
        }
    }

    @PostMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Crear reserva", description = "Crea una nueva reserva")
    public ResponseEntity<ApiResponse<Reserva>> crear(
            @Valid @RequestBody Reserva reserva,
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
            
            Reserva reservaGuardada = reservaService.guardar(reserva);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Reserva creada exitosamente", reservaGuardada));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear reserva: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @io.swagger.v3.oas.annotations.Operation(summary = "Actualizar reserva", description = "Actualiza una reserva existente")
    public ResponseEntity<ApiResponse<Reserva>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Reserva reserva,
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
            
            Optional<Reserva> reservaExistente = reservaService.buscarPorId(id);
            if (reservaExistente.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Reserva no encontrada"));
            }
            
            reserva.setId(id);
            Reserva reservaActualizada = reservaService.guardar(reserva);
            return ResponseEntity.ok(ApiResponse.success("Reserva actualizada exitosamente", reservaActualizada));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar reserva: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @io.swagger.v3.oas.annotations.Operation(summary = "Eliminar reserva", description = "Elimina una reserva por su ID")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        try {
            Optional<Reserva> reservaOpt = reservaService.buscarPorId(id);
            if (reservaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Reserva no encontrada"));
            }
            
            reservaService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("Reserva eliminada exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar reserva: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/cancelar")
    @io.swagger.v3.oas.annotations.Operation(summary = "Cancelar reserva", description = "Cancela una reserva por su ID")
    public ResponseEntity<ApiResponse<Reserva>> cancelar(@PathVariable Long id) {
        try {
            Reserva reservaCancelada = reservaService.cancelar(id);
            if (reservaCancelada == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Reserva no encontrada"));
            }
            return ResponseEntity.ok(ApiResponse.success("Reserva cancelada exitosamente", reservaCancelada));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al cancelar reserva: " + e.getMessage()));
        }
    }
}









