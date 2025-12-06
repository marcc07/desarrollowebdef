package ProyectoFinal.ProyectoFinal_Ander.service;

import ProyectoFinal.ProyectoFinal_Ander.model.ProgramaEntrenamiento;
import ProyectoFinal.ProyectoFinal_Ander.repository.ProgramaEntrenamientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProgramaEntrenamientoService {
    
    @Autowired
    private ProgramaEntrenamientoRepository programaRepository;
    
    public List<ProgramaEntrenamiento> listarTodos() {
        return programaRepository.findAll();
    }
    
    public List<ProgramaEntrenamiento> listarActivos() {
        return programaRepository.findByActivoTrue();
    }
    
    public List<ProgramaEntrenamiento> listarConCupoDisponible() {
        return programaRepository.encontrarConCupoDisponible();
    }
    
    public Optional<ProgramaEntrenamiento> buscarPorId(Long id) {
        return programaRepository.findById(id);
    }
    
    public ProgramaEntrenamiento guardar(ProgramaEntrenamiento programa) {
        if (programa.getCupoDisponible() == null) {
            programa.setCupoDisponible(programa.getCupo());
        }
        return programaRepository.save(programa);
    }
    
    public void eliminar(Long id) {
        programaRepository.deleteById(id);
    }
    
    public List<ProgramaEntrenamiento> buscarPorInstructor(String instructor) {
        return programaRepository.findByInstructorContainingIgnoreCase(instructor);
    }
    
    public List<ProgramaEntrenamiento> buscarPorTexto(String busqueda) {
        return programaRepository.buscarPorTexto(busqueda);
    }
    
    public List<ProgramaEntrenamiento> buscarPorFecha(LocalDate inicio, LocalDate fin) {
        return programaRepository.findByFechaInicioBetween(inicio, fin);
    }
    
    public List<ProgramaEntrenamiento> buscarPorRangoCosto(java.math.BigDecimal costoMin, java.math.BigDecimal costoMax) {
        return programaRepository.buscarPorRangoCosto(costoMin, costoMax);
    }
    
    public List<ProgramaEntrenamiento> buscarConFiltros(String instructor, LocalDate fechaInicio, LocalDate fechaFin, java.math.BigDecimal costoMin, java.math.BigDecimal costoMax) {
        List<ProgramaEntrenamiento> programas = listarTodos();
        
        if (instructor != null && !instructor.isEmpty()) {
            programas = programas.stream()
                .filter(p -> p.getInstructor() != null && p.getInstructor().toLowerCase().contains(instructor.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        if (fechaInicio != null) {
            programas = programas.stream()
                .filter(p -> p.getFechaInicio() != null && !p.getFechaInicio().isBefore(fechaInicio))
                .collect(Collectors.toList());
        }
        
        if (fechaFin != null) {
            programas = programas.stream()
                .filter(p -> p.getFechaInicio() != null && !p.getFechaInicio().isAfter(fechaFin))
                .collect(Collectors.toList());
        }
        
        if (costoMin != null) {
            programas = programas.stream()
                .filter(p -> p.getCosto() != null && p.getCosto().compareTo(costoMin) >= 0)
                .collect(Collectors.toList());
        }
        
        if (costoMax != null) {
            programas = programas.stream()
                .filter(p -> p.getCosto() != null && p.getCosto().compareTo(costoMax) <= 0)
                .collect(Collectors.toList());
        }
        
        return programas;
    }
}

