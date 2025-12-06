package ProyectoFinal.ProyectoFinal_Ander.repository;

import ProyectoFinal.ProyectoFinal_Ander.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByProgramaEntrenamientoId(Long programaId);
    List<Reserva> findByEstado(String estado);
    List<Reserva> findByFechaReservaBetween(LocalDate inicio, LocalDate fin);
    
    @Query("SELECT DISTINCT r FROM Reserva r LEFT JOIN FETCH r.programaEntrenamiento WHERE r.cliente.id = :clienteId")
    List<Reserva> findByClienteId(@Param("clienteId") Long clienteId);
    
    @Query("SELECT r FROM Reserva r LEFT JOIN FETCH r.programaEntrenamiento WHERE r.cliente.id = :clienteId AND r.estado = :estado")
    List<Reserva> findByClienteIdAndEstado(@Param("clienteId") Long clienteId, @Param("estado") String estado);
    
    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.programaEntrenamiento.id = :programaId AND r.estado != 'CANCELADA'")
    Long countReservasActivasPorPrograma(@Param("programaId") Long programaId);
    
    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.fechaReserva BETWEEN :inicio AND :fin")
    Long countReservasPorPeriodo(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
    
    @Query("SELECT r.programaEntrenamiento.id, COUNT(r) as total FROM Reserva r WHERE r.estado != 'CANCELADA' GROUP BY r.programaEntrenamiento.id ORDER BY total DESC")
    List<Object[]> countReservasPorPrograma();
    
    @Query("SELECT DISTINCT r FROM Reserva r LEFT JOIN FETCH r.cliente LEFT JOIN FETCH r.programaEntrenamiento WHERE r.id = :id")
    java.util.Optional<Reserva> findByIdWithRelations(@Param("id") Long id);
}

