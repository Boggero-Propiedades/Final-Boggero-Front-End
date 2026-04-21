import { useEffect, useRef, useState } from "react";
import logo from "../../public/logos/DeepDevLogo.jpg"
import "./loginCorporate.css";
import { UseLanguage }   from "../contexts/LanguageContext";
import { UseTheme } from "../contexts/ThemeContext";
import eyeClose from "/logos/eye-close.svg"
import eyeOpen from "/logos/eye-open.svg"
import { UseSession } from "../contexts/SessionContext";
import Loader from "../loader/Loader";

interface LoginProps {
  openRegister: () => void;
  closeLogin: () => void
}

const LoginCorporate = ({ closeLogin, openRegister }: LoginProps) => {
    const { language, texts } = UseLanguage()  
    const { theme } = UseTheme()
    const { handleLogin, loading, error, handleResetPassword } = UseSession()
    const loginRef = useRef<HTMLDivElement>(null);

    const [ exit, setExit ] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ visiblePassword, setVisiblePassword ] = useState<boolean>(false)

    const handleClose = () => {
        setExit(true);
        setTimeout(() => {
            closeLogin(); 
        }, 500);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
                handleClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await handleLogin(email, password); 
        if (response) {
            closeLogin();
        }
    }

    if(loading) return <Loader />

    return (
        <div className={`log-corp-overlay ${exit ? "log-corp-fade-out" : ""}`}>
            <div 
                ref={loginRef} 
                className={`log-corp-panel ${theme === 'light' ? 'light' : 'dark'} ${exit ? "log-corp-exit" : ""}`}
            >
                {/* Cabecera estilo Navbar */}
                <div className="log-corp-header">
                    <span className="log-corp-panel-title">{texts[language].login.title}</span>
                    <button className="log-corp-close-btn" onClick={handleClose}>✕</button>
                </div>

                <div className="log-corp-content">
                    <img className="log-corp-logo" src={logo} alt="logo" />

                    <h2 className="log-title">Bienvenido a Boggero Propiedades</h2>
                    
                    <form className="log-corp-form" onSubmit={loginSubmit}>
                        
                        {/* PASO 01: Email */}
                        <div className="log-corp-input-wrapper">
                            <span className="log-corp-number">01</span>
                            <div className="log-corp-group">
                                <label htmlFor="email">{texts[language].login.email}</label>
                                <input 
                                    id="email" 
                                    type="email" 
                                    placeholder="ejemplo@empresa.com"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* PASO 02: Password */}
                        <div className="log-corp-input-wrapper">
                            <span className="log-corp-number">02</span>
                            <div className="log-corp-group">
                                <label htmlFor="password">{texts[language].login.password}</label>
                                <div className="log-corp-pass-field">
                                    <input 
                                        id="password" 
                                        type={visiblePassword ? "text" : "password"} 
                                        placeholder="••••••••"
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                    <img 
                                        className="log-corp-eye" 
                                        src={visiblePassword ? eyeClose : eyeOpen} 
                                        alt="toggle" 
                                        onClick={() => setVisiblePassword(!visiblePassword)}
                                    />
                                </div>
                                <span className="log-corp-forgot" onClick={() => handleResetPassword(email)}>
                                    {texts[language].login.forgot}
                                </span>
                            </div>
                        </div>

                        {error && <p className="log-corp-error-msg">{error}</p>}

                        <button type="submit" className="log-corp-submit-btn">
                            {texts[language].login.button}
                        </button>
                    </form>
                </div>

                {/* Footer estilo extra-actions */}
                <div className="log-corp-footer">
                    <div className="log-corp-footer-label">{texts[language].login.register.before}</div>
                    <button className="log-corp-auth-link" onClick={openRegister}>
                        {texts[language].login.register.after}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginCorporate;