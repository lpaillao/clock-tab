import { useState, useEffect } from 'react';

const ConfigModal = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Cargar configuración desde localStorage
    if (isOpen) {
      const savedApiKey = localStorage.getItem('weatherApiKey') || '';
      const savedPlaceId = localStorage.getItem('weatherPlaceId') || '';
      
      setApiKey(savedApiKey);
      setPlaceId(savedPlaceId);
      setError('');
    }
  }, [isOpen]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!apiKey.trim()) {
      setError('Por favor ingrese una API key');
      return;
    }
    
    if (!placeId.trim()) {
      setError('Por favor ingrese un ID de ubicación (ciudad)');
      return;
    }
    
    // Validar la configuración haciendo una prueba a la API
    setIsLoading(true);
    
    try {
      // Usar el nuevo endpoint v02 para la validación
      const testUrl = `https://devline.app/clock/api/weather-v02.php?api_key=${encodeURIComponent(apiKey)}&place_id=${encodeURIComponent(placeId)}`;
      
      const response = await fetch(testUrl);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setIsLoading(false);
        return;
      }
      
      // Guardar en localStorage si la API responde correctamente
      localStorage.setItem('weatherApiKey', apiKey);
      localStorage.setItem('weatherPlaceId', placeId);
      
      // Informar al componente padre
      onSave({ apiKey, placeId });
      setIsLoading(false);
      onClose();
      
    } catch (err) {
      setError('Error al validar la configuración: ' + err.message);
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="glass-morphism rounded-xl w-full max-w-md p-6 relative">
        <button 
          className="absolute top-2 right-2 text-white hover:text-red-500"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
        
        <h2 className="text-xl font-bold text-white mb-4">Configuración de API de Clima</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              API Key <span className="text-xs opacity-70">(Meteosource.com)</span>
            </label>
            <input 
              type="text"
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2"
              placeholder="Ingrese su API key de Meteosource"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              ID de Ubicación (Ciudad)
            </label>
            <input 
              type="text"
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2"
              placeholder="ej: santiago, london, new-york"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
            />
            <p className="text-xs text-white/70 mt-1">
              Ingrese el nombre de la ciudad en inglés, sin acentos.
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-2 bg-red-500/20 text-white rounded">
              {error}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="btn btn-ghost text-white"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs mr-2"></span>
                  Validando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
          
          <div className="mt-6 text-xs text-white/70 bg-black/20 p-3 rounded">
            <p className="font-semibold mb-1">¿Cómo obtener su API Key?</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Visite <a href="https://meteosource.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">meteosource.com</a></li>
              <li>Regístrese para obtener una cuenta gratuita</li>
              <li>Vaya a su panel de control y copie su API key</li>
              <li>La versión gratuita tiene límites de uso diario</li>
            </ol>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigModal;
