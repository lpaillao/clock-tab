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
    // Construir URL para la API externa
    const url = `https://www.meteosource.com/api/v1/free/point?place_id=${default_place_id}&sections=all&timezone=UTC&language=es&units=metric&key=${default_api_key}`;
    
    // Realizar petición a la API externa
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error en la API externa: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      error: `Error obteniendo datos del clima: ${error.message}` 
    });
  }
}
