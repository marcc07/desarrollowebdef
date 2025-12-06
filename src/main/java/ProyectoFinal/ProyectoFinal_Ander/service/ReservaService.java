package ProyectoFinal.ProyectoFinal_Ander.service;

import ProyectoFinal.ProyectoFinal_Ander.model.Reserva;
import ProyectoFinal.ProyectoFinal_Ander.repository.ReservaRepository;
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
public class ReservaService {
    
    private static final Logger logger = LoggerFactory.getLogger(ReservaService.class);
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private ProgramaEntrenamientoService programaService;
    
    @Autowired
    private EmailService emailService;
    
    public List<Reserva> listarTodos() {
        return reservaRepository.findAll();
    }
    
    public Optional<Reserva> buscarPorId(Long id) {
        return reservaRepository.findById(id);
    }
    
    public Reserva guardar(Reserva reserva) {
        boolean confirmacionYaEnviada = false;
        if (reserva.getId() != null) {
            var reservaExistente = reservaRepository.findById(reserva.getId());
            if (reservaExistente.isPresent()) {
                confirmacionYaEnviada = reservaExistente.get().isConfirmacionEnviada();
            }
        }
        
        boolean esNuevaConfirmacion = reserva.getId() == null && ("CONFIRMADA".equals(reserva.getEstado()) || "ACTIVA".equals(reserva.getEstado()));
        boolean cambioAConfirmada = reserva.getId() != null && ("CONFIRMADA".equals(reserva.getEstado()) || "ACTIVA".equals(reserva.getEstado())) 
            && !confirmacionYaEnviada;
        
        if (esNuevaConfirmacion || cambioAConfirmada) {
            var programa = reserva.getProgramaEntrenamiento();
            if (programa != null && programa.getCupoDisponible() != null && programa.getCupoDisponible() > 0) {
                programa.setCupoDisponible(programa.getCupoDisponible() - 1);
                programaService.guardar(programa);
            }
        }
        
        Reserva reservaGuardada = reservaRepository.save(reserva);
        
        if ((esNuevaConfirmacion || cambioAConfirmada)) {
            // Recargar la reserva con sus relaciones para evitar LazyInitializationException
            Optional<Reserva> reservaConRelaciones = reservaRepository.findByIdWithRelations(reservaGuardada.getId());
            
            if (reservaConRelaciones.isPresent()) {
                Reserva r = reservaConRelaciones.get();
                
                if (r.getCliente() != null && r.getCliente().getEmail() != null 
                    && r.getProgramaEntrenamiento() != null && r.getProgramaEntrenamiento().getNombre() != null) {
                    try {
                        logger.info("Enviando email de confirmación de reserva a: {}", r.getCliente().getEmail());
                        emailService.enviarConfirmacionReserva(
                            r.getCliente().getEmail(),
                            r.getCliente().getNombre(),
                            r.getProgramaEntrenamiento().getNombre(),
                            r.getProgramaEntrenamiento().getFechaInicio() != null 
                                ? r.getProgramaEntrenamiento().getFechaInicio().toString() 
                                : "Por confirmar"
                        );
                        r.setConfirmacionEnviada(true);
                        reservaRepository.save(r);
                        logger.info("Email de confirmación enviado exitosamente a: {}", r.getCliente().getEmail());
                    } catch (Exception e) {
                        logger.error("ERROR al enviar email de reserva a: {}. Error: {}", 
                            r.getCliente().getEmail(), e.getMessage(), e);
                        // No relanzamos la excepción para que la reserva se guarde igual
                    }
                } else {
                    logger.warn("No se puede enviar email: cliente o programa no disponible. Cliente: {}, Programa: {}", 
                        r.getCliente() != null ? r.getCliente().getEmail() : "null",
                        r.getProgramaEntrenamiento() != null ? r.getProgramaEntrenamiento().getNombre() : "null");
                }
            } else {
                logger.warn("No se pudo recargar la reserva con relaciones para ID: {}", reservaGuardada.getId());
            }
        }
        
        return reservaGuardada;
    }
    
    public void eliminar(Long id) {
        reservaRepository.deleteById(id);
    }
    
    public List<Reserva> buscarPorCliente(Long clienteId) {
        return reservaRepository.findByClienteId(clienteId);
    }
    
    public List<Reserva> buscarPorPrograma(Long programaId) {
        return reservaRepository.findByProgramaEntrenamientoId(programaId);
    }
    
    public List<Reserva> buscarPorEstado(String estado) {
        return reservaRepository.findByEstado(estado);
    }
    
    public List<Reserva> buscarPorClienteYEstado(Long clienteId, String estado) {
        return reservaRepository.findByClienteIdAndEstado(clienteId, estado);
    }
    
    public List<Reserva> buscarPorFecha(LocalDate inicio, LocalDate fin) {
        return reservaRepository.findByFechaReservaBetween(inicio, fin);
    }
    
    public Reserva cancelar(Long id) {
        var reserva = reservaRepository.findById(id);
        if (reserva.isPresent()) {
            Reserva r = reserva.get();
            String estadoAnterior = r.getEstado();
            r.setEstado("CANCELADA");
            
            if (("CONFIRMADA".equals(estadoAnterior) || "ACTIVA".equals(estadoAnterior)) 
                && r.getProgramaEntrenamiento() != null 
                && r.getProgramaEntrenamiento().getCupoDisponible() != null) {
                var programa = r.getProgramaEntrenamiento();
                programa.setCupoDisponible(programa.getCupoDisponible() + 1);
                programaService.guardar(programa);
            }
            
            return reservaRepository.save(r);
        }
        return null;
    }
    
    public List<Reserva> buscarConFiltros(Long clienteId, Long programaId, String estado, LocalDate fechaInicio, LocalDate fechaFin) {
        List<Reserva> reservas = listarTodos();
        
        if (clienteId != null) {
            reservas = reservas.stream()
                .filter(r -> r.getCliente() != null && clienteId.equals(r.getCliente().getId()))
                .collect(Collectors.toList());
        }
        
        if (programaId != null) {
            reservas = reservas.stream()
                .filter(r -> r.getProgramaEntrenamiento() != null && programaId.equals(r.getProgramaEntrenamiento().getId()))
                .collect(Collectors.toList());
        }
        
        if (estado != null && !estado.isEmpty()) {
            reservas = reservas.stream()
                .filter(r -> estado.equals(r.getEstado()))
                .collect(Collectors.toList());
        }
        
        if (fechaInicio != null) {
            reservas = reservas.stream()
                .filter(r -> r.getFechaReserva() != null && !r.getFechaReserva().isBefore(fechaInicio))
                .collect(Collectors.toList());
        }
        
        if (fechaFin != null) {
            reservas = reservas.stream()
                .filter(r -> r.getFechaReserva() != null && !r.getFechaReserva().isAfter(fechaFin))
                .collect(Collectors.toList());
        }
        
        return reservas;
    }
}

