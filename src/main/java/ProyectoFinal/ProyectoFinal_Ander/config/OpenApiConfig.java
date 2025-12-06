package ProyectoFinal.ProyectoFinal_Ander.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "ProyectoFinal API",
                version = "v1",
                description = "API REST para el Sistema de Gestión - ProyectoFinal",
                contact = @Contact(name = "ProyectoFinal Team", email = "")
        ),
        servers = {@Server(url = "/", description = "Local server")}
)
@Configuration
public class OpenApiConfig {

}
