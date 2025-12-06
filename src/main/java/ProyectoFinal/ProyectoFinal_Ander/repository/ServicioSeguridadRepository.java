package ProyectoFinal.ProyectoFinal_Ander.repository;

import ProyectoFinal.ProyectoFinal_Ander.model.ServicioSeguridad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ServicioSeguridadRepository extends JpaRepository<ServicioSeguridad, Long> {
    List<ServicioSeguridad> findByTipo(String tipo);
    List<ServicioSeguridad> findByUbicacionContainingIgnoreCase(String ubicacion);
    List<ServicioSeguridad> findByActivoTrue();
    
    @Query("SELECT s FROM ServicioSeguridad s WHERE s.precio >= :precioMin AND s.precio <= :precioMax")
    List<ServicioSeguridad> buscarPorRangoPrecio(@Param("precioMin") BigDecimal precioMin, @Param("precioMax") BigDecimal precioMax);
    
    @Query("SELECT s FROM ServicioSeguridad s WHERE s.nombre LIKE CONCAT('%', :busqueda, '%') OR s.tipo LIKE CONCAT('%', :busqueda, '%') OR s.ubicacion LIKE CONCAT('%', :busqueda, '%') OR s.descripcion LIKE CONCAT('%', :busqueda, '%')")
    List<ServicioSeguridad> buscarPorTexto(@Param("busqueda") String busqueda);
    
    List<ServicioSeguridad> findByDuracionContainingIgnoreCase(String duracion);
}

