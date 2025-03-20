// src/components/DateDisplay.jsx
import { useState, useEffect } from 'react';

const DateDisplay = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString(navigator.language || 'es-ES', options);
  };

  const getDayOfYear = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const calculateYearProgress = () => {
    const dayOfYear = getDayOfYear(currentDate);
    const isLeapYear = new Date(currentDate.getFullYear(), 1, 29).getMonth() === 1;
    const totalDays = isLeapYear ? 366 : 365;
    return (dayOfYear / totalDays) * 100;
  };

  const weekOfYear = Math.ceil(getDayOfYear(currentDate) / 7);
  const dayOfYear = getDayOfYear(currentDate);
  const formattedDate = formatDate(currentDate);
  const yearProgress = calculateYearProgress();
  
  // Primera letra en mayúscula
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="glass-morphism rounded-2xl p-6 shadow-lg text-white">
      <h2 className="text-2xl md:text-3xl font-display font-semibold text-center mb-3">{capitalizedDate}</h2>
      
      <div className="flex justify-between items-center text-sm md:text-base mb-4">
        <span className="badge badge-secondary py-2 px-3">Semana {weekOfYear}</span>
        <span className="badge badge-primary py-2 px-3">Día {dayOfYear}</span>
      </div>
      
      <div className="w-full bg-gray-300 bg-opacity-20 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-secondary to-primary h-2.5 rounded-full"
          style={{ width: `${yearProgress}%` }}
        ></div>
      </div>
      <div className="text-xs text-right mt-1 text-gray-200">{Math.round(yearProgress)}% del año</div>
    </div>
  );
};

export default DateDisplay;