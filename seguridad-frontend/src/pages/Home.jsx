import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { initTheme, toggleTheme, getTheme } from '../utils/theme';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isVisible, setIsVisible] = useState({});
  const [counters, setCounters] = useState({
    clientes: 0,
    servicios: 0,
    programas: 0,
    satisfaccion: 0
  });
  
  const aboutRef = useRef(null);
  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const servicesRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
    // Initialize theme
    initTheme();
    setTheme(getTheme());
  }, []);

  const handleToggleTheme = () => {
    const newTheme = toggleTheme();
    if (newTheme) setTheme(newTheme);
  };

  // Intersection Observer para animaciones al hacer scroll
  useEffect(() => {
    const observers = [];
    const refs = [
      { ref: aboutRef, key: 'about' },
      { ref: missionRef, key: 'mission' },
      { ref: valuesRef, key: 'values' },
      { ref: servicesRef, key: 'services' },
      { ref: ctaRef, key: 'cta' }
    ];

    refs.forEach(({ ref, key }) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [key]: true }));
            observer.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
      );

      if (ref.current) {
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, []);

  // Contador animado
  useEffect(() => {
    if (isVisible.values) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      const targets = {
        clientes: 500,
        servicios: 150,
        programas: 80,
        satisfaccion: 98
      };

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = Math.min(step / steps, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setCounters({
          clientes: Math.floor(targets.clientes * easeOut),
          servicios: Math.floor(targets.servicios * easeOut),
          programas: Math.floor(targets.programas * easeOut),
          satisfaccion: Math.floor(targets.satisfaccion * easeOut)
        });

        if (step >= steps) {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible.values]);

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Fixed theme toggle in top-right corner */}
      <div className="theme-toggle-home" role="region" aria-label="Control de tema">
        <button
          className="theme-toggle-btn"
          onClick={handleToggleTheme}
          title="Cambiar tema (Claro/Oscuro)"
          aria-label="Cambiar tema (Claro/Oscuro)"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-orange-500 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800 opacity-90"></div>
        <div 
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='dots' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='30' cy='30' r='2' fill='rgba(255,255,255,0.1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23dots)'/%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-3xl bg-white/20 dark:bg-white/10 p-5 shadow-2xl backdrop-blur-lg hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-white drop-shadow-2xl dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            Sistema de Seguridad y Entrenamiento
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-10 text-white drop-shadow-lg dark:drop-shadow-md font-medium">
            Protección integral y capacitación profesional para tu empresa
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 mb-24 sm:mb-32">
            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                className="px-10 py-4 rounded-lg bg-white dark:bg-blue-600 text-blue-900 dark:text-blue-900 font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-blue-50 dark:hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50 dark:focus:ring-blue-400/50 transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px]"
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Ir al Dashboard</span>
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-10 py-4 rounded-lg bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-900 font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50 dark:focus:ring-gray-500/50 transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px]"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Iniciar Sesión</span>
                </Link>
                <Link 
                  to="/register" 
                  className="px-10 py-4 rounded-lg bg-orange-500 dark:bg-orange-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-orange-600 dark:hover:bg-orange-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px]"
                >
                  <i className="fas fa-user-plus"></i>
                  <span>Crear Cuenta</span>
                </Link>
                {/* Theme toggle moved to header; removed from hero */}
              </>
            )}
          </div>

          {/* Scroll indicator mejorado */}
          <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 z-20">
            <button 
              onClick={() => scrollToSection(aboutRef)}
              className="group text-white hover:text-white dark:text-white transition-all duration-300 flex flex-col items-center gap-3 focus:outline-none focus:ring-2 focus:ring-white/70 rounded-lg px-4 py-3 bg-white/10 dark:bg-white/5 backdrop-blur-md hover:bg-white/20 dark:hover:bg-white/10"
              aria-label="Explorar más contenido"
            >
              <span className="text-sm font-semibold group-hover:translate-y-1 transition-transform drop-shadow-lg">Explorar</span>
              <i className="fas fa-chevron-down text-lg animate-bounce group-hover:animate-none drop-shadow-lg"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {counters.clientes}+
              </div>
              <div className="text-sm sm:text-base text-white/90 dark:text-gray-100 font-medium">Clientes Activos</div>
            </div>
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {counters.servicios}+
              </div>
              <div className="text-sm sm:text-base text-white/90 dark:text-gray-100 font-medium">Servicios</div>
            </div>
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {counters.programas}+
              </div>
              <div className="text-sm sm:text-base text-white/90 dark:text-gray-100 font-medium">Programas</div>
            </div>
            <div className="text-center transform transition-all duration-300 hover:scale-110">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {counters.satisfaccion}%
              </div>
              <div className="text-sm sm:text-base text-white/90 dark:text-gray-100 font-medium">Satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        ref={aboutRef}
        className={`py-16 sm:py-20 lg:py-24 bg-white dark:bg-white transition-all duration-1000 ${
          isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 dark:text-white mb-6 text-center">
            Sobre Nosotros
          </h2>
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-800 dark:text-blue-900 text-center">
            Somos una empresa líder especializada en servicios de seguridad privada y programas 
            de entrenamiento profesional. Nuestra experiencia y compromiso nos han convertido en 
            la opción preferida de empresas que buscan protección de calidad y desarrollo de talento.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section 
        ref={missionRef}
        className={`py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-50 dark:to-blue-50 transition-all duration-1000 ${
          isVisible.mission ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Misión */}
            <div className="bg-white dark:bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="text-5xl sm:text-6xl text-blue-600 dark:text-blue-600 mb-6 flex justify-center">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-900 mb-6 text-center">Misión</h3>
              <p className="text-base sm:text-lg leading-relaxed text-gray-800 dark:text-blue-900 text-left">
                Proporcionar servicios de seguridad de excelencia y programas de entrenamiento 
                profesional que garanticen la protección integral de nuestros clientes y el 
                desarrollo de competencias técnicas en el sector. Nos comprometemos a mantener 
                los más altos estándares de calidad, innovación y responsabilidad social.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-white dark:bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="text-5xl sm:text-6xl text-blue-600 dark:text-blue-600 mb-6 flex justify-center">
                <i className="fas fa-eye"></i>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-900 mb-6 text-center">Visión</h3>
              <p className="text-base sm:text-lg leading-relaxed text-gray-800 dark:text-blue-900 text-left">
                Ser la empresa referente a nivel nacional en servicios de seguridad y 
                entrenamiento profesional, reconocida por nuestra innovación tecnológica, 
                excelencia operativa y compromiso con la formación continua. Aspiramos a 
                establecer nuevos estándares en la industria y contribuir al crecimiento 
                sostenible de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section 
        ref={valuesRef}
        className={`py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900 transition-all duration-1000 ${
          isVisible.values ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 dark:text-blue-900 mb-12 text-center">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {[
              { icon: 'fas fa-shield-alt', title: 'Seguridad', desc: 'Protección confiable' },
              { icon: 'fas fa-certificate', title: 'Excelencia', desc: 'Calidad en cada servicio' },
              { icon: 'fas fa-users', title: 'Compromiso', desc: 'Dedicación total al cliente' },
              { icon: 'fas fa-lightbulb', title: 'Innovación', desc: 'Tecnología de vanguardia' },
              { icon: 'fas fa-handshake', title: 'Integridad', desc: 'Transparencia y honestidad' },
              { icon: 'fas fa-graduation-cap', title: 'Formación', desc: 'Desarrollo continuo' }
            ].map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-700 to-blue-900 dark:from-gray-700 dark:to-gray-800 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 text-center"
                style={isVisible.values ? { animationDelay: `${index * 0.1}s` } : {}}
              >
                <i className={`${value.icon} text-3xl sm:text-4xl mb-4 text-orange-400 dark:text-orange-300`}></i>
                <h4 className="text-lg sm:text-xl font-semibold mb-2 text-white">{value.title}</h4>
                <p className="text-sm text-white/90 dark:text-white/80">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section 
        ref={servicesRef}
        className={`py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-50 dark:to-blue-50 transition-all duration-1000 ${
          isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 dark:text-blue-900 mb-12 text-center">
            Nuestros Servicios
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {[
              { icon: 'fas fa-shield-alt', title: 'Servicios de Seguridad', desc: 'Protección personalizada para tu empresa con personal altamente capacitado' },
              { icon: 'fas fa-graduation-cap', title: 'Programas de Entrenamiento', desc: 'Capacitación profesional especializada en seguridad y desarrollo de habilidades' },
              { icon: 'fas fa-file-contract', title: 'Contrataciones', desc: 'Soluciones flexibles adaptadas a tus necesidades específicas' },
              { icon: 'fas fa-chart-bar', title: 'Gestión Integral', desc: 'Sistema completo para administrar todos tus recursos y operaciones' }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-t-4 border-blue-600 dark:border-blue-600 hover:border-orange-500 dark:hover:border-orange-500"
                style={isVisible.services ? { animationDelay: `${index * 0.15}s` } : {}}
              >
                <i className={`${service.icon} text-4xl sm:text-5xl text-blue-600 dark:text-blue-600 mb-4`}></i>
                <h3 className="text-xl sm:text-2xl font-semibold text-blue-900 dark:text-blue-900 mb-3">{service.title}</h3>
                <p className="text-gray-700 dark:text-blue-900 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className={`py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white text-center transition-all duration-1000 ${
          isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white dark:text-white">¿Listo para comenzar?</h2>
          <p className="text-lg sm:text-xl lg:text-2xl mb-10 text-white/90 dark:text-gray-100">
            Únete a nuestro sistema y experimenta la mejor gestión de seguridad y entrenamiento
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="px-10 py-4 rounded-lg bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-900 font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50 dark:focus:ring-gray-500/50 transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px]"
            >
              <i className="fas fa-user-plus"></i>
              <span>Crear Cuenta</span>
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-4 rounded-lg bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm text-white dark:text-blue-900 border-2 border-white/50 dark:border-gray-500 font-semibold text-lg hover:bg-white/30 dark:hover:bg-gray-600/50 hover:border-white dark:hover:border-gray-400 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px]"
            >
              <i className="fas fa-sign-in-alt"></i>
              <span>Iniciar Sesión</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-white/80 dark:text-gray-300">
            &copy; 2024 Sistema de Seguridad y Entrenamiento. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
