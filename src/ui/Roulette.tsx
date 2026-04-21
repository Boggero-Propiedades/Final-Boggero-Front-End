/* import React, { useEffect, useRef, useState } from 'react';
import "./roulette.css"

interface RouletteProps {
    prizes?: string[];
    colors?: string[];
}

const Roulette: React.FC<RouletteProps> = ({
    prizes = ["Premio 1", "Premio 2", "Suerte", "Premio 3", "X2 Puntos", "Premio 4"],
    colors = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"]
    }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        drawWheel();
    }, [prizes]);

    const drawWheel = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = canvas.width;
        const center = size / 2;
        const sliceAngle = (2 * Math.PI) / prizes.length;

        ctx.clearRect(0, 0, size, size);

        prizes.forEach((prize, i) => {
        const angle = i * sliceAngle;
        
        // Dibujar tajada
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(center, center);
        ctx.arc(center, center, center, angle, angle + sliceAngle);
        ctx.fill();

        // Texto
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Inter, system-ui, sans-serif";
        ctx.fillText(prize, center - 20, 10);
        ctx.restore();
        });
    };

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);

        const extraSpins = 5 + Math.floor(Math.random() * 5);
        const randomAngle = Math.floor(Math.random() * 360);
        const newRotation = rotation + (extraSpins * 360) + randomAngle;
        
        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            const actualDeg = newRotation % 360;
            const prizeIndex = Math.floor((360 - (actualDeg % 360)) / (360 / prizes.length)) % prizes.length;
            setResult(prizes[prizeIndex]);
        }, 4000);
    };

    return (
        <div className="ruleta-container">
        <div className="wheel-wrapper">
            <div className="marker" />
            <canvas 
            ref={canvasRef} 
            width={400} 
            height={400} 
            className="wheel-canvas"
            style={{ transform: `rotate(${rotation}deg)` }}
            />
        </div>
        
        <div className="controls">
            <button 
            className="btn-spin" 
            onClick={spinWheel} 
            disabled={isSpinning}
            >
            {isSpinning ? 'Sorteando...' : '¡GIRAR AHORA!'}
            </button>
            <h2 className={`result-text ${result ? 'show' : ''}`}>
            {result ? `🎉 ¡Ganaste: ${result}! 🎉` : '¿Probamos suerte?'}
            </h2>
        </div>
        </div>
    );
};

export default Roulette; */