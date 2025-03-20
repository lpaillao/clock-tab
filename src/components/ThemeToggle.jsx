const ThemeToggle = ({ theme, toggleTheme }) => {
  // Manejar pantalla completa
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Entrar en pantalla completa
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error al intentar mostrar pantalla completa: ${err.message}`);
      });
    } else {
      // Salir de pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="glass-morphism px-3 py-2 rounded-full inline-flex items-center">
      {/* Botón de tema */}
      <button
        className="btn btn-circle btn-sm"
        onClick={toggleTheme}
        aria-label="Cambiar tema"
      >
        {theme === 'weather-light' ? (
          <i className="fas fa-moon text-primary"></i>
        ) : (
          <i className="fas fa-sun text-accent"></i>
        )}
      </button>
      <span className="ml-2 text-sm text-white">
        {theme === 'weather-light' ? 'Modo oscuro' : 'Modo claro'}
      </span>

      {/* Separador */}
      <div className="mx-2 h-6 w-px bg-white/20"></div>

      {/* Botón de pantalla completa */}
      <button
        className="btn btn-circle btn-sm"
        onClick={toggleFullscreen}
        aria-label="Pantalla completa"
      >
        <i className="fas fa-expand text-primary"></i>
      </button>
      <span className="ml-2 text-sm text-white">Pantalla completa</span>
    </div>
  );
};

export default ThemeToggle;
