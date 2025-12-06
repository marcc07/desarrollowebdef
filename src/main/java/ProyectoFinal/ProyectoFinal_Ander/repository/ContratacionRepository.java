package ProyectoFinal.ProyectoFinal_Ander.repository;

import ProyectoFinal.ProyectoFinal_Ander.model.Contratacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ContratacionRepository extends JpaRepository<Contratacion, Long> {
    List<Contratacion> findByServicioSeguridadId(Long servicioId);
    List<Contratacion> findByEstado(String estado);
    List<Contratacion> findByFechaContratacionBetween(LocalDate inicio, LocalDate fin);
    
    @Query("SELECT DISTINCT c FROM Contratacion c LEFT JOIN FETCH c.servicioSeguridad WHERE c.cliente.id = :clienteId")
    List<Contratacion> findByClienteId(@Param("clienteId") Long clienteId);
    
    @Query("SELECT c FROM Contratacion c LEFT JOIN FETCH c.servicioSeguridad WHERE c.cliente.id = :clienteId AND c.estado = :estado")
    List<Contratacion> findByClienteIdAndEstado(@Param("clienteId") Long clienteId, @Param("estado") String estado);
    
    @Query("SELECT COUNT(c) FROM Contratacion c WHERE c.fechaContratacion BETWEEN :inicio AND :fin")
    Long countContratacionesPorPeriodo(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
    
    @Query("SELECT c.servicioSeguridad.id, COUNT(c) as total FROM Contratacion c GROUP BY c.servicioSeguridad.id ORDER BY total DESC")
    List<Object[]> countContratacionesPorServicio();
    
    @Query("SELECT DISTINCT c FROM Contratacion c LEFT JOIN FETCH c.cliente LEFT JOIN FETCH c.servicioSeguridad WHERE c.id = :id")
    java.util.Optional<Contratacion> findByIdWithRelations(@Param("id") Long id);
}

