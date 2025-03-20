<?php
// api/weather.php
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
    
    // Esta versión simplemente llama al endpoint original sin parámetros
    $url = "https://www.meteosource.com/api/v1/free/point?place_id={$default_place_id}&sections=all&timezone=UTC&language=es&units=metric&key={$default_api_key}";

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
    
    curl_close($ch);
    
    return $response;
}

echo getWeather();
