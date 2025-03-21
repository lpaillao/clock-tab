import { useState, useEffect } from 'react';
import DigitalClock from './components/DigitalClock';
import DateDisplay from './components/DateDisplay';
import WeatherWidget from './components/WeatherWidget';
import BackgroundManager from './components/BackgroundManager';
import ThemeToggle from './components/ThemeToggle';
import AirQualityWidget from './components/AirQualityWidget';
import WeeklyForecast from './components/WeeklyForecast';
import ConfigModal from './components/ConfigModal';
import { hasWeatherConfig } from './utils/weatherUtils';

function App() {
  const [theme, setTheme] = useState('weather-light');
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [hasConfig, setHasConfig] = useState(hasWeatherConfig());

  // Detectar la hora del día para cambios automáticos
  useEffect(() => {
    const checkTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 10) {
        setTimeOfDay('morning');
      } else if (hour >= 10 && hour < 17) {
        setTimeOfDay('day');
      } else if (hour >= 17 && hour < 20) {
        setTimeOfDay('sunset');
      } else {
        setTimeOfDay('night');
        // Cambiar automáticamente a tema oscuro por la noche
        document.documentElement.setAttribute('data-theme', 'weather-dark');
        setTheme('weather-dark');
      }
    };

    checkTimeOfDay();
    const dayNightInterval = setInterval(checkTimeOfDay, 60 * 60 * 1000); // Verificar cada hora

    // Detectar cambios en la orientación
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(dayNightInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'weather-light' ? 'weather-dark' : 'weather-light';
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  };
  
  const handleConfigSave = (config) => {
    // Actualizar el estado para indicar que ahora hay configuración
    setHasConfig(true);
    
    // Recargar la página para aplicar la nueva configuración
    window.location.reload();
  };
  
  // Mostrar el modal de configuración al iniciar si no hay configuración
  useEffect(() => {
    // Solo mostrar automáticamente después de 2 segundos si no hay configuración
    // y si es la primera visita (no guardado en localStorage)
    const hasShownConfigBefore = localStorage.getItem('hasShownConfigBefore');
    
    if (!hasConfig && !hasShownConfigBefore) {
      const timer = setTimeout(() => {
        setShowConfigModal(true);
        localStorage.setItem('hasShownConfigBefore', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasConfig]);

  return (
    <BackgroundManager timeOfDay={timeOfDay} theme={theme}>
      <div className="min-h-screen w-full p-4 md:p-6 flex flex-col">
        {/* Layout adaptativo basado en orientación */}
        {isLandscape ? (
          // Layout para landscape (horizontal)
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel izquierdo: Reloj y fecha */}
            <div className="lg:col-span-1 flex flex-col justify-center gap-4">
              <DigitalClock />
              <DateDisplay />
              <div className="flex justify-center mt-2">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </div>
            </div>
            
            {/* Panel central/derecho: Clima y widgets */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <WeatherWidget theme={theme} />
              <AirQualityWidget theme={theme} />
              <WeeklyForecast className="md:col-span-2" theme={theme} />
              
              <div className="flex md:col-span-2 justify-center gap-4 mt-2">
                <button 
                  className={`btn btn-circle btn-sm ${timeOfDay === 'day' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setTimeOfDay('day')}
                >
                  <i className="fas fa-sun"></i>
                </button>
                <button 
                  className={`btn btn-circle btn-sm ${timeOfDay === 'sunset' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setTimeOfDay('sunset')}
                >
                  <i className="fas fa-sunset"></i>
                </button>
                <button 
                  className={`btn btn-circle btn-sm ${timeOfDay === 'night' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setTimeOfDay('night')}
                >
                  <i className="fas fa-moon"></i>
                </button>
                <button 
                  className={`btn btn-circle btn-sm ${timeOfDay === 'morning' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setTimeOfDay('morning')}
                >
                  <i className="fas fa-cloud-sun"></i>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Layout para portrait (vertical)
          <div className="flex flex-col items-center justify-between h-full gap-6">
            <div className="w-full">
              <DigitalClock />
              <DateDisplay />
            </div>
            
            <div className="w-full grid grid-cols-1 gap-4">
              <WeatherWidget theme={theme} />
              <AirQualityWidget theme={theme} />
              <WeeklyForecast theme={theme} />
            </div>
            
            <div className="flex justify-center gap-4 mt-4">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              
              <div className="divider divider-horizontal"></div>
              
              <div className="btn-group">
                <button 
                  className={`btn btn-sm ${timeOfDay === 'day' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setTimeOfDay('day')}
                >
                  <i className="fas fa-sun"></i>
                </button>
                <button 
                  className={`btn btn-sm ${timeOfDay === 'sunset' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setTimeOfDay('sunset')}
                >
                  <i className="fas fa-sunset"></i>
                </button>
                <button 
                  className={`btn btn-sm ${timeOfDay === 'night' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setTimeOfDay('night')}
                >
                  <i className="fas fa-moon"></i>
                </button>
                <button 
                  className={`btn btn-sm ${timeOfDay === 'morning' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setTimeOfDay('morning')}
                >
                  <i className="fas fa-cloud-sun"></i>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Botón de configuración de API flotante */}
        <button 
          className="fixed bottom-10 left-10 btn btn-circle btn-primary shadow-lg z-30"
          onClick={() => setShowConfigModal(true)}
          title="Configurar API del clima"
        >
          <i className="fas fa-cog"></i>
        </button>
        
        {/* Modal de configuración */}
        <ConfigModal 
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          onSave={handleConfigSave}
        />
        
        {/* Atribución a CubitDev */}
        <div className="attribution">
          <a href="https://cubitdev.com" target="_blank" rel="noopener noreferrer">
            Creado por CubitDev.com
          </a>
        </div>
      </div>
    </BackgroundManager>
  );
}

export default App;