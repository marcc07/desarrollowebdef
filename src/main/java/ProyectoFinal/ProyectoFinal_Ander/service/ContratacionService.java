package ProyectoFinal.ProyectoFinal_Ander.service;

import ProyectoFinal.ProyectoFinal_Ander.model.Contratacion;
import ProyectoFinal.ProyectoFinal_Ander.repository.ContratacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContratacionService {
    
    private static final Logger logger = LoggerFactory.getLogger(ContratacionService.class);
    
    @Autowired
    private ContratacionRepository contratacionRepository;
    
    @Autowired
    private EmailService emailService;
    
    public List<Contratacion> listarTodos() {
        return contratacionRepository.findAll();
    }
    
    public Optional<Contratacion> buscarPorId(Long id) {
        return contratacionRepository.findById(id);
    }
    
    public Contratacion guardar(Contratacion contratacion) {
        boolean confirmacionYaEnviada = false;
        if (contratacion.getId() != null) {
            var contratacionExistente = contratacionRepository.findById(contratacion.getId());
            if (contratacionExistente.isPresent()) {
                confirmacionYaEnviada = contratacionExistente.get().isConfirmacionEnviada();
            }
        }
        
        boolean esNuevaConfirmacion = contratacion.getId() == null && ("ACTIVA".equals(contratacion.getEstado()) || "CONFIRMADA".equals(contratacion.getEstado()));
        boolean cambioAConfirmada = contratacion.getId() != null && ("ACTIVA".equals(contratacion.getEstado()) || "CONFIRMADA".equals(contratacion.getEstado()))
            && !confirmacionYaEnviada;
        
        Contratacion contratacionGuardada = contratacionRepository.save(contratacion);
        
        if ((esNuevaConfirmacion || cambioAConfirmada)) {
            // Recargar la contratación con sus relaciones para evitar LazyInitializationException
            Optional<Contratacion> contratacionConRelaciones = contratacionRepository.findByIdWithRelations(contratacionGuardada.getId());
            
            if (contratacionConRelaciones.isPresent()) {
                Contratacion c = contratacionConRelaciones.get();
                
                if (c.getCliente() != null && c.getCliente().getEmail() != null 
                    && c.getServicioSeguridad() != null && c.getServicioSeguridad().getNombre() != null) {
                    try {
                        logger.info("Enviando email de confirmación de contratación a: {}", c.getCliente().getEmail());
                        emailService.enviarConfirmacionContratacion(
                            c.getCliente().getEmail(),
                            c.getCliente().getNombre(),
                            c.getServicioSeguridad().getNombre(),
                            c.getFechaInicio() != null 
                                ? c.getFechaInicio().toString() 
                                : "Por confirmar",
                            c.getFechaFin() != null 
                                ? c.getFechaFin().toString() 
                                : "Por confirmar"
                        );
                        c.setConfirmacionEnviada(true);
                        contratacionRepository.save(c);
                        logger.info("Email de confirmación enviado exitosamente a: {}", c.getCliente().getEmail());
                    } catch (Exception e) {
                        logger.error("ERROR al enviar email de contratación a: {}. Error: {}", 
                            c.getCliente().getEmail(), e.getMessage(), e);
                        // No relanzamos la excepción para que la contratación se guarde igual
                    }
                } else {
                    logger.warn("No se puede enviar email: cliente o servicio no disponible. Cliente: {}, Servicio: {}", 
                        c.getCliente() != null ? c.getCliente().getEmail() : "null",
                        c.getServicioSeguridad() != null ? c.getServicioSeguridad().getNombre() : "null");
                }
            } else {
                logger.warn("No se pudo recargar la contratación con relaciones para ID: {}", contratacionGuardada.getId());
            }
        }
        
        return contratacionGuardada;
    }
    
    public void eliminar(Long id) {
        contratacionRepository.deleteById(id);
    }
    
    public List<Contratacion> buscarPorCliente(Long clienteId) {
        return contratacionRepository.findByClienteId(clienteId);
    }
    
    public List<Contratacion> buscarPorServicio(Long servicioId) {
        return contratacionRepository.findByServicioSeguridadId(servicioId);
    }
    
    public List<Contratacion> buscarPorEstado(String estado) {
        return contratacionRepository.findByEstado(estado);
    }
    
    public List<Contratacion> buscarPorClienteYEstado(Long clienteId, String estado) {
        return contratacionRepository.findByClienteIdAndEstado(clienteId, estado);
    }
    
    public List<Contratacion> buscarPorFecha(LocalDate inicio, LocalDate fin) {
        return contratacionRepository.findByFechaContratacionBetween(inicio, fin);
    }
    
    public Contratacion cancelar(Long id) {
        var contratacion = contratacionRepository.findById(id);
        if (contratacion.isPresent()) {
            Contratacion c = contratacion.get();
            c.setEstado("CANCELADA");
            return contratacionRepository.save(c);
        }
        return null;
    }
    
    public List<Contratacion> buscarConFiltros(Long clienteId, Long servicioId, String estado, LocalDate fechaInicio, LocalDate fechaFin) {
        List<Contratacion> contrataciones = listarTodos();
        
        if (clienteId != null) {
            contrataciones = contrataciones.stream()
                .filter(c -> c.getCliente() != null && clienteId.equals(c.getCliente().getId()))
                .collect(Collectors.toList());
        }
        
        if (servicioId != null) {
            contrataciones = contrataciones.stream()
                .filter(c -> c.getServicioSeguridad() != null && servicioId.equals(c.getServicioSeguridad().getId()))
                .collect(Collectors.toList());
        }
        
        if (estado != null && !estado.isEmpty()) {
            contrataciones = contrataciones.stream()
                .filter(c -> estado.equals(c.getEstado()))
                .collect(Collectors.toList());
        }
        
        if (fechaInicio != null) {
            contrataciones = contrataciones.stream()
                .filter(c -> c.getFechaContratacion() != null && !c.getFechaContratacion().isBefore(fechaInicio))
                .collect(Collectors.toList());
        }
        
        if (fechaFin != null) {
            contrataciones = contrataciones.stream()
                .filter(c -> c.getFechaContratacion() != null && !c.getFechaContratacion().isAfter(fechaFin))
                .collect(Collectors.toList());
        }
        
        return contrataciones;
    }
}

