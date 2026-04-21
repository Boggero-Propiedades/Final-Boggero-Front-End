import { useEffect, useRef, useState } from "react";
import logo from "../../public/logos/DeepDevLogo.jpg"
import "./registerCorporate.css";
import { UseLanguage } from "../contexts/LanguageContext";
import { UseTheme } from "../contexts/ThemeContext";
import eyeClose from "/logos/eye-close.svg"
import eyeOpen from "/logos/eye-open.svg"
import { UseSession } from "../contexts/SessionContext";
import Loader from "../loader/Loader";
import Error from "../processMessages/Error";

const RegisterCorporate = ({ openLogin, closeRegister }: any) => {
    const { language, texts } = UseLanguage()  
    const { handleRegister, loading, error } = UseSession()
    const { theme } = UseTheme()
    const registerRef = useRef<HTMLDivElement>(null);

    const [ exit, setExit ] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ password2, setPassword2 ] = useState("");
    const [ passwordError, setPasswordError ] = useState<string>("");
    const [ showRequirements, setShowRequirements ] = useState(false);
    const [ visiblePassword, setVisiblePassword ] = useState<boolean>(false)

    const handleClose = () => {
        setExit(true);
        setTimeout(closeRegister, 600);
    };
    // Pass Requerida
    const passwordRequirements = [
        { label: `${texts[language].register.reqMinChars}`, test: (pass: string) => pass.length >= 10 },
        { label: `${texts[language].register.reqUpper}`, test: (pass: string) => /[A-Z]/.test(pass) },
        { label: `${texts[language].register.reqNumber}`, test: (pass: string) => /\d/.test(pass) },
        { label: `${texts[language].register.reqSpecial}`, test: (pass: string) => /[@$!%*?&]/.test(pass) },
    ];

    // Form Válido
    const isFormValid = email.includes("@") && password.length >= 10 && password === password2 && !passwordError;
    
    // Regex Pass
    const validatePassword = (pass: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    if (!regex.test(pass)) {
        {/* ERROR CODIFICACIÓN */}
        setPasswordError(`${texts[language].register.passError}`);
        return false;
    }
    setPasswordError("");
    return true;
};

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (registerRef.current && !registerRef.current.contains(e.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if(loading) return <Loader />
    if(error)return <Error errorMessage={`${texts[language].register.errorRegister}`} />

    return (
    <div className={`reg-corp-overlay ${exit ? "reg-corp-fade-out" : ""}`}>
        <div 
            ref={registerRef} 
            className={`reg-corp-panel ${theme === 'light' ? 'light' : 'dark'} ${exit ? "reg-corp-exit" : ""}`}
        >
            {/* Cabecera idéntica al Navbar Mobile */}
            <div className="reg-corp-header">
                <span className="reg-corp-panel-title">{texts[language].register.title}</span>
                <button className="reg-corp-close-btn" onClick={handleClose}>✕</button>
            </div>

            <div className="reg-corp-content">
                <img className="reg-corp-logo" src={logo} alt="logo" />

                <h2 className="reg-title">Creá tu Cuenta</h2>
                
                <form className="reg-corp-form" onSubmit={(e) => {
                    e.preventDefault(); 
                    if (!validatePassword(password)) return; 
                    handleRegister(email, password, openLogin, closeRegister)
                }}>
                    
                    {/* PASO 01 */}
                    <div className="reg-corp-input-wrapper">
                        <span className="reg-corp-number">01</span>
                        <div className="reg-corp-group">
                            <label>{texts[language].register.email}</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" />
                        </div>
                    </div>

                    {/* PASO 02 */}
                    <div className="reg-corp-input-wrapper">
                        <span className="reg-corp-number">02</span>
                        <div className="reg-corp-group">
                            <label>{texts[language].register.password}</label>
                            <div className="reg-corp-pass-field">
                                <input 
                                    type={visiblePassword ? "text" : "password"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    onFocus={() => setShowRequirements(true)} 
                                    onBlur={() => setShowRequirements(false)} 
                                    required 
                                />
                                <img 
                                    className="reg-corp-eye" 
                                    src={visiblePassword ? eyeClose : eyeOpen} 
                                    onClick={() => setVisiblePassword(!visiblePassword)} 
                                    alt="toggle-password" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* REQUISITOS (Llenan el espacio vacío) */}
                    {showRequirements && (
                        <div className="reg-corp-req-box">
                            {passwordRequirements.map((req, index) => {
                                const isMet = req.test(password);
                                return (
                                    <div key={index} className={`reg-corp-req-item ${isMet ? 'met' : ''}`}>
                                        <span className="reg-corp-req-icon">{isMet ? "✓" : "○"}</span>
                                        {req.label}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* PASO 03 */}
                    <div className="reg-corp-input-wrapper">
                        <span className="reg-corp-number">03</span>
                        <div className="reg-corp-group">
                            <label>{texts[language].register.verifyPassword}</label>
                            <input 
                                type={visiblePassword ? "text" : "password"} 
                                value={password2} 
                                onChange={(e) => setPassword2(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    {/* MENSAJES DE ERROR */}
                    {(password !== password2 && password2 !== "") && <span className="reg-corp-error">{texts[language].register.passMismatch}</span>}
                    {passwordError && <span className="reg-corp-error">{passwordError}</span>}

                    <button 
                        type="submit" 
                        className="reg-corp-submit-btn"  
                        disabled={!isFormValid}
                    >
                        {texts[language].register.btnRegister}
                    </button>
                </form>
            </div>

            {/* Footer estilo extra-actions */}
            <div className="reg-corp-footer">
                <div className="reg-corp-footer-label">{texts[language].register.footerText}</div>
                <button className="reg-corp-auth-link" onClick={openLogin}>
                    {texts[language].register.footerLink}
                </button>
            </div>

        </div>
    </div>
);
};

export default RegisterCorporate;