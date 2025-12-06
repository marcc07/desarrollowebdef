package ProyectoFinal.ProyectoFinal_Ander.controller.rest;

import ProyectoFinal.ProyectoFinal_Ander.dto.ApiResponse;
import ProyectoFinal.ProyectoFinal_Ander.model.Cliente;
import ProyectoFinal.ProyectoFinal_Ander.service.ClienteService;
import ProyectoFinal.ProyectoFinal_Ander.service.ContratacionService;
import ProyectoFinal.ProyectoFinal_Ander.service.ReservaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Clientes", description = "Operaciones sobre clientes")
public class ClienteRestController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ContratacionService contratacionService;

    @Autowired
    private ReservaService reservaService;

    /**
     * GET /api/clientes
     * Lista todos los clientes con filtros opcionales
     */
    @GetMapping
    @Transactional(readOnly = true)
        @io.swagger.v3.oas.annotations.Operation(summary = "Listar clientes", description = "Lista clientes con filtros opcionales")
        @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Clientes obtenidos exitosamente")
        })
    public ResponseEntity<ApiResponse<List<Cliente>>> listar(
            @io.swagger.v3.oas.annotations.Parameter(description = "Texto para búsqueda") @RequestParam(required = false) String busqueda,
            @io.swagger.v3.oas.annotations.Parameter(description = "Filtrar por tipo de cliente") @RequestParam(required = false) String tipoCliente,
            @io.swagger.v3.oas.annotations.Parameter(description = "Filtrar por ciudad") @RequestParam(required = false) String ciudad,
            @io.swagger.v3.oas.annotations.Parameter(description = "Filtrar por email") @RequestParam(required = false) String email,
            @io.swagger.v3.oas.annotations.Parameter(description = "Filtrar por teléfono") @RequestParam(required = false) String telefono,
            @io.swagger.v3.oas.annotations.Parameter(description = "Filtrar por documento") @RequestParam(required = false) String documento) {

        try {
            List<Cliente> clientes;

            if (busqueda != null && !busqueda.isEmpty()) {
                clientes = clienteService.buscarPorTexto(busqueda);
            } else {
                boolean hayFiltros = (tipoCliente != null && !tipoCliente.isEmpty()) ||
                                    (ciudad != null && !ciudad.isEmpty()) ||
                                    (email != null && !email.isEmpty()) ||
                                    (telefono != null && !telefono.isEmpty()) ||
                                    (documento != null && !documento.isEmpty());

                if (hayFiltros) {
                    clientes = clienteService.buscarConFiltros(tipoCliente, ciudad, email, telefono, documento);
                } else {
                    clientes = clienteService.listarTodos();
                }
            }

            return ResponseEntity.ok(ApiResponse.success("Clientes obtenidos exitosamente", clientes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener clientes: " + e.getMessage()));
        }
    }

    /**
     * GET /api/clientes/{id}
     * Obtiene un cliente por su ID
     */
    @GetMapping("/{id}")
        @io.swagger.v3.oas.annotations.Operation(summary = "Obtener cliente por ID", description = "Obtiene un cliente y sus relaciones básicas")
        @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cliente obtenido exitosamente"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cliente no encontrado")
        })
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<Cliente> clienteOpt = clienteService.buscarPorId(id);

            if (clienteOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Cliente no encontrado"));
            }

            Cliente cliente = clienteOpt.get();
            Map<String, Object> datos = new HashMap<>();
            datos.put("cliente", cliente);
            datos.put("contrataciones", contratacionService.buscarPorCliente(id));
            datos.put("reservas", reservaService.buscarPorCliente(id));

            return ResponseEntity.ok(ApiResponse.success("Cliente obtenido exitosamente", datos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener cliente: " + e.getMessage()));
        }
    }

    /**
     * POST /api/clientes
     * Crea un nuevo cliente
     */
    @PostMapping
        @io.swagger.v3.oas.annotations.Operation(summary = "Crear cliente", description = "Crea un nuevo cliente en el sistema")
        @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Cliente creado exitosamente"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Errores de validación en el cuerpo")
        })
    public ResponseEntity<ApiResponse<Cliente>> crear(
            @Valid @RequestBody Cliente cliente,
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

            Cliente clienteGuardado = clienteService.guardar(cliente);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Cliente creado exitosamente", clienteGuardado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear cliente: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/clientes/{id}
     * Actualiza un cliente existente
     */
    @PutMapping("/{id}")
        @io.swagger.v3.oas.annotations.Operation(summary = "Actualizar cliente", description = "Actualiza los datos de un cliente existente")
        @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cliente actualizado exitosamente"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Errores de validación"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cliente no encontrado")
        })
    public ResponseEntity<ApiResponse<Cliente>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Cliente cliente,
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

            Optional<Cliente> clienteExistente = clienteService.buscarPorId(id);
            if (clienteExistente.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Cliente no encontrado"));
            }

            cliente.setId(id);
            Cliente clienteActualizado = clienteService.guardar(cliente);
            return ResponseEntity.ok(ApiResponse.success("Cliente actualizado exitosamente", clienteActualizado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar cliente: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/clientes/{id}
     * Elimina un cliente
     */
    @DeleteMapping("/{id}")
        @io.swagger.v3.oas.annotations.Operation(summary = "Eliminar cliente", description = "Elimina un cliente por su ID")
        @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cliente eliminado exitosamente"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cliente no encontrado")
        })
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        try {
            Optional<Cliente> clienteOpt = clienteService.buscarPorId(id);
            if (clienteOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Cliente no encontrado"));
            }

            clienteService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("Cliente eliminado exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar cliente: " + e.getMessage()));
        }
    }
}

