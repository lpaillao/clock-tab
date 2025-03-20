import { useState, useEffect } from 'react';

const WeeklyForecast = ({ className = '', theme }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        // En un entorno real, obtendríamos estos datos de la API
        // Aquí generamos datos simulados
        
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const weatherTypes = ['sunny', 'partly_sunny', 'cloudy', 'rain', 'thunderstorm'];
        
        // Fecha actual para generar pronóstico de 7 días
        const today = new Date();
        
        // Inicializar array vacío antes de rellenarlo
        const generatedForecast = [];
        
        // Generar datos simulados para la semana
        for (let i = 0; i < 7; i++) {
          const forecastDate = new Date(today);
          forecastDate.setDate(today.getDate() + i);
          
          // Elegir tipo de clima aleatorio pero con cierta coherencia
          // (climas similares en días consecutivos)
          let weatherIndex;
          if (i === 0) {
            weatherIndex = Math.floor(Math.random() * weatherTypes.length);
          } else {
            // 70% de probabilidad de clima similar al día anterior
            const prevWeatherIndex = weatherTypes.indexOf(generatedForecast[i-1]?.weather);
            if (Math.random() < 0.7 && prevWeatherIndex !== -1) {
              weatherIndex = Math.max(0, Math.min(weatherTypes.length - 1, 
                prevWeatherIndex + (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.7 ? 1 : 0)));
            } else {
              weatherIndex = Math.floor(Math.random() * weatherTypes.length);
            }
          }
          
          // Generar temperaturas con cierta coherencia
          const baseTemp = 22 + (Math.random() * 10) - 5;
          
          generatedForecast.push({
            date: forecastDate.toISOString(),
            day: days[forecastDate.getDay()],
            weather: weatherTypes[weatherIndex],
            temp_max: Math.round(baseTemp + 2 + Math.random() * 3),
            temp_min: Math.round(baseTemp - 2 - Math.random() * 3),
            precipitation: Math.round(Math.random() * 80)
          });
        }
        
        setForecast(generatedForecast);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener pronóstico:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  const getWeatherIcon = (iconName) => {
    const iconMap = {
      'sunny': 'fa-sun',
      'partly_sunny': 'fa-cloud-sun',
      'partly_clear': 'fa-cloud-moon',
      'cloudy': 'fa-cloud',
      'overcast': 'fa-clouds',
      'fog': 'fa-smog',
      'rain': 'fa-cloud-rain',
      'snow': 'fa-snowflake',
      'thunderstorm': 'fa-bolt'
    };
    
    return iconMap[iconName] || 'fa-question';
  };

  if (loading) {
    return (
      <div className={`glass-morphism rounded-2xl p-6 shadow-lg text-white h-full min-h-[100px] flex items-center justify-center ${className}`}>
        <div className="loading loading-spinner loading-md text-primary"></div>
      </div>
    );
  }

  if (error || !forecast) {
    return (
      <div className={`glass-morphism rounded-2xl p-6 shadow-lg text-white h-full min-h-[100px] flex items-center justify-center ${className}`}>
        <p>No se pudo cargar el pronóstico</p>
      </div>
    );
  }

  return (
    <div className={`glass-morphism rounded-2xl p-4 md:p-6 shadow-lg text-white ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Pronóstico semanal</h3>
      
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex w-full min-w-max">
          {forecast.map((day, index) => {
            const date = new Date(day.date);
            const isToday = index === 0;
            
            return (
              <div 
                key={index} 
                className={`flex-1 min-w-[85px] p-2 md:p-3 rounded-lg flex flex-col items-center ${
                  isToday ? 'bg-primary/20 font-medium' : ''
                }`}
              >
                <div className="text-sm md:text-base">
                  {isToday ? 'Hoy' : day.day.substring(0, 3)}
                </div>
                <div className="text-xs opacity-70">
                  {date.getDate()}/{date.getMonth() + 1}
                </div>
                <div className="my-2 md:my-3 text-xl md:text-2xl text-accent">
                  <i className={`fas ${getWeatherIcon(day.weather)}`}></i>
                </div>
                <div className="flex items-center justify-between w-full text-sm">
                  <span className="font-semibold">{day.temp_max}°</span>
                  <span className="opacity-70">{day.temp_min}°</span>
                </div>
                <div className="flex items-center mt-1 text-xs opacity-70">
                  <i className="fas fa-tint mr-1 text-info"></i>
                  <span>{day.precipitation}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyForecast;
