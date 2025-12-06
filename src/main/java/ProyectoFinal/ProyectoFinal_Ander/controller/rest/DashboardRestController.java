package ProyectoFinal.ProyectoFinal_Ander.controller.rest;

import ProyectoFinal.ProyectoFinal_Ander.dto.ApiResponse;
import ProyectoFinal.ProyectoFinal_Ander.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Dashboard", description = "Resumen y estadísticas del sistema")
public class DashboardRestController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ServicioSeguridadService servicioService;

    @Autowired
    private ProgramaEntrenamientoService programaService;

    @Autowired
    private ContratacionService contratacionService;

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private PagoService pagoService;

    @Autowired
    private InformeService informeService;

    @GetMapping
    @Transactional(readOnly = true)
    @io.swagger.v3.oas.annotations.Operation(summary = "Datos del dashboard", description = "Obtiene totales y estadísticas del sistema")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        try {
            Map<String, Object> datos = new HashMap<>();
            
            // Totales
            datos.put("totalClientes", clienteService.listarTodos().size());
            datos.put("totalServicios", servicioService.listarTodos().size());
            datos.put("totalProgramas", programaService.listarTodos().size());
            datos.put("totalContrataciones", contratacionService.listarTodos().size());
            datos.put("totalReservas", reservaService.listarTodos().size());
            datos.put("totalPagos", pagoService.listarTodos().size());
            
            // Estadísticas adicionales
            var estadisticas = informeService.generarEstadisticasGenerales();
            datos.put("estadisticas", estadisticas);
            
            return ResponseEntity.ok(ApiResponse.success("Datos del dashboard obtenidos exitosamente", datos));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Error al obtener datos del dashboard: " + e.getMessage()));
        }
    }
}









