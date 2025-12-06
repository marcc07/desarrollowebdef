package ProyectoFinal.ProyectoFinal_Ander.service;

import ProyectoFinal.ProyectoFinal_Ander.model.ServicioSeguridad;
import ProyectoFinal.ProyectoFinal_Ander.repository.ServicioSeguridadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServicioSeguridadService {
    
    @Autowired
    private ServicioSeguridadRepository servicioRepository;
    
    public List<ServicioSeguridad> listarTodos() {
        return servicioRepository.findAll();
    }
    
    public List<ServicioSeguridad> listarActivos() {
        return servicioRepository.findByActivoTrue();
    }
    
    public Optional<ServicioSeguridad> buscarPorId(Long id) {
        return servicioRepository.findById(id);
    }
    
    public ServicioSeguridad guardar(ServicioSeguridad servicio) {
        return servicioRepository.save(servicio);
    }
    
    public void eliminar(Long id) {
        servicioRepository.deleteById(id);
    }
    
    public List<ServicioSeguridad> buscarPorTipo(String tipo) {
        return servicioRepository.findByTipo(tipo);
    }
    
    public List<ServicioSeguridad> buscarPorUbicacion(String ubicacion) {
        return servicioRepository.findByUbicacionContainingIgnoreCase(ubicacion);
    }
    
    public List<ServicioSeguridad> buscarPorRangoPrecio(BigDecimal precioMin, BigDecimal precioMax) {
        return servicioRepository.buscarPorRangoPrecio(precioMin, precioMax);
    }
    
    public List<ServicioSeguridad> buscarPorTexto(String busqueda) {
        return servicioRepository.buscarPorTexto(busqueda);
    }
    
    public List<ServicioSeguridad> buscarPorDuracion(String duracion) {
        return servicioRepository.findByDuracionContainingIgnoreCase(duracion);
    }
    
    public List<ServicioSeguridad> buscarConFiltros(String tipo, String ubicacion, String duracion, BigDecimal precioMin, BigDecimal precioMax) {
        List<ServicioSeguridad> servicios = listarTodos();
        
        if (tipo != null && !tipo.isEmpty()) {
            servicios = servicios.stream()
                .filter(s -> tipo.equals(s.getTipo()))
                .collect(Collectors.toList());
        }
        
        if (ubicacion != null && !ubicacion.isEmpty()) {
            servicios = servicios.stream()
                .filter(s -> s.getUbicacion() != null && s.getUbicacion().toLowerCase().contains(ubicacion.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        if (duracion != null && !duracion.isEmpty()) {
            servicios = servicios.stream()
                .filter(s -> s.getDuracion() != null && s.getDuracion().toLowerCase().contains(duracion.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        if (precioMin != null) {
            servicios = servicios.stream()
                .filter(s -> s.getPrecio() != null && s.getPrecio().compareTo(precioMin) >= 0)
                .collect(Collectors.toList());
        }
        
        if (precioMax != null) {
            servicios = servicios.stream()
                .filter(s -> s.getPrecio() != null && s.getPrecio().compareTo(precioMax) <= 0)
                .collect(Collectors.toList());
        }
        
        return servicios;
    }
}

