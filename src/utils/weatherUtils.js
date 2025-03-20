// Utilidad para manejar el caché de datos del clima
const weatherCache = {
  data: null,
  timestamp: 0,
  TTL: 30 * 60 * 1000, // 30 minutos en milisegundos
  fetchPromise: null // Para controlar peticiones simultáneas
};

// Función para obtener datos del clima con caché
export const fetchWeatherWithCache = async () => {
  const now = Date.now();
  
  // Si tenemos datos en caché y no han expirado, usarlos
  if (weatherCache.data && now - weatherCache.timestamp < weatherCache.TTL) {
    return weatherCache.data;
  }
  
  // Si ya hay una petición en curso, esperar a que termine en lugar de iniciar otra
  if (weatherCache.fetchPromise) {
    try {
      return await weatherCache.fetchPromise;
    } catch (error) {
      // Si la promesa en curso falla, limpiarla para intentar de nuevo
      weatherCache.fetchPromise = null;
      console.error('Error en petición en curso:', error);
      // Continuar con una nueva petición
    }
  }
  
  // Si no hay caché o expiró, hacer la petición
  try {
    // Crear y almacenar la promesa para que otros componentes puedan esperarla
    weatherCache.fetchPromise = (async () => {
      // Obtener configuración desde localStorage
      const apiKey = localStorage.getItem('weatherApiKey') || '';
      const placeId = localStorage.getItem('weatherPlaceId') || '';
      
      // Construir URL con parámetros si están disponibles
      let url = 'https://devline.app/clock/api/weather.php';
      
      // Si tenemos configuración local, usar el endpoint v02
      if (apiKey && placeId) {
        url = `https://devline.app/clock/api/weather-v02.php?api_key=${encodeURIComponent(apiKey)}&place_id=${encodeURIComponent(placeId)}`;
      }
      
      console.log('Realizando petición a la API de clima...');
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('No se pudo obtener la información del clima');
      }
      
      const data = await response.json();
      
      // Verificar si hay errores en la respuesta
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Actualizar caché
      weatherCache.data = data;
      weatherCache.timestamp = now;
      
      return data;
    })();

    const result = await weatherCache.fetchPromise;
    // Una vez completada con éxito, limpiar la promesa
    weatherCache.fetchPromise = null;
    return result;
  } catch (error) {
    // Si hay error, limpiar la promesa para permitir nuevos intentos
    weatherCache.fetchPromise = null;
    throw error;
  }
};

// Adaptador para el formato de los datos de la API
export const adaptWeatherData = (data) => {
  if (!data || !data.current) return null;
  
  return {
    current: {
      ...data.current,
      humidity: data.current.cloud_cover || 0, // Adaptación ya que la API no provee humedad directamente
    },
    hourly: data.hourly,
    daily: data.daily
  };
};

// Verificar si hay configuración guardada
export const hasWeatherConfig = () => {
  const apiKey = localStorage.getItem('weatherApiKey');
  const placeId = localStorage.getItem('weatherPlaceId');
  return !!(apiKey && placeId);
};
