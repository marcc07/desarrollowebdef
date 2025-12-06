package ProyectoFinal.ProyectoFinal_Ander.repository;

import ProyectoFinal.ProyectoFinal_Ander.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByClienteId(Long clienteId);
    List<Pago> findByContratacionId(Long contratacionId);
    List<Pago> findByEstado(String estado);
    List<Pago> findByFechaPagoBetween(LocalDate inicio, LocalDate fin);
    List<Pago> findByMedioPago(String medioPago);
    
    @Query("SELECT p FROM Pago p WHERE p.cliente.id = :clienteId AND p.estado = :estado")
    List<Pago> findByClienteIdAndEstado(@Param("clienteId") Long clienteId, @Param("estado") String estado);
    
    @Query("SELECT SUM(p.monto) FROM Pago p WHERE p.estado = 'COMPLETADO' AND p.fechaPago BETWEEN :inicio AND :fin")
    Double sumMontoPorPeriodo(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
    
    @Query("SELECT SUM(p.monto) FROM Pago p JOIN p.contratacion c JOIN c.servicioSeguridad s WHERE p.estado = 'COMPLETADO' AND s.id = :servicioId AND p.fechaPago BETWEEN :inicio AND :fin")
    Double sumMontoPorServicioYPeriodo(@Param("servicioId") Long servicioId, @Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
    
    @Query("SELECT SUM(p.monto) FROM Pago p JOIN p.cliente c WHERE p.estado = 'COMPLETADO' AND c.tipoCliente = :tipoCliente AND p.fechaPago BETWEEN :inicio AND :fin")
    Double sumMontoPorTipoClienteYPeriodo(@Param("tipoCliente") String tipoCliente, @Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
    
    @Query("SELECT p FROM Pago p WHERE p.contratacion.id = :contratacionId AND p.estado = 'COMPLETADO'")
    List<Pago> findPagosCompletadosPorContratacion(@Param("contratacionId") Long contratacionId);
}

