# ClockTab: Creando una Elegante Aplicación de Reloj y Clima con React

![ClockTab Banner](/screenshots/banner.jpg)

**[Ver Demo](https://clock-tab.cubitdev.com) | [Código Fuente](https://github.com/cubitdev/clock-tab) | [Descargar](https://github.com/cubitdev/clock-tab/archive/refs/heads/main.zip)**

## 📝 Introducción

En este artículo, voy a presentarles **ClockTab**, una aplicación web moderna y elegante que he desarrollado como parte de mi exploración en tecnologías frontend. La aplicación combina un reloj digital con información meteorológica en tiempo real, todo ello en una interfaz visual atractiva y adaptable a cualquier dispositivo.

ClockTab nació de una necesidad personal: quería una página de inicio minimalista pero funcional que me mostrara la información que consulto constantemente (hora, fecha y clima) sin distracciones. Lo que comenzó como un pequeño proyecto para practicar React, se transformó en una aplicación completa con múltiples funcionalidades y un cuidado diseño visual.

## ✨ ¿Qué hace ClockTab?

ClockTab es una aplicación web que combina:

- **Reloj digital de alta precisión**: Muestra la hora actual con segundos.
- **Visualización de fecha**: Incluye el día de la semana, fecha completa y progreso del año.
- **Información meteorológica**: Temperatura actual, condiciones climáticas, velocidad del viento y más.
- **Pronóstico semanal**: Previsión del tiempo para los próximos 7 días.
- **Calidad del aire**: Indicadores de calidad ambiental (simulados).
- **Fondos dinámicos**: Cambian según la hora del día y las condiciones climáticas.
- **Temas claro/oscuro**: Para adaptar la aplicación a tus preferencias visuales.
- **Diseño responsivo**: Funciona perfectamente en móviles, tablets y ordenadores.
- **Instalable como PWA**: Puedes añadirla a tu pantalla de inicio como una aplicación nativa.

## 🛠️ Tecnologías utilizadas

Para desarrollar ClockTab he utilizado diversas tecnologías modernas:

- **React** como framework principal
- **Vite** para el empaquetado y desarrollo
- **TailwindCSS** para el diseño visual
- **DaisyUI** como complemento de Tailwind para componentes
- **Chart.js** para visualizaciones gráficas
- **API de Meteosource** para datos climáticos en tiempo real
- **PWA** para permitir la instalación como aplicación

## 💻 El código detrás de ClockTab

### Diseño adaptativo según orientación

Una de las partes más interesantes del código es cómo la aplicación detecta y se adapta a la orientación del dispositivo para ofrecer la mejor experiencia de usuario:

```jsx
function App() {
  // Detectar si el dispositivo está en modo horizontal o vertical
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  // Detectar cambios en la orientación
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // En el render, usamos el estado para mostrar layouts diferentes
  return (
    <BackgroundManager timeOfDay={timeOfDay} theme={theme}>
      <div className="min-h-screen w-full p-4 md:p-6 flex flex-col">
        {isLandscape ? (
          // Layout optimizado para orientación horizontal
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contenido específico para landscape */}
          </div>
        ) : (
          // Layout optimizado para orientación vertical
          <div className="flex flex-col items-center justify-between h-full gap-6">
            {/* Contenido específico para portrait */}
          </div>
        )}
      </div>
    </BackgroundManager>
  );
}
```

### Fondos dinámicos según el clima y hora del día

Otro aspecto fascinante es cómo la aplicación cambia su fondo según la hora del día y las condiciones climáticas actuales:

```jsx
const getBackgroundImage = () => {
  // Fondos según hora del día
  const timeBackgrounds = {
    morning: '/backgrounds/day.webp',
    day: '/backgrounds/day.webp',
    sunset: '/backgrounds/day.webp',
    night: '/backgrounds/night.webp'
  };
  
  // Si hay información de clima, la combinamos con la hora
  if (currentWeather) {
    if (['rain', 'snow', 'fog'].includes(currentWeather)) {
      return '/backgrounds/cloudy.webp';
    }
    
    if (['sunny', 'partly_sunny', 'partly_clear'].includes(currentWeather)) {
      return timeOfDay === 'night' ? '/backgrounds/night.webp' : '/backgrounds/day.webp';
    }
  }
  
  // Fallback a solo hora del día
  return timeBackgrounds[timeOfDay];
};
```

### Implementación del reloj digital

El componente del reloj digital es simple pero efectivo, actualizándose cada segundo y formateando la hora de manera atractiva:

```jsx
const DigitalClock = ({ className = '' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <div className={`glass-morphism rounded-2xl p-4 md:p-5 shadow-xl ${className}`}>
      <div className="flex items-center justify-center">
        <div className="font-clock text-5xl md:text-6xl lg:text-7xl font-bold text-center flex items-center text-white drop-shadow-lg">
          <div className="flex-shrink-0 w-auto">
            <span className="inline-block min-w-[2ch] text-center">{hours}</span>
          </div>
          <div className="flex-shrink-0 w-auto px-1 md:px-2 text-primary">
            <span className="inline-block">:</span>
          </div>
          <div className="flex-shrink-0 w-auto">
            <span className="inline-block min-w-[2ch] text-center">{minutes}</span>
          </div>
          <div className="flex-shrink-0 w-auto self-start ml-1 md:ml-2 mt-2">
            <span className="text-2xl md:text-3xl lg:text-4xl text-secondary opacity-80">{seconds}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Sistema de caché para datos climáticos

Para evitar hacer demasiadas peticiones a la API de clima, implementé un sistema de caché que guarda los datos durante 10 minutos:

```javascript
// Caché para los datos del clima
const weatherCache = {
  data: null,
  timestamp: 0,
  TTL: 10 * 60 * 1000 // 10 minutos en milisegundos
};

// Función para obtener datos con caché
export const fetchWeatherWithCache = async () => {
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
    
    // Construir URL con parámetros
    let url = 'https://devline.app/clock/api/weather.php';
    
    // Si hay configuración personalizada, usar endpoint v02
    if (apiKey && placeId) {
      url = `https://devline.app/clock/api/weather-v02.php?api_key=${encodeURIComponent(apiKey)}&place_id=${encodeURIComponent(placeId)}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Actualizar caché
    weatherCache.data = data;
    weatherCache.timestamp = now;
    
    return data;
  } catch (error) {
    throw error;
  }
};
```

### Visualización del progreso del año

Un detalle interesante es el cálculo y visualización del progreso del año:

```jsx
const calculateYearProgress = () => {
  const dayOfYear = getDayOfYear(currentDate);
  const isLeapYear = new Date(currentDate.getFullYear(), 1, 29).getMonth() === 1;
  const totalDays = isLeapYear ? 366 : 365;
  return (dayOfYear / totalDays) * 100;
};

// En el renderizado mostramos una barra de progreso
<div className="w-full bg-gray-300 bg-opacity-20 rounded-full h-2.5">
  <div 
    className="bg-gradient-to-r from-secondary to-primary h-2.5 rounded-full"
    style={{ width: `${yearProgress}%` }}
  ></div>
</div>
<div className="text-xs text-right mt-1 text-gray-200">{Math.round(yearProgress)}% del año</div>
```

## 🚀 Cómo empezar a usar ClockTab

### Opción 1: Usar la versión online

La forma más sencilla es acceder directamente a [clock-tab.cubitdev.com](https://clock-tab.cubitdev.com) desde cualquier navegador. Puedes:

- Añadirla a favoritos
- Configurarla como página de inicio
- Instalarla como aplicación (PWA) haciendo clic en el botón de instalación en la barra de direcciones (o en "Añadir a pantalla de inicio" en dispositivos móviles)

### Opción 2: Instalar localmente

Si prefieres tener tu propia instancia, puedes descargar e instalar el código:

1. Clona el repositorio: `git clone https://github.com/cubitdev/clock-tab.git`
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`
4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador

### Opción 3: Personalizarlo para tu proyecto

Si quieres usar ClockTab como base para tu propio proyecto:

1. Descarga el código fuente
2. Modifica los componentes, estilos y funcionalidades según tus necesidades
3. Puedes reemplazar la API de clima por tu propia fuente de datos

## 🔧 Personalización y configuración

ClockTab permite personalizar la API de clima para mostrar información de tu ciudad:

1. Regístrate en [Meteosource](https://meteosource.com) para obtener una API key gratuita
2. En la aplicación, haz clic en el botón de configuración (⚙️) en la esquina inferior izquierda
3. Ingresa tu API key y el nombre de tu ciudad
4. ¡Listo! La aplicación ahora mostrará el clima de tu localidad

![Configuración de API](/screenshots/api-config.png)

## 🎯 Lecciones aprendidas durante el desarrollo

Durante el desarrollo de ClockTab, aprendí varias lecciones importantes:

1. **Diseño responsivo avanzado**: Más allá del típico enfoque mobile-first, aprendí a crear diferentes layouts basados en la orientación del dispositivo.

2. **Optimización de peticiones API**: Implementar un sistema de caché para reducir las llamadas a la API, respetando los límites de uso y mejorando el rendimiento.

3. **Efectos visuales con CSS moderno**: El uso de glass-morphism, animaciones sutiles y transiciones suaves mejoran enormemente la experiencia de usuario sin sobrecargar la interfaz.

4. **Service Workers y PWA**: Configurar una aplicación para que funcione offline y sea instalable como PWA, lo que mejora la retención de usuarios.

5. **Gestión de estado en React**: Uso efectivo de useState y useEffect para manejar diferentes aspectos de la aplicación de manera clara y organizada.

## 🔍 Próximas mejoras

Tengo planificadas varias mejoras para futuras versiones:

- Soporte para múltiples ubicaciones (guardar varias ciudades)
- Alarmas y temporizadores
- Integración con calendarios
- Widgets personalizables
- Más temas visuales

## 🤝 Contribuyendo al proyecto

¡Las contribuciones son bienvenidas! Si quieres mejorar ClockTab:

1. Haz fork del repositorio
2. Crea una rama para tu característica: `git checkout -b feature/nueva-funcion`
3. Haz commit de tus cambios: `git commit -m 'Añade nueva función'`
4. Envía un pull request

También puedes:
- Reportar bugs
- Sugerir nuevas funcionalidades
- Mejorar la documentación

## 📝 Conclusión

ClockTab es un proyecto que demuestra cómo se pueden crear aplicaciones web modernas, atractivas y útiles utilizando tecnologías frontend actuales. Aunque es un proyecto relativamente simple, incorpora muchas buenas prácticas de desarrollo web y ofrece una experiencia de usuario pulida.

Te invito a probar la aplicación en [clock-tab.cubitdev.com](https://clock-tab.cubitdev.com), explorar el código en [GitHub](https://github.com/cubitdev/clock-tab) y adaptarlo para tus propios proyectos.

---

¿Has creado alguna vez una aplicación web similar? ¿Qué otras funcionalidades te gustaría ver en ClockTab? ¡Déjame tus comentarios!

**Autor**: [Tu nombre] de [CubitDev](https://cubitdev.com)  
**Fecha de publicación**: [Fecha]
