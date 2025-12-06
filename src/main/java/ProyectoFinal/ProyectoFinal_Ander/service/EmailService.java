package ProyectoFinal.ProyectoFinal_Ander.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void enviarEmail(String para, String asunto, String mensaje) {
        try {
            logger.info("Intentando enviar email desde: {} hacia: {}", fromEmail, para);
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(fromEmail);
            email.setTo(para);
            email.setSubject(asunto);
            email.setText(mensaje);
            mailSender.send(email);
            logger.info("Email enviado exitosamente a: {}", para);
        } catch (Exception e) {
            logger.error("Error al enviar email a: {}. Error: {}", para, e.getMessage(), e);
            throw new RuntimeException("No se pudo enviar el email: " + e.getMessage(), e);
        }
    }
    
    public void enviarConfirmacionReserva(String emailCliente, String nombreCliente, 
                                         String nombrePrograma, String fechaInicio) {
        String asunto = "Confirmación de Reserva - Programa de Entrenamiento";
        String mensaje = String.format(
            "Estimado/a %s,\n\n" +
            "Su reserva para el programa de entrenamiento '%s' ha sido confirmada.\n\n" +
            "Detalles de la reserva:\n" +
            "- Programa: %s\n" +
            "- Fecha de inicio: %s\n\n" +
            "Gracias por confiar en nuestros servicios.\n\n" +
            "Saludos,\n" +
            "Sistema de Seguridad y Entrenamiento",
            nombreCliente, nombrePrograma, nombrePrograma, fechaInicio
        );
        enviarEmail(emailCliente, asunto, mensaje);
    }
    
    public void enviarConfirmacionContratacion(String emailCliente, String nombreCliente,
                                               String nombreServicio, String fechaInicio, String fechaFin) {
        String asunto = "Confirmación de Contratación - Servicio de Seguridad";
        String mensaje = String.format(
            "Estimado/a %s,\n\n" +
            "Su contratación del servicio de seguridad '%s' ha sido confirmada.\n\n" +
            "Detalles de la contratación:\n" +
            "- Servicio: %s\n" +
            "- Fecha de inicio: %s\n" +
            "- Fecha de fin: %s\n\n" +
            "Gracias por confiar en nuestros servicios.\n\n" +
            "Saludos,\n" +
            "Sistema de Seguridad y Entrenamiento",
            nombreCliente, nombreServicio, nombreServicio, fechaInicio, fechaFin
        );
        enviarEmail(emailCliente, asunto, mensaje);
    }
}

