package ProyectoFinal.ProyectoFinal_Ander.repository;

import ProyectoFinal.ProyectoFinal_Ander.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByNombreContainingIgnoreCase(String nombre);
    List<Cliente> findByTipoCliente(String tipoCliente);
    List<Cliente> findByEmailContainingIgnoreCase(String email);
    List<Cliente> findByCiudad(String ciudad);
    
    @Query("SELECT c FROM Cliente c WHERE c.nombre LIKE CONCAT('%', :busqueda, '%') OR c.email LIKE CONCAT('%', :busqueda, '%') OR c.documentoIdentidad LIKE CONCAT('%', :busqueda, '%') OR c.telefono LIKE CONCAT('%', :busqueda, '%')")
    List<Cliente> buscarPorTexto(@Param("busqueda") String busqueda);
    
    List<Cliente> findByTelefonoContaining(String telefono);
    List<Cliente> findByDocumentoIdentidadContaining(String documento);
    
}

