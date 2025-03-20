# ClockTab - Reloj y Clima en Tiempo Real

![ClockTab Banner](/screenshots/banner.jpg)

ClockTab es una elegante aplicación web que muestra la hora actual, fecha y condiciones climáticas con un diseño moderno y adaptable. Perfecta para usar como página de inicio o nueva pestaña en tu navegador.

## 🌟 Características

- ⏰ Reloj digital de alta precisión
- 📅 Visualización de fecha con progreso del año
- 🌤️ Widget de clima en tiempo real
- 🌡️ Pronóstico semanal de clima
- 💨 Indicador de calidad del aire
- 🌓 Temas claro y oscuro
- 🖼️ Fondos dinámicos según clima y hora del día
- 📱 Diseño completamente responsive (móvil, tablet y escritorio)
- 🌐 Soporte para PWA (instalable como aplicación)
- 🔄 Cambio automático a modo nocturno
- 🌎 Personalización de ubicación para datos meteorológicos

## 📋 Requisitos

- Node.js 16.0 o superior
- NPM o Yarn
- Servidor web (Apache/Nginx) para producción
- Acceso a la API de Meteosource (opcional, para personalización)

## ⚙️ Instalación

### Desarrollo Local

1. Clona este repositorio:
   ```bash
   git clone https://github.com/cubitdev/clock-tab.git
   cd clock-tab
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o con yarn
   yarn install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o con yarn
   yarn dev
   ```

4. Abre tu navegador en `http://localhost:5173`

### Despliegue en Producción

1. Construye la aplicación para producción:
   ```bash
   npm run build
   # o con yarn
   yarn build
   ```

2. Copia el contenido de la carpeta `dist` a tu servidor web:
   ```bash
   # Ejemplo con servidor Apache
   cp -r dist/* /var/www/html/clock-tab/
   ```

3. Configura tu servidor web para servir la aplicación. Para Apache, puedes crear un archivo `.htaccess` en la carpeta raíz con el siguiente contenido:
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

4. Asegúrate de que los archivos PHP de la API tengan permisos de ejecución:
   ```bash
   chmod +x public/api/weather.php
   chmod +x public/api/weather-v02.php
   ```

## 🌐 Configuración de la API de Clima

ClockTab utiliza la API de Meteosource para obtener datos meteorológicos. Puedes usar la configuración por defecto o personalizarla para tu ubicación:

1. **Usando la configuración por defecto**:
   - La aplicación viene preconfigurada para mostrar el clima de una ubicación predeterminada
   - No se requieren pasos adicionales

2. **Personalizando tu ubicación y API key**:
   - Regístrate en [Meteosource](https://meteosource.com) para obtener una API key gratuita
   - En la aplicación, haz clic en el botón de configuración (⚙️) en la esquina inferior izquierda
   - Ingresa tu API key y el ID de tu ubicación (ej. "madrid", "new-york", "tokyo")
   - Guarda los cambios y la aplicación se actualizará automáticamente

## 🖥️ Uso de la Aplicación

- **Cambiar Tema**: Usa el botón de tema para alternar entre modo claro y oscuro
- **Pantalla Completa**: Utiliza el botón de pantalla completa o haz doble clic en cualquier parte de la pantalla
- **Cambiar Fondo**: Selecciona entre diferentes horas del día usando los botones en la parte inferior
- **Ver Pronóstico**: Navega por las pestañas en el widget de clima para ver información actual o por hora
- **Personalizar API**: Accede a la configuración mediante el botón de engranaje para cambiar ubicación

## 💾 Instalación como Aplicación (PWA)

ClockTab se puede instalar como una aplicación en tu dispositivo:

1. En navegadores compatibles, aparecerá un icono de instalación en la barra de direcciones
2. En dispositivos móviles, usa la opción "Añadir a pantalla de inicio" del menú del navegador
3. Una vez instalada, ClockTab funcionará incluso sin conexión a internet (con datos limitados)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Desarrollado por

ClockTab es una aplicación creada por [CubitDev](https://cubitdev.com).

Para más información y otros proyectos, visita [clock-tab.cubitdev.com](https://clock-tab.cubitdev.com).

---

© 2025 CubitDev. Todos los derechos reservados.
