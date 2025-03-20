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
  
  // Precarga de imágenes con mejor manejo de errores
  const preloadImage = (src) => {
    return new Promise((resolve) => {
      if (imageCache.current[src]) {
        resolve(src);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        imageCache.current[src] = true;
        resolve(src);
      };
      img.onerror = () => {
        // Resolver con imagen de respaldo en caso de error
        console.warn(`No se pudo cargar: ${src}, usando respaldo`);
        resolve('/backgrounds/day.webp'); // Imagen de respaldo
      };
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
        // Siempre tener una imagen de respaldo
        const loadedSrc = await preloadImage(newBackgroundSrc);
        setBackgroundImage(loadedSrc);
        setBackgroundLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error al cargar la imagen de fondo:', err);
        // Usar una imagen predeterminada si todo falla
        setBackgroundImage('/backgrounds/day.webp');
        setBackgroundLoaded(true);
        setIsLoading(false);
      }
    };
    
    updateBackground();
  }, [currentWeather, timeOfDay, theme]);
  
  const getBackgroundImage = () => {
    // Simplificar para usar principalmente las imágenes que sabemos que existen
    const timeBackgrounds = {
      morning: '/backgrounds/day.webp', // Cambiado a day.webp por compatibilidad
      day: '/backgrounds/day.webp',
      sunset: '/backgrounds/day.webp', // Fallback si no existe sunset.webp
      night: '/backgrounds/night.webp'
    };
    
    // Usar menos variaciones para reducir errores de carga
    if (currentWeather) {
      if (['rain', 'snow', 'fog'].includes(currentWeather)) {
        return '/backgrounds/cloudy.webp'; // Usar una imagen que sabemos que existe
      }
      
      if (['sunny', 'partly_sunny', 'partly_clear'].includes(currentWeather)) {
        return timeOfDay === 'night' ? '/backgrounds/night.webp' : '/backgrounds/day.webp';
      }
    }
    
    // Fallback a solo hora del día
    return timeBackgrounds[timeOfDay];
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