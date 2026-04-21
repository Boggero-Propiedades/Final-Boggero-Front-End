import { useState, useEffect, useRef } from "react";
import "./navBarCorporate.css"
import LoginCorporate from "./LoginCorporate";
import moon from "/logos/moon2.svg"
import sun from "/logos/sun.svg"
import { UseLanguage } from "../contexts/LanguageContext";
import { UseTheme } from "../contexts/ThemeContext";
import { UseSession } from "../contexts/SessionContext";
import NavBarCorporateMobile from "./NavBarCorporateMobile";
import RegisterCorporate from "./RegisterCorporate";
import LiveTypingText from "../ui/LiveTypingText";

const NavBarCorporate = () => {
   // --- LÓGICA ORIGINAL PRESERVADA ---
    const [ openRegister, setOpenRegister ] = useState<boolean>(false)
    const [ loginOpen, setLoginOpen ] = useState(false);    
    const [ showPromo, setShowPromo ] = useState(true);
    const [ menuOpen, setMenuOpen ] = useState(false);

    const lastScrollY = useRef(0);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user, handleLogout } = UseSession()

    const { language, handleLanguage, texts } = UseLanguage()
    const { theme, handleTheme } = UseTheme()

    const openRegisterFromLogin = () => {
        setLoginOpen(false);
        setOpenRegister(true);
    };

    const openLoginFromRegister = () => {
        setLoginOpen(true);
        setOpenRegister(false);
    };

     // --- LÓGICA ROUND MORPH PROPIA DE ESCRITORIO ---
    const toggleThemeWithAnimation = (e: React.MouseEvent<HTMLButtonElement>) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Seteamos las variables en el documento para que el CSS las tome
        document.documentElement.style.setProperty('--x', `${x}px`);
        document.documentElement.style.setProperty('--y', `${y}px`);

        if (!document.startViewTransition) {
            handleTheme(theme === "dark" ? "light" : "dark");
            return;
        }

        document.startViewTransition(() => {
            handleTheme(theme === "dark" ? "light" : "dark");
        });
    };

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (menuOpen && menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.hamburger-btn')) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if( currentScroll > lastScrollY.current && currentScroll > 20){
                setShowPromo(false);
            } else {
                setShowPromo(true); 
            }
            lastScrollY.current = currentScroll
        }
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [language]);

    return (
        <>
        <section className={`nav-wrapper corporate-edition ${theme === "light" ? "theme-light" : "theme-dark"}`}>
            {/* BARRA DE ANUNCIOS (PROMO) */}
            <div className={`nav-promo ${showPromo ? "open" : "closed"}`}>
                <p className="text-promo"><LiveTypingText text="Bienvenido a Boggero Propiedades" /></p>
            </div>

            <header className="hero-header">
                <div className="left-actions">
                    <a href="/"><h4 className="logo-title">Boggero Propiedades</h4></a>
                </div>

                {/* NAVEGACIÓN DESKTOP */}
                <nav className="nav-desktop">
                    <ul>
                        {/* <li><a href="/products">Abogados</a></li> */}

                        <li><a href="/company">Compañía</a></li>
                        <li><a href="/contact">Contacto</a></li>
                        <li><a href="/method">Método</a></li>
                        {user && <li><a href="/dashboard" className="dashboard-link">Dashboard</a></li>}
                    </ul>   
                </nav>

                <div className="right-actions">
                    <div className="actions-desktop-group">
                        <button className="nav-buttons theme-btn" onClick={toggleThemeWithAnimation}>
                            <img src={theme === "dark" ? sun : moon} alt="theme-icon" width={18} />
                        </button>
                            
                        {/* <div className="select-wrapper">
                            <select className="nav-buttons lan-select" value={language} onChange={(e) => handleLanguage(e.target.value)}>
                                <option value="es">ES</option>
                                <option value="en">EN</option>
                                <option value="it">IT</option>
                                <option value="de">DE</option>
                                <option value="fr">FR</option>
                                <option value="ru">RU</option>
                            </select>
                        </div> */}

                        {user ? 
                            <button onClick={() => handleLogout()} className="nav-buttons logout-btn">Cerrar Sesión</button>
                            :
                            <button onClick={() => setLoginOpen(true)} className="nav-buttons login-btn">{texts[language].nav.login}</button>
                        }
                    </div>

                    {/* MENÚ HAMBURGUESA MOBILE */}
                    <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
                        <span className={`bar ${menuOpen ? "open" : ""}`}></span>
                        <span className={`bar ${menuOpen ? "open" : ""}`}></span>
                        <span className={`bar ${menuOpen ? "open" : ""}`}></span>
                    </button>
                </div>
            </header>

            {/* MENÚ MOBILE DESPLEGABLE */}
            {menuOpen && (
                <NavBarCorporateMobile
                    ref={menuRef}
                    closeMenu={() => setMenuOpen(false)}
                    texts={texts}
                    language={language}
                    theme={theme}
                    toggleThemeWithAnimation={toggleThemeWithAnimation}
                    handleLanguage={handleLanguage}
                    openLogin={() => setLoginOpen(true)}
                />
            )}
        </section>

        { loginOpen && <LoginCorporate openRegister={openRegisterFromLogin} closeLogin={() => setLoginOpen(false)} /> }
        { openRegister && <RegisterCorporate openLogin={openLoginFromRegister} closeRegister={() => setOpenRegister(false)} /> }   
        </>
    );
}

export default NavBarCorporate;