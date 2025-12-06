package ProyectoFinal.ProyectoFinal_Ander.service;

import ProyectoFinal.ProyectoFinal_Ander.model.Cliente;
import ProyectoFinal.ProyectoFinal_Ander.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }
    
    public Optional<Cliente> buscarPorId(Long id) {
        return clienteRepository.findById(id);
    }
    
    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
    
    public void eliminar(Long id) {
        clienteRepository.deleteById(id);
    }
    
    public List<Cliente> buscarPorNombre(String nombre) {
        return clienteRepository.findByNombreContainingIgnoreCase(nombre);
    }
    
    public List<Cliente> buscarPorTipo(String tipo) {
        return clienteRepository.findByTipoCliente(tipo);
    }
    
    public List<Cliente> buscarPorTexto(String busqueda) {
        return clienteRepository.buscarPorTexto(busqueda);
    }
    
    public List<Cliente> buscarPorTelefono(String telefono) {
        return clienteRepository.findByTelefonoContaining(telefono);
    }
    
    public List<Cliente> buscarPorDocumento(String documento) {
        return clienteRepository.findByDocumentoIdentidadContaining(documento);
    }
    
    public List<Cliente> buscarConFiltros(String tipoCliente, String ciudad, String email, String telefono, String documento) {
        List<Cliente> clientes = listarTodos();
        
        if (tipoCliente != null && !tipoCliente.isEmpty()) {
            clientes = clientes.stream()
                .filter(c -> tipoCliente.equals(c.getTipoCliente()))
                .collect(Collectors.toList());
        }
        
        if (ciudad != null && !ciudad.isEmpty()) {
            clientes = clientes.stream()
                .filter(c -> c.getCiudad() != null && c.getCiudad().equalsIgnoreCase(ciudad))
                .collect(Collectors.toList());
        }
        
        if (email != null && !email.isEmpty()) {
            clientes = clientes.stream()
                .filter(c -> c.getEmail() != null && c.getEmail().toLowerCase().contains(email.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        if (telefono != null && !telefono.isEmpty()) {
            clientes = clientes.stream()
                .filter(c -> c.getTelefono() != null && c.getTelefono().contains(telefono))
                .collect(Collectors.toList());
        }
        
        if (documento != null && !documento.isEmpty()) {
            clientes = clientes.stream()
                .filter(c -> c.getDocumentoIdentidad() != null && c.getDocumentoIdentidad().contains(documento))
                .collect(Collectors.toList());
        }
        
        return clientes;
    }
}

