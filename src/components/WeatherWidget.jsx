import { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Cache compartido para todos los componentes
const weatherCache = {
  data: null,
  timestamp: 0,
  TTL: 10 * 60 * 1000 // 10 minutos en milisegundos
};

// Función auxiliar para obtener datos del clima con caché
const fetchWeatherWithCache = async () => {
  const now = Date.now();
  // Si tenemos datos en caché y no han expirado, usarlos
  if (weatherCache.data && now - weatherCache.timestamp < weatherCache.TTL) {
    return weatherCache.data;
  }
  
  // Si no hay caché o expiró, hacer la petición
  try {
    // Obtener configuración desde localStorage
    const apiKey = localStorage.getItem('weatherApiKey') || '';
    const placeId = localStorage.getItem('weatherPlaceId') || '';
    
    // Construir URL con parámetros si están disponibles
    let url = 'https://devline.app/clock/api/weather.php';
    
    // Si tenemos configuración local, usar el endpoint v02
    if (apiKey && placeId) {
      url = `https://devline.app/clock/api/weather-v02.php?api_key=${encodeURIComponent(apiKey)}&place_id=${encodeURIComponent(placeId)}`;
    }
    
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
  } catch (error) {
    throw error;
  }
};

const WeatherWidget = ({ theme }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecastVisible, setForecastVisible] = useState(false);
  const [temperatureChart, setTemperatureChart] = useState(null);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        const data = await fetchWeatherWithCache();
        setWeather(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener el clima:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadWeatherData();
    
    // Actualizar cada 30 minutos (cambiado de 10 minutos)
    const weatherInterval = setInterval(loadWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(weatherInterval);
  }, []);

  // Renderizar gráfico de temperatura
  useEffect(() => {
    if (!weather || !weather.hourly?.data?.length) return;
    
    // Destruir gráfico existente si hay uno
    if (temperatureChart) {
      temperatureChart.destroy();
    }
    
    const nextHours = weather.hourly.data.slice(0, 12);
    const ctx = document.getElementById('temperature-chart');
    
    if (!ctx) return;
    
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: nextHours.map(hour => {
          const hourTime = new Date(hour.date);
          return `${hourTime.getHours()}:00`;
        }),
        datasets: [{
          label: 'Temperatura (°C)',
          data: nextHours.map(hour => Math.round(hour.temperature)),
          fill: true,
          backgroundColor: theme === 'weather-dark' 
            ? 'rgba(56, 189, 248, 0.2)' 
            : 'rgba(37, 99, 235, 0.2)',
          borderColor: theme === 'weather-dark' ? '#38bdf8' : '#2563eb',
          tension: 0.4,
          pointBackgroundColor: theme === 'weather-dark' ? '#38bdf8' : '#2563eb',
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: theme === 'weather-dark' ? '#1e293b' : '#ffffff',
            titleColor: theme === 'weather-dark' ? '#ffffff' : '#0f172a',
            bodyColor: theme === 'weather-dark' ? '#e2e8f0' : '#334155',
            borderColor: theme === 'weather-dark' ? '#475569' : '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.raw}°C`
            }
          }
        },
        scales: {
          y: {
            display: false
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: theme === 'weather-dark' ? '#cbd5e1' : '#475569',
              font: {
                size: 10
              }
            }
          }
        }
      }
    });
    
    setTemperatureChart(newChart);
    
  }, [weather, theme]);

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
      <div className="glass-morphism rounded-2xl p-6 shadow-lg text-white h-full min-h-[250px] flex flex-col items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary mb-3"></div>
        <p className="text-lg">Obteniendo datos del clima...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-morphism rounded-2xl p-6 shadow-lg text-white h-full min-h-[250px] flex flex-col items-center justify-center">
        <div className="text-5xl text-warning mb-3">⚠️</div>
        <p className="text-lg mb-3">Error: {error}</p>
        <button 
          className="btn btn-primary btn-sm" 
          onClick={() => window.location.reload()}
        >
          Reintentar <i className="fas fa-sync-alt ml-2"></i>
        </button>
      </div>
    );
  }

  if (!weather || !weather.current) {
    return (
      <div className="glass-morphism rounded-2xl p-6 shadow-lg text-white h-full min-h-[250px] flex flex-col items-center justify-center">
        <p className="text-lg">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-2xl p-6 shadow-lg text-white h-full animate-weather-fade">
      <div className="tabs tabs-boxed bg-transparent mb-4 justify-center">
        <a 
          className={`tab ${activeTab === 'current' ? 'tab-active bg-primary/20' : ''} text-white`}
          onClick={() => setActiveTab('current')}
        >
          Actual
        </a>
        <a 
          className={`tab ${activeTab === 'hourly' ? 'tab-active bg-primary/20' : ''} text-white`}
          onClick={() => setActiveTab('hourly')}
        >
          Por hora
        </a>
      </div>

      {activeTab === 'current' && (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl md:text-6xl text-accent">
              <i className={`fas ${getWeatherIcon(weather.current.icon)}`}></i>
            </div>
            <div className="flex-1">
              <div className="text-4xl md:text-5xl font-bold">{Math.round(weather.current.temperature)}°</div>
              <div className="text-lg md:text-xl opacity-90">{weather.current.summary}</div>
            </div>
            <div className="hidden md:flex flex-col gap-2">
              <div className="stat-box">
                <i className="fas fa-wind mr-2 text-info"></i>
                <span>{weather.current.wind.speed} km/h</span>
              </div>
              <div className="stat-box">
                <i className="fas fa-tint mr-2 text-info"></i>
                <span>{weather.current.humidity}%</span>
              </div>
              <div className="stat-box">
                <i className="fas fa-cloud mr-2 text-info"></i>
                <span>{weather.current.cloud_cover}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 md:hidden mb-6">
            <div className="stat-value flex flex-col items-center p-2 rounded-lg bg-primary/10">
              <i className="fas fa-wind mb-1 text-info"></i>
              <span className="text-sm">{weather.current.wind.speed} km/h</span>
            </div>
            <div className="stat-value flex flex-col items-center p-2 rounded-lg bg-primary/10">
              <i className="fas fa-tint mb-1 text-info"></i>
              <span className="text-sm">{weather.current.humidity}%</span>
            </div>
            <div className="stat-value flex flex-col items-center p-2 rounded-lg bg-primary/10">
              <i className="fas fa-cloud mb-1 text-info"></i>
              <span className="text-sm">{weather.current.cloud_cover}%</span>
            </div>
          </div>

          <div className="hidden md:flex overflow-x-auto pb-2 justify-between">
            {weather.hourly?.data?.slice(0, 6).map((hour, index) => {
              const hourTime = new Date(hour.date);
              return (
                <div key={index} className="flex flex-col items-center p-2 min-w-[70px]">
                  <div className="text-sm mb-1">{hourTime.getHours()}:00</div>
                  <div className="text-xl mb-1">
                    <i className={`fas ${getWeatherIcon(hour.weather)}`}></i>
                  </div>
                  <div className="font-bold">{Math.round(hour.temperature)}°</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'hourly' && (
        <div className="w-full h-[200px] relative">
          <canvas id="temperature-chart"></canvas>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;