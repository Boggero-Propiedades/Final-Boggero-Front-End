import { motion, useSpring, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import "./floatingIcon.css"

const floatAnimation = {
    y: [0, -10, 0, 10, 0],
    x: [0, 6, 0, -6, 0],
}

const FloatingIcon = ({ src, delay, translateX, translateY }: any) => {
    const imgRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: imgRef,
        offset: ["start end", "end start"]
    });

    const rawX = useTransform(scrollYProgress, [0, 0.4, 1], [200, 0, 0]);
    const rawOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
    
    const x = useSpring(rawX, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity = useSpring(rawOpacity, { stiffness: 50, damping: 25 });

    return(
        <motion.img className="img-floating" ref={imgRef} src={src} animate={floatAnimation} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
            style={{ translateX: translateX, translateY: translateY, opacity, x }}
        />
    )
};

export default FloatingIcon;