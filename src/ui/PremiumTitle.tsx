import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface PremiumTitleProps {
    text: string;
    className?: string;
}

const PremiumTitle: React.FC<PremiumTitleProps> = ({ text, className }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 }); // Se anima cuando el 50% es visible

    // Separamos el texto por palabras
    const words = text.split(" ");

    // Configuración de la animación del contenedor (padre)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Retraso de 0.1s entre cada palabra (stagger)
                delayChildren: 0.2,   // Retraso inicial antes de empezar
            },
        },
    };

    // Configuración de la animación de cada palabra (hijo)
    const wordVariants = {
        hidden: { 
            opacity: 0, 
            y: "100%", // Empieza abajo, fuera de la máscara
            rotateX: 40 // Un ligero giro 3D para mayor sofisticación
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1], // Cubic Bezier ultra-suave (estilo Apple)
            },
        },
    };

    return (
        <motion.h2
            ref={ref}
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ perspective: "1000px" }} // Necesario para el efecto rotateX
        >
            {words.map((word, index) => (
                <span key={index} className="premium-word-wrapper">
                    <motion.span
                        variants={wordVariants}
                        className="premium-word"
                        style={{ display: "inline-block" }} // Importante para y: "100%"
                    >
                        {word}
                    </motion.span>
                    {/* Añadimos el espacio que quitamos al hacer split */}
                    <span className="premium-space">&nbsp;</span> 
                </span>
            ))}
        </motion.h2>
    );
};

export default PremiumTitle;