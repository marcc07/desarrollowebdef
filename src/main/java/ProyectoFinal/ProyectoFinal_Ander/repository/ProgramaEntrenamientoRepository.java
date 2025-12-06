package ProyectoFinal.ProyectoFinal_Ander.repository;

import ProyectoFinal.ProyectoFinal_Ander.model.ProgramaEntrenamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProgramaEntrenamientoRepository extends JpaRepository<ProgramaEntrenamiento, Long> {
    List<ProgramaEntrenamiento> findByInstructor(String instructor);
    List<ProgramaEntrenamiento> findByActivoTrue();
    List<ProgramaEntrenamiento> findByFechaInicioBetween(LocalDate inicio, LocalDate fin);
    
    @Query("SELECT p FROM ProgramaEntrenamiento p WHERE p.nombre LIKE CONCAT('%', :busqueda, '%') OR p.instructor LIKE CONCAT('%', :busqueda, '%') OR p.contenido LIKE CONCAT('%', :busqueda, '%')")
    List<ProgramaEntrenamiento> buscarPorTexto(@Param("busqueda") String busqueda);
    
    @Query("SELECT p FROM ProgramaEntrenamiento p WHERE p.cupoDisponible > 0 AND p.activo = true")
    List<ProgramaEntrenamiento> encontrarConCupoDisponible();
    
    @Query("SELECT p FROM ProgramaEntrenamiento p WHERE p.costo >= :costoMin AND p.costo <= :costoMax")
    List<ProgramaEntrenamiento> buscarPorRangoCosto(@Param("costoMin") java.math.BigDecimal costoMin, @Param("costoMax") java.math.BigDecimal costoMax);
    
    List<ProgramaEntrenamiento> findByInstructorContainingIgnoreCase(String instructor);
}

