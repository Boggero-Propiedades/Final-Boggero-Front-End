import { useEffect, useRef } from "react";
import "./ambientOverlay.css";
import { UseTheme } from "../contexts/ThemeContext";


const AmbientOverlay = () => {
    const { theme } = UseTheme()

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onMove = (e: PointerEvent) => {
        const x = e.clientX;
        const y = e.clientY;
        const w = window.innerWidth;
        const h = window.innerHeight;

        const nx = x / w;
        const ny = y / h;

        el.style.setProperty("--x", `${x}px`);
        el.style.setProperty("--y", `${y}px`);
        el.style.setProperty("--nx", nx.toString());
        el.style.setProperty("--ny", ny.toString());
        };

        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
    }, []);

    return <div className={theme === "dark" ? "ambient-overlay" : "ambient-overlay-light"} ref={ref} />;
};

export default AmbientOverlay;