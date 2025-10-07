import React, { useEffect } from 'react';

// Interface pour AOS
declare global {
  interface Window {
    AOS: {
      init: (options: any) => void;
      refresh: () => void;
    };
  }
}

const AOSInitializer: React.FC = () => {
  useEffect(() => {
    // Attendre que AOS soit chargé
    const initAOS = () => {
      if (typeof window !== 'undefined' && window.AOS) {
        window.AOS.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
          mirror: false,
          offset: 100,
          delay: 0
        });
      } else {
        // Si AOS n'est pas encore chargé, réessayer dans 100ms
        setTimeout(initAOS, 100);
      }
    };

    initAOS();

    // Nettoyer lors du démontage
    return () => {
      if (typeof window !== 'undefined' && window.AOS) {
        window.AOS.refresh();
      }
    };
  }, []);

  return null; // Ce composant ne rend rien
};

export default AOSInitializer;
