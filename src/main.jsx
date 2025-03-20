import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Registrar service worker para PWA si existe
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(error => {
      console.log('Service worker registration failed:', error);
    });
  });
}

// Detectar preferencia de tema del sistema
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
if (prefersDarkScheme.matches) {
  document.documentElement.setAttribute('data-theme', 'weather-dark');
}

// Guardar cambios de tema
window.saveTheme = (theme) => {
  localStorage.setItem('clocktab-theme', theme);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
