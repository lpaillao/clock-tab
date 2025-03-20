export default async function handler(req, res) {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Request-With');
  
  // Manejar solicitudes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Valores predeterminados
  const default_api_key = "94hw2mqup976o5y7k3q53aczi9a3c5zdbwxdz0lb";
  const default_place_id = "temuco";
  
  try {
    // Obtener parámetros de la solicitud
    const api_key = req.query.api_key || default_api_key;
    const place_id = req.query.place_id || default_place_id;
    
    // Construir URL para la API externa
    const url = `https://www.meteosource.com/api/v1/free/point?place_id=${encodeURIComponent(place_id)}&sections=all&timezone=UTC&language=es&units=metric&key=${encodeURIComponent(api_key)}`;
    
    // Realizar petición a la API externa
    const response = await fetch(url);
    
    // Verificar errores de autenticación o ubicación no válida
    if (response.status === 401 || response.status === 403) {
      return res.status(response.status).json({
        error: 'API key no válida. Por favor verifique su clave de API.',
        status: response.status
      });
    } else if (response.status === 404) {
      return res.status(404).json({
        error: 'Ubicación no encontrada. Por favor verifique el ID de la ubicación.',
        status: 404
      });
    } else if (!response.ok) {
      return res.status(response.status).json({
        error: `Error en la respuesta de la API de clima: Código ${response.status}`,
        status: response.status
      });
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      error: `Error obteniendo datos del clima: ${error.message}` 
    });
  }
}
