package ProyectoFinal.ProyectoFinal_Ander.config;

import ProyectoFinal.ProyectoFinal_Ander.model.Usuario;
import ProyectoFinal.ProyectoFinal_Ander.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final UsuarioService usuarioService;
    
    public DataInitializer(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }
    
    @Override
    public void run(String... args) {
        try {
            if (!usuarioService.existeUsername("admin")) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword("admin123");
                admin.setNombreCompleto("Administrador");
                admin.setEmail("admin@seguridad.com");
                admin.setRol("ADMIN");
                admin.setActivo(true);
                usuarioService.guardar(admin);
                System.out.println("Usuario administrador creado: admin / admin123");
            }
        } catch (Exception e) {
            System.err.println("Error al inicializar datos: " + e.getMessage());
        }
    }
}

