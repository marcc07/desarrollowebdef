package ProyectoFinal.ProyectoFinal_Ander.config;

import ProyectoFinal.ProyectoFinal_Ander.model.Usuario;
import ProyectoFinal.ProyectoFinal_Ander.service.UsuarioService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UsuarioService usuarioService;
    
    public CustomUserDetailsService(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            var usuarioOpt = usuarioService.buscarPorUsername(username);
            if (usuarioOpt.isEmpty()) {
                throw new UsernameNotFoundException("Usuario no encontrado: " + username);
            }
            
            Usuario usuario = usuarioOpt.get();
            if (!usuario.isActivo()) {
                throw new UsernameNotFoundException("Usuario inactivo: " + username);
            }
            
            List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + usuario.getRol())
            );
            
            return new User(
                usuario.getUsername(),
                usuario.getPassword(),
                authorities
            );
        } catch (Exception e) {
            throw new UsernameNotFoundException("Error al cargar usuario: " + e.getMessage());
        }
    }
}

