package ProyectoFinal.ProyectoFinal_Ander.controller.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Index", description = "Información general y endpoints")
public class IndexRestController {
    
    @GetMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Index", description = "Información general de la API y endpoints disponibles")
    public ResponseEntity<Map<String, Object>> index() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "API REST - Sistema de Seguridad y Entrenamiento");
        response.put("version", "1.0.0");
        response.put("status", "running");
        response.put("endpoints", Map.of(
            "auth", "/api/auth",
            "clientes", "/api/clientes",
            "servicios", "/api/servicios",
            "programas", "/api/programas",
            "contrataciones", "/api/contrataciones",
            "reservas", "/api/reservas",
            "pagos", "/api/pagos",
            "informes", "/api/informes"
        ));
        return ResponseEntity.ok(response);
    }
}






