'use client';

import { useState, useEffect } from 'react';

const morphWords = [
  'tu CRM inteligente',
  'tu asistente de voz',
  'tu calendario fiscal',
  'tu portal de clientes',
  'tu e-commerce con IA',
  'tu próxima idea',
];

export default function MorphingTitle() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % morphWords.length);
        setIsVisible(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
      Nos transformamos en
      <br />
      <span
        className={`gradient-text morph-text inline-block transition-all duration-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {morphWords[currentIndex]}
      </span>
    </h1>
  );
}
