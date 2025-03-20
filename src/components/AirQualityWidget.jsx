import { useState, useEffect } from 'react';
import { fetchWeatherWithCache } from '../utils/weatherUtils';

const AirQualityWidget = ({ theme }) => {
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAirQuality = async () => {
      try {
        setLoading(true);
        
        // Utilizar el clima real para generar datos simulados que tengan coherencia
        const weatherData = await fetchWeatherWithCache();
        
        // Datos simulados basados en el clima real
        const cloudCover = weatherData.current?.cloud_cover || 50;
        const isRainy = weatherData.current?.icon?.includes('rain') || false;
        
        // AQI mejor si hay lluvia (limpia el aire) o peor si está nublado sin lluvia
        const baseAQI = isRainy ? 30 : (cloudCover > 70 ? 80 : 45);
        const mockData = {
          aqi: Math.floor(baseAQI + (Math.random() * 20) - 10),
          description: 'Buena',
          pollutants: {
            pm25: Math.floor((baseAQI/2) + (Math.random() * 15)),
            pm10: Math.floor(baseAQI + (Math.random() * 20)),
            o3: Math.floor(30 + (Math.random() * 40)),
            no2: Math.floor(10 + (Math.random() * 30))
          },
          updated: new Date().toISOString()
        };
        
        // Asignar descripción según AQI
        if (mockData.aqi > 100) {
          mockData.description = 'Pobre';
        } else if (mockData.aqi > 50) {
          mockData.description = 'Moderada';
        } else {
          mockData.description = 'Buena';
        }
        
        setAirQuality(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener calidad del aire:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAirQuality();
    const interval = setInterval(fetchAirQuality, 30 * 60 * 1000); // Actualizar cada 30 minutos (cambiado de 10 minutos)
    
    return () => clearInterval(interval);
  }, []);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-success';
    if (aqi <= 100) return 'text-warning';
    return 'text-error';
  };

  const getAQIBg = (aqi) => {
    if (aqi <= 50) return 'bg-success/20';
    if (aqi <= 100) return 'bg-warning/20';
    return 'bg-error/20';
  };

  if (loading) {
    return (
      <div className="glass-morphism rounded-2xl p-6 shadow-lg text-white h-full min-h-[250px] flex flex-col items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary mb-3"></div>
        <p className="text-lg">Obteniendo calidad del aire...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-morphism rounded-2xl p-6 shadow-lg text-white h-full min-h-[250px] flex flex-col items-center justify-center">
        <p className="text-lg">Error al cargar los datos</p>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-2xl p-6 shadow-lg text-white h-full animate-weather-fade">
      <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
        <i className="fas fa-lungs mr-2 text-info"></i>
        Calidad del Aire
      </h3>
      
      <div className="flex items-center justify-center mb-6">
        <div className={`rounded-full ${getAQIBg(airQuality.aqi)} w-28 h-28 flex items-center justify-center`}>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getAQIColor(airQuality.aqi)}`}>
              {airQuality.aqi}
            </div>
            <div className="text-sm">AQI</div>
          </div>
        </div>
        <div className="ml-6">
          <div className="text-xl font-semibold">{airQuality.description}</div>
          <div className="text-sm opacity-80">Actualizado hace 10 min.</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-pill">
          <span className="text-sm">PM2.5</span>
          <span className="font-semibold">{airQuality.pollutants.pm25} µg/m³</span>
        </div>
        <div className="stat-pill">
          <span className="text-sm">PM10</span>
          <span className="font-semibold">{airQuality.pollutants.pm10} µg/m³</span>
        </div>
        <div className="stat-pill">
          <span className="text-sm">O₃</span>
          <span className="font-semibold">{airQuality.pollutants.o3} µg/m³</span>
        </div>
        <div className="stat-pill">
          <span className="text-sm">NO₂</span>
          <span className="font-semibold">{airQuality.pollutants.no2} µg/m³</span>
        </div>
      </div>
    </div>
  );
};

export default AirQualityWidget;
