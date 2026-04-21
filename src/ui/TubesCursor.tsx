import React, { useEffect, useRef } from 'react';
import Tubes from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js';
import "./tubesCursor.css";
import { UseWidth } from '../contexts/WidthContext';

const TubesCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<any>(null);
  const { width } = UseWidth()

  useEffect(() => {
    if (canvasRef.current && !appRef.current) {
      appRef.current = Tubes(canvasRef.current, {
        tubes: {
          radius: 0.02,     // 0.02 es ideal para líneas finas y tecnológicas.
          segments: 64,
          colors: ['#f967fb', '#53bc28', '#6958d5'],
          lights: {
            intensity: width >= 768 ? 60 : 20,
            colors: ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5'],
          },
        },
      });
    }

    const handleClick = () => {
        if (appRef.current) {
          // cambia de color al hacer clic en cualquier parte
          const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
          appRef.current.tubes.setColors([randomColor()]);
        }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      if (appRef.current?.destroy) appRef.current.destroy();
    };
  }, []);
  
  return (
    <canvas id="tubes-cursor-canvas"  ref={canvasRef}></canvas>
  );
};

export default TubesCursor;