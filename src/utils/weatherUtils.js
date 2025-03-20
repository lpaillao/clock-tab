// Utilidad para manejar el caché de datos del clima
const weatherCache = {
  data: null,
  timestamp: 0,
  TTL: 10 * 60 * 1000 // 10 minutos en milisegundos
};

// Función para obtener datos del clima con caché
export const fetchWeatherWithCache = async () => {
  const now = Date.now();
  // Si tenemos datos en caché y no han expirado, usarlos
  if (weatherCache.data && now - weatherCache.timestamp < weatherCache.TTL) {
    return weatherCache.data;
  }
  
  // Si no hay caché o expiró, hacer la petición
  try {
    const response = await fetch('https://devline.app/clock/api/weather.php');
    if (!response.ok) {
      throw new Error('No se pudo obtener la información del clima');
    }
    
    const data = await response.json();
    
    // Actualizar caché
    weatherCache.data = data;
    weatherCache.timestamp = now;
    
    return data;
  } catch (error) {
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
