import React, { useEffect, useRef } from 'react';
import { UseTheme } from '../../contexts/ThemeContext';

interface GridBackgroundProps {
  children?: React.ReactNode;
  squareSize?: number;
}

interface Cell {
  x: number;
  y: number;
  alpha: number;
  fading: boolean;
  lastTouched: number;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ children, squareSize = 80 }) => {
  const { theme } = UseTheme();
  const gridColor = theme === "dark" ? "0, 255, 204" : "71, 209, 31";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grid = useRef<Cell[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustamos el canvas siempre al tamaño de la VENTANA (viewport)
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      grid.current = [];
      for (let x = 0; x < canvas.width; x += squareSize) {
        for (let y = 0; y < canvas.height; y += squareSize) {
          grid.current.push({
            x, y, alpha: 0, fading: false, lastTouched: 0,
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Importante: Usamos clientX/Y porque el canvas es FIXED
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const cell = grid.current.find(
        (c) =>
          mouseX >= c.x && mouseX < c.x + squareSize &&
          mouseY >= c.y && mouseY < c.y + squareSize
      );

      if (cell && cell.alpha === 0) {
        cell.alpha = 1;
        cell.lastTouched = Date.now();
        cell.fading = false;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      grid.current.forEach((cell) => {
        if (cell.alpha > 0 && !cell.fading && now - cell.lastTouched > 500) {
          cell.fading = true;
        }

        if (cell.fading) {
          cell.alpha -= 0.02;
          if (cell.alpha <= 0) {
            cell.alpha = 0;
            cell.fading = false;
          }
        }

        if (cell.alpha > 0) {
          const centerX = cell.x + squareSize / 2;
          const centerY = cell.y + squareSize / 2;

          const gradient = ctx.createRadialGradient(
            centerX, centerY, 5,
            centerX, centerY, squareSize
          );
          gradient.addColorStop(0, `rgba(${gridColor}, ${cell.alpha})`);
          gradient.addColorStop(1, `rgba(${gridColor}, 0)`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.6;
          ctx.strokeRect(cell.x + 0.5, cell.y + 0.5, squareSize - 1, squareSize - 1);
        }
      });

      requestRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', updateSize);
    window.addEventListener('mousemove', handleMouseMove);
    
    updateSize();
    requestRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [squareSize, gridColor]);

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        minHeight: '100vh',
        backgroundColor: theme === "dark" ? "#050505" : "#e0e5e0",
      }}
    >
      {/* El Canvas ahora es FIXED: no se mueve con el scroll */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'block',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      
      {/* El contenido fluye normalmente */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default GridBackground;