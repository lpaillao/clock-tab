// src/components/DigitalClock.jsx
import { useState, useEffect } from 'react';

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

export default DigitalClock;