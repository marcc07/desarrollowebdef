package ProyectoFinal.ProyectoFinal_Ander.service;

import ProyectoFinal.ProyectoFinal_Ander.model.Contratacion;
import ProyectoFinal.ProyectoFinal_Ander.model.Pago;
import ProyectoFinal.ProyectoFinal_Ander.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PagoService {
    
    @Autowired
    private PagoRepository pagoRepository;
    
    @Autowired
    private ContratacionService contratacionService;
    
    @Autowired
    private ClienteService clienteService;
    
    public List<Pago> listarTodos() {
        return pagoRepository.findAll();
    }
    
    public Optional<Pago> buscarPorId(Long id) {
        return pagoRepository.findById(id);
    }
    
    public Pago guardar(Pago pago) {
        // Asegurar que Cliente es una entidad gestionada
        if (pago.getCliente() != null) {
            if (pago.getCliente().getId() != null) {
                var clienteOpt = clienteService.buscarPorId(pago.getCliente().getId());
                if (clienteOpt.isPresent()) {
                    pago.setCliente(clienteOpt.get());
                } else {
                    // Si el cliente no existe, no se puede guardar el pago
                    throw new IllegalArgumentException("El cliente especificado no existe");
                }
            } else {
                // Si el cliente no tiene ID, es una instancia transitoria - no permitir
                throw new IllegalArgumentException("El cliente debe tener un ID válido");
            }
        } else {
            // Cliente es obligatorio según la validación
            throw new IllegalArgumentException("El cliente es obligatorio");
        }
        
        // Asegurar que Contratacion es una entidad gestionada
        if (pago.getContratacion() != null) {
            if (pago.getContratacion().getId() != null) {
                var contratacionOpt = contratacionService.buscarPorId(pago.getContratacion().getId());
                if (contratacionOpt.isPresent()) {
                    pago.setContratacion(contratacionOpt.get());
                } else {
                    // Si la contratación no existe, establecerla como null
                    pago.setContratacion(null);
                }
            } else {
                // Si la contratación no tiene ID, es una instancia transitoria - establecer como null
                pago.setContratacion(null);
            }
        }
        
        return pagoRepository.save(pago);
    }
    
    public void eliminar(Long id) {
        pagoRepository.deleteById(id);
    }
    
    public List<Pago> buscarPorCliente(Long clienteId) {
        return pagoRepository.findByClienteId(clienteId);
    }
    
    public List<Pago> buscarPorContratacion(Long contratacionId) {
        return pagoRepository.findByContratacionId(contratacionId);
    }
    
    public List<Pago> buscarPorEstado(String estado) {
        return pagoRepository.findByEstado(estado);
    }
    
    public List<Pago> buscarPorMedioPago(String medioPago) {
        return pagoRepository.findByMedioPago(medioPago);
    }
    
    public List<Pago> buscarPorFecha(LocalDate inicio, LocalDate fin) {
        return pagoRepository.findByFechaPagoBetween(inicio, fin);
    }
    
    public List<Pago> buscarPorClienteYEstado(Long clienteId, String estado) {
        return pagoRepository.findByClienteIdAndEstado(clienteId, estado);
    }
    
    public Double calcularIngresosPorPeriodo(LocalDate inicio, LocalDate fin) {
        Double resultado = pagoRepository.sumMontoPorPeriodo(inicio, fin);
        return resultado != null ? resultado : 0.0;
    }
    
    public Map<String, Object> reconciliarPagos(Long contratacionId) {
        Map<String, Object> resultado = new java.util.HashMap<>();
        
        var contratacion = contratacionService.buscarPorId(contratacionId);
        if (contratacion.isEmpty()) {
            resultado.put("error", "Contratación no encontrada");
            return resultado;
        }
        
        Contratacion c = contratacion.get();
        List<Pago> pagosCompletados = pagoRepository.findPagosCompletadosPorContratacion(contratacionId);
        
        java.math.BigDecimal montoTotalPagado = pagosCompletados.stream()
            .map(Pago::getMonto)
            .filter(m -> m != null)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        
        java.math.BigDecimal montoServicio = java.math.BigDecimal.ZERO;
        if (c.getServicioSeguridad() != null && c.getServicioSeguridad().getPrecio() != null) {
            montoServicio = c.getServicioSeguridad().getPrecio();
        }
        
        resultado.put("contratacionId", contratacionId);
        resultado.put("clienteNombre", c.getCliente() != null ? c.getCliente().getNombre() : "N/A");
        resultado.put("servicioNombre", c.getServicioSeguridad() != null ? c.getServicioSeguridad().getNombre() : "N/A");
        resultado.put("montoServicio", montoServicio);
        resultado.put("montoTotalPagado", montoTotalPagado);
        resultado.put("diferencia", montoServicio.subtract(montoTotalPagado));
        resultado.put("numeroPagos", pagosCompletados.size());
        resultado.put("pagos", pagosCompletados);
        resultado.put("estaReconciliado", montoTotalPagado.compareTo(montoServicio) >= 0);
        
        return resultado;
    }
    
    public List<Map<String, Object>> reconciliarTodosLosPagos() {
        List<Contratacion> contrataciones = contratacionService.listarTodos();
        List<Map<String, Object>> resultados = new java.util.ArrayList<>();
        
        for (Contratacion contratacion : contrataciones) {
            if ("CANCELADA".equals(contratacion.getEstado())) {
                continue;
            }
            if (contratacion.getServicioSeguridad() == null) {
                continue;
            }
            Map<String, Object> reconciliacion = reconciliarPagos(contratacion.getId());
            if (!reconciliacion.containsKey("error")) {
                resultados.add(reconciliacion);
            }
        }
        
        return resultados;
    }
    
    public List<Pago> buscarConFiltros(Long clienteId, Long contratacionId, String estado, String medioPago, LocalDate fechaInicio, LocalDate fechaFin, java.math.BigDecimal montoMin, java.math.BigDecimal montoMax) {
        List<Pago> pagos = listarTodos();
        
        if (clienteId != null) {
            pagos = pagos.stream()
                .filter(p -> p.getCliente() != null && clienteId.equals(p.getCliente().getId()))
                .collect(Collectors.toList());
        }
        
        if (contratacionId != null) {
            pagos = pagos.stream()
                .filter(p -> p.getContratacion() != null && contratacionId.equals(p.getContratacion().getId()))
                .collect(Collectors.toList());
        }
        
        if (estado != null && !estado.isEmpty()) {
            pagos = pagos.stream()
                .filter(p -> estado.equals(p.getEstado()))
                .collect(Collectors.toList());
        }
        
        if (medioPago != null && !medioPago.isEmpty()) {
            pagos = pagos.stream()
                .filter(p -> p.getMedioPago() != null && p.getMedioPago().equalsIgnoreCase(medioPago))
                .collect(Collectors.toList());
        }
        
        if (fechaInicio != null) {
            pagos = pagos.stream()
                .filter(p -> p.getFechaPago() != null && !p.getFechaPago().isBefore(fechaInicio))
                .collect(Collectors.toList());
        }
        
        if (fechaFin != null) {
            pagos = pagos.stream()
                .filter(p -> p.getFechaPago() != null && !p.getFechaPago().isAfter(fechaFin))
                .collect(Collectors.toList());
        }
        
        if (montoMin != null) {
            pagos = pagos.stream()
                .filter(p -> p.getMonto() != null && p.getMonto().compareTo(montoMin) >= 0)
                .collect(Collectors.toList());
        }
        
        if (montoMax != null) {
            pagos = pagos.stream()
                .filter(p -> p.getMonto() != null && p.getMonto().compareTo(montoMax) <= 0)
                .collect(Collectors.toList());
        }
        
        return pagos;
    }
}

