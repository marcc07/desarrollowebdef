package ProyectoFinal.ProyectoFinal_Ander.service;

import ProyectoFinal.ProyectoFinal_Ander.model.*;
import ProyectoFinal.ProyectoFinal_Ander.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class InformeService {
    
    @Autowired
    private ContratacionRepository contratacionRepository;
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private PagoRepository pagoRepository;
    
    @Autowired
    private ServicioSeguridadRepository servicioRepository;
    
    @Autowired
    private ProgramaEntrenamientoRepository programaRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    public Map<String, Object> generarInformeIngresos(LocalDate inicio, LocalDate fin) {
        Map<String, Object> informe = new HashMap<>();
        
        Double ingresosTotales = pagoRepository.sumMontoPorPeriodo(inicio, fin);
        informe.put("ingresosTotales", ingresosTotales != null ? ingresosTotales : 0.0);
        informe.put("fechaInicio", inicio);
        informe.put("fechaFin", fin);
        
        List<Pago> pagos = pagoRepository.findByFechaPagoBetween(inicio, fin);
        Map<String, Double> ingresosPorMedio = pagos.stream()
            .filter(p -> "COMPLETADO".equals(p.getEstado()) && p.getMedioPago() != null && p.getMonto() != null)
            .collect(Collectors.groupingBy(
                p -> p.getMedioPago() != null ? p.getMedioPago() : "SIN_ESPECIFICAR",
                Collectors.summingDouble(p -> p.getMonto().doubleValue())
            ));
        informe.put("ingresosPorMedio", ingresosPorMedio);
        
        List<ServicioSeguridad> servicios = servicioRepository.findAll();
        Map<String, Double> ingresosPorServicio = new java.util.LinkedHashMap<>();
        for (ServicioSeguridad servicio : servicios) {
            Double ingresos = pagoRepository.sumMontoPorServicioYPeriodo(servicio.getId(), inicio, fin);
            if (ingresos != null && ingresos > 0) {
                ingresosPorServicio.put(servicio.getNombre(), ingresos);
            }
        }
        informe.put("ingresosPorServicio", ingresosPorServicio);
        
        Map<String, Double> ingresosPorTipoCliente = new java.util.LinkedHashMap<>();
        Double ingresosPersonas = pagoRepository.sumMontoPorTipoClienteYPeriodo("PERSONA", inicio, fin);
        Double ingresosEmpresas = pagoRepository.sumMontoPorTipoClienteYPeriodo("EMPRESA", inicio, fin);
        if (ingresosPersonas != null && ingresosPersonas > 0) {
            ingresosPorTipoCliente.put("PERSONA", ingresosPersonas);
        }
        if (ingresosEmpresas != null && ingresosEmpresas > 0) {
            ingresosPorTipoCliente.put("EMPRESA", ingresosEmpresas);
        }
        informe.put("ingresosPorTipoCliente", ingresosPorTipoCliente);
        
        return informe;
    }
    
    public Map<String, Object> generarInformeServicios() {
        Map<String, Object> informe = new HashMap<>();
        
        List<Object[]> resultados = contratacionRepository.countContratacionesPorServicio();
        Map<String, Long> serviciosMasSolicitados = new java.util.LinkedHashMap<>();
        
        for (Object[] resultado : resultados) {
            Long servicioId = ((Number) resultado[0]).longValue();
            Long count = ((Number) resultado[1]).longValue();
            ServicioSeguridad servicio = servicioRepository.findById(servicioId).orElse(null);
            if (servicio != null) {
                serviciosMasSolicitados.put(servicio.getNombre(), count);
            }
        }
        
        informe.put("serviciosMasSolicitados", serviciosMasSolicitados);
        
        return informe;
    }
    
    public Map<String, Object> generarInformeCursos() {
        Map<String, Object> informe = new HashMap<>();
        
        List<Object[]> resultados = reservaRepository.countReservasPorPrograma();
        Map<String, Long> cursosMasInscritos = new java.util.LinkedHashMap<>();
        
        for (Object[] resultado : resultados) {
            Long programaId = ((Number) resultado[0]).longValue();
            Long count = ((Number) resultado[1]).longValue();
            ProgramaEntrenamiento programa = programaRepository.findById(programaId).orElse(null);
            if (programa != null) {
                cursosMasInscritos.put(programa.getNombre(), count);
            }
        }
        
        informe.put("cursosMasInscritos", cursosMasInscritos);
        
        return informe;
    }
    
    public Map<String, Object> generarEstadisticasGenerales() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalClientes", clienteRepository.count());
        stats.put("totalServicios", servicioRepository.count());
        stats.put("totalProgramas", programaRepository.count());
        stats.put("totalContrataciones", contratacionRepository.count());
        stats.put("totalReservas", reservaRepository.count());
        
        LocalDate inicioMes = LocalDate.now().withDayOfMonth(1);
        LocalDate finMes = LocalDate.now();
        stats.put("contratacionesEsteMes", contratacionRepository.countContratacionesPorPeriodo(inicioMes, finMes));
        stats.put("reservasEsteMes", reservaRepository.countReservasPorPeriodo(inicioMes, finMes));
        
        List<Pago> pagosCompletados = pagoRepository.findByEstado("COMPLETADO");
        Double ingresosTotales = pagosCompletados.stream()
            .filter(p -> p.getMonto() != null)
            .mapToDouble(p -> p.getMonto().doubleValue())
            .sum();
        stats.put("ingresosTotales", ingresosTotales);
        
        return stats;
    }
    
    public Map<String, Object> generarFrecuenciaContrataciones(LocalDate inicio, LocalDate fin) {
        Map<String, Object> informe = new HashMap<>();
        
        Long totalContrataciones = contratacionRepository.countContratacionesPorPeriodo(inicio, fin);
        informe.put("totalContrataciones", totalContrataciones);
        informe.put("fechaInicio", inicio);
        informe.put("fechaFin", fin);
        
        List<Contratacion> contrataciones = contratacionRepository.findByFechaContratacionBetween(inicio, fin);
        Map<String, Long> contratacionesPorEstado = contrataciones.stream()
            .collect(Collectors.groupingBy(
                c -> c.getEstado() != null ? c.getEstado() : "SIN_ESTADO",
                Collectors.counting()
            ));
        informe.put("contratacionesPorEstado", contratacionesPorEstado);
        
        Map<String, Long> frecuenciaPorMes = new java.util.LinkedHashMap<>();
        LocalDate fecha = inicio.withDayOfMonth(1);
        
        String[] meses = {"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                         "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"};
        
        while (!fecha.isAfter(fin)) {
            LocalDate inicioMes = fecha.withDayOfMonth(1);
            LocalDate finMes = fecha.withDayOfMonth(fecha.lengthOfMonth());
            if (finMes.isAfter(fin)) {
                finMes = fin;
            }
            Long count = contratacionRepository.countContratacionesPorPeriodo(inicioMes, finMes);
            String mesNombre = meses[fecha.getMonthValue() - 1] + " " + fecha.getYear();
            frecuenciaPorMes.put(mesNombre, count);
            fecha = fecha.plusMonths(1);
            if (fecha.isAfter(fin)) {
                break;
            }
        }
        informe.put("frecuenciaPorMes", frecuenciaPorMes);
        
        return informe;
    }
}

