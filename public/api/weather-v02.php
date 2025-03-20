<?php
// api/weather-v02.php
// Permitir todas las solicitudes CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Manejar la solicitud OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit();
}

function getWeather() {
    // Valores predeterminados
    $default_api_key = "94hw2mqup976o5y7k3q53aczi9a3c5zdbwxdz0lb";
    $default_place_id = "temuco";
    
    // Obtener parámetros de la solicitud
    $api_key = isset($_GET['api_key']) && !empty($_GET['api_key']) ? $_GET['api_key'] : $default_api_key;
    $place_id = isset($_GET['place_id']) && !empty($_GET['place_id']) ? $_GET['place_id'] : $default_place_id;
    
    // Construir la URL con los parámetros proporcionados o predeterminados
    $url = "https://www.meteosource.com/api/v1/free/point?place_id=" . urlencode($place_id) . 
           "&sections=all&timezone=UTC&language=es&units=metric&key=" . urlencode($api_key);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    
    if(curl_errno($ch)){
        return json_encode([
            'error' => 'Error fetching weather data: ' . curl_error($ch)
        ]);
    }
    
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // Verificar si hay errores de autenticación o ubicación no válida
    if ($httpCode == 401 || $httpCode == 403) {
        return json_encode([
            'error' => 'API key no válida. Por favor verifique su clave de API.',
            'status' => $httpCode
        ]);
    } else if ($httpCode == 404) {
        return json_encode([
            'error' => 'Ubicación no encontrada. Por favor verifique el ID de la ubicación.',
            'status' => $httpCode
        ]);
    } else if ($httpCode != 200) {
        return json_encode([
            'error' => 'Error en la respuesta de la API de clima: Código ' . $httpCode,
            'status' => $httpCode
        ]);
    }
    
    return $response;
}

echo getWeather();
