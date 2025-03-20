// src/components/BackgroundManager.jsx
import { useEffect, useState, useRef } from 'react';

// Compartir el caché de clima
import { fetchWeatherWithCache } from '../utils/weatherUtils';

const BackgroundManager = ({ children, timeOfDay, theme }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageCache = useRef({});
  
  // Precarga de imágenes mejorada
  const preloadImage = (src) => {
    return new Promise((resolve) => {
      // Si ya está en caché, usar versión cacheada
      if (imageCache.current[src]) {
        resolve(src);
        return;
      }
      
      const img = new Image();
      
      img.onload = () => {
        console.log(`Imagen cargada correctamente: ${src}`);
        imageCache.current[src] = true;
        resolve(src);
      };
      
      img.onerror = () => {
        console.warn(`Error al cargar imagen: ${src}, intentando alternativa`);
        
        // Intentar alternativas en caso de error
        if (src.includes('night-')) {
          // Si falló una variante nocturna, usar night.webp genérico
          resolve('/backgrounds/night.webp');
        } else if (src.includes('partly-')) {
          // Si falló partly-cloudy, intentar con cloudy
          resolve('/backgrounds/cloudy.webp');
        } else {
          // Para cualquier otro caso, usar imagen por defecto según hora
          const fallbacks = {
            night: '/backgrounds/night.webp',
            day: '/backgrounds/day.webp',
            morning: '/backgrounds/morning.webp',
            sunset: '/backgrounds/sunset.webp'
          };
          resolve(fallbacks[timeOfDay] || '/backgrounds/day.webp');
        }
      };
      
      // Iniciar carga de imagen
      img.src = src;
    });
  };
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await fetchWeatherWithCache();
        setCurrentWeather(data.current?.icon || 'partly_clear');
      } catch (err) {
        console.error('Error obteniendo el clima para el fondo:', err);
        setCurrentWeather('partly_clear'); // Default
      }
    };
    
    fetchWeather();
    // Utilizar mismo intervalo que en WeatherWidget para consistencia
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Cuando cambia el clima o la hora del día, actualizar el fondo
    const updateBackground = async () => {
      setIsLoading(true);
      const newBackgroundSrc = getBackgroundImage();
      
      try {
        // Intentar cargar la imagen seleccionada
        const loadedSrc = await preloadImage(newBackgroundSrc);
        setBackgroundImage(loadedSrc);
        setBackgroundLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error crítico al cargar la imagen de fondo:', err);
        // Última alternativa si todo falla
        setBackgroundImage('/backgrounds/day.webp');
        setBackgroundLoaded(true);
        setIsLoading(false);
      }
    };
    
    // Precargar todas las imágenes de fondo para transiciones más rápidas
    const preloadAllBackgrounds = async () => {
      const backgrounds = [
        '/backgrounds/day.webp',
        '/backgrounds/night.webp',
        '/backgrounds/morning.webp',
        '/backgrounds/sunset.webp',
        '/backgrounds/cloudy.webp',
        '/backgrounds/rain.webp',
        '/backgrounds/fog.webp',
        '/backgrounds/snow.webp',
        '/backgrounds/sunny.webp',
        '/backgrounds/overcast.webp',
        '/backgrounds/night-clear.webp',
        '/backgrounds/night-partly-cloudy.webp',
        '/backgrounds/partly-cloudy.webp'
      ];
      
      // Precargar en segundo plano sin bloquear
      backgrounds.forEach(bg => {
        const img = new Image();
        img.src = bg;
        img.onload = () => {
          imageCache.current[bg] = true;
        };
      });
    };
    
    updateBackground();
    preloadAllBackgrounds();
  }, [currentWeather, timeOfDay, theme]);
  
  const getBackgroundImage = () => {
    // Mapeos específicos por hora del día
    const timeBackgrounds = {
      morning: '/backgrounds/morning.webp',
      day: '/backgrounds/day.webp',
      sunset: '/backgrounds/sunset.webp',
      night: '/backgrounds/night.webp'
    };
    
    // Si no hay clima, usar background por hora del día
    if (!currentWeather) {
      return timeBackgrounds[timeOfDay] || '/backgrounds/day.webp';
    }
    
    // Mapear condiciones climáticas a imágenes de fondo específicas
    const weatherMap = {
      // Condiciones diurnas
      'sunny': '/backgrounds/sunny.webp',
      'partly_sunny': '/backgrounds/partly-cloudy.webp',
      'cloudy': '/backgrounds/cloudy.webp',
      'overcast': '/backgrounds/overcast.webp',
      'fog': '/backgrounds/fog.webp',
      'rain': '/backgrounds/rain.webp',
      'snow': '/backgrounds/snow.webp',
      
      // Condiciones nocturnas
      'clear': '/backgrounds/night-clear.webp',
      'partly_clear': '/backgrounds/night-partly-cloudy.webp'
    };
    
    // Si es de noche, usar variantes nocturnas para algunos casos
    if (timeOfDay === 'night') {
      // Si hay una versión nocturna específica para el clima actual, usarla
      if (currentWeather === 'partly_clear' || currentWeather === 'clear') {
        return weatherMap[currentWeather];
      }
      
      // Para otros climas sin versión nocturna específica, usar imagen general nocturna
      return '/backgrounds/night.webp';
    }
    
    // Para clima diurno, primero buscar si hay imagen específica para ese clima
    if (weatherMap[currentWeather]) {
      return weatherMap[currentWeather];
    }
    
    // Si no hay imagen específica para este clima, usar la imagen según hora del día
    return timeBackgrounds[timeOfDay] || '/backgrounds/day.webp';
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Capa de fondo con imagen */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${backgroundLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Capa de overlay para mejorar legibilidad y ajustar según tema */}
      <div 
        className={`absolute inset-0 ${theme === 'weather-dark' ? 'bg-black/30' : 'bg-black/10'} backdrop-blur-xs`}
      />
      
      {/* Loader mientras se carga el fondo */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
      
      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default BackgroundManager;