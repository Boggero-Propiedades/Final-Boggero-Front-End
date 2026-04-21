import SalesCard from "./SalesCard";
import TubesCursor from "../ui/TubesCursor";
import { UseTheme } from "../contexts/ThemeContext";
import "./sales.css"

const Sales = () => {
    const { theme } = UseTheme();

    const plans = [
    {
        title: "Landing Basic",
        price: "219000",
        subtitle: "Tu primera huella digital",
        buttonText: "Contratar Ahora",
        features: [
            { text: "Interfaz de usuario moderna", included: true },
            { text: "Responsive para celulares", included: true },
            { text: "4 secciones personalizadas", included: true },
            { text: "Panel de administrador", included: true },
            { text: "Experiencia de usuario Pro", included: true },
            { text: "Formulario de contacto", included: true },
            { text: "Links a redes sociales", included: true },
            { text: "Reseñas de Google", included: true },
            { text: "Acceso a catálogo 3D", included: false },
            { text: "Chat-Bot Inteligencia Artificial", included: false },
            { text: "Optimización SEO Pro", included: false },
            { text: "Integración con Analytics", included: false },
            { text: "Modo Claro-Oscuro", included: false },
            { text: "Mailing profesional", included: false },
        ]
    },
    {
        title: "Landing Pro",
        price: "269000",
        subtitle: "Enfocada en conversiones",
        isPopular: true,
        buttonText: "Contratar Ahora",
        features: [
            { text: "Interfaz de usuario moderna", included: true },
            { text: "Responsive para celulares", included: true },
            { text: "Chat-Bot Inteligencia Artificial", included: true },
            { text: "5 secciones personalizadas", included: true },
            { text: "Optimización SEO avanzada", included: true },
            { text: "Integración con Analytics", included: true },
            { text: "Acceso a catálogo 3D", included: true },
            { text: "Links a redes sociales", included: true },
            { text: "Panel de administrador", included: true },
            { text: "Modo Claro-Oscuro", included: true },
            { text: "Mailing profesional", included: true },
            { text: "Experiencia de usuario Pro", included: true },
            { text: "Formulario de contacto", included: true },
            { text: "Reseñas de Google", included: true },
        ]
    },
    {
        title: "E-Commerce Basic",
        price: "369000",
        subtitle: "Empieza a vender online",
        buttonText: "Contratar Ahora",
        features: [
            { text: "Carga de hasta 50 productos", included: true },
            { text: "Carrito de compras intuitivo", included: true },
            { text: "Integración con Mercado Pago", included: true },
            { text: "Gestión de stock básica", included: true },
            { text: "Panel de administrador simple", included: true },
            { text: "Categorías personalizadas", included: true },
            { text: "Cálculo de envío automático", included: true },
            { text: "Responsive para celulares", included: true },
            { text: "Cupón de descuento inicial", included: true },
            { text: "Variaciones de producto (Talle/Color)", included: false },
            { text: "Recuperación de carritos abandonados", included: false },
            { text: "Reportes de ventas avanzados", included: false },
            { text: "Mailing profesional", included: false },
        ]
    },
    {
        title: "E-Commerce Pro",
        price: "429000",
        subtitle: "Un ecosistema de ventas",
        buttonText: "Contratar Ahora",
        isPopular: true,
        features: [
            { text: "Productos ilimitados", included: true },
            { text: "Variaciones complejas (Talle, Color, Material)", included: true },
            { text: "Mailing profesional", included: true },
            { text: "Control de carritos abandonados", included: true },
            { text: "Sistema de reseñas de clientes", included: true },
            { text: "Chat-Bot Inteligencia Artificial", included: true },
            { text: "Integración con Google Analytics", included: true },
            { text: "Lista de deseos (Wishlist)", included: true },
            { text: "SEO avanzado para productos", included: true },
            { text: "Reportes de rendimiento detallados", included: true },
            { text: "Modo Claro-Oscuro", included: true },
            { text: "Panel de administración Pro", included: true },
        ]
    }
];

    return (
        <>
        
        <div className={`sales-page-container ${theme === "light" ? "theme-light" : "theme-dark"}`}>
            
            <div className={`dd-grid-overlay ${theme}`}></div> 
            <div className="sales-grid">
                {plans.map((plan, index) => (
                    <SalesCard key={index} {...plan} />
                ))}
            </div>
            <TubesCursor />
        </div>
        </>
    );
};

export default Sales;