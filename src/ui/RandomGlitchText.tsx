import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import "./randomGlitchText.css"

const RandomGlitchText = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const letters = containerRef.current.querySelectorAll('.glitch-letter');

    const animateRandomLetter = () => {
      // Elegimos una letra al azar
      const randomIndex = Math.floor(Math.random() * letters.length);
      const letter = letters[randomIndex];
      
      // Elegimos un tipo de animación al azar (0: Subir/Bajar, 1: Lado a Lado)
      const animType = Math.floor(Math.random() * 2);

      if (animType === 0) {
        // Efecto: Sube y vuelve a aparecer desde abajo
        gsap.to(letter, {
          y: -20,
          opacity: 0,
          duration: 0.1,
          onComplete: () => {
            gsap.fromTo(letter, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
          }
        });
      } else {
        // Efecto: Se va por la derecha y entra por la izquierda
        gsap.to(letter, {
          x: 15,
          opacity: 0,
          duration: 0.1,
          onComplete: () => {
            gsap.fromTo(letter, { x: -25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 });
          }
        });
      }

      // Volver a llamar a la función en un tiempo aleatorio (entre 0.5s y 2s)
      gsap.delayedCall(gsap.utils.random(0.5, 2), animateRandomLetter);
    };

    // Iniciar el ciclo
    animateRandomLetter();

    return () => {
      gsap.killTweensOf(animateRandomLetter);
    };
  }, [text]);

  return (
    <div ref={containerRef} className="glitch-word-container">
      {text.split("").map((char, i) => (
        <span key={i} className="glitch-letter" style={{ display: 'inline-block' }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
};

export default RandomGlitchText;
