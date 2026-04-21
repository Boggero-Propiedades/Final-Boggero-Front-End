import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti'; 
import './sorteoDev.css';
import ParticleButton from './ParticleButton';
import CountDown from './CountDown';
import { UseLanguage }   from '../contexts/LanguageContext';
import { UseTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import Error from '../processMessages/Error';
import Loader from '../loader/Loader';

const SorteoDev: React.FC = () => {
    const { language, texts } = UseLanguage() as { texts: Record<string, any>, language: string }; 
    const { theme } = UseTheme()

    const [ status, setStatus ] = useState<string>('');
    const [ user, setUser ] = useState({ fullName: '', email: '', telefono: '', description: '' });
    const [ showConfetti, setShowConfetti ] = useState(false);
    const [ hoverParticles, setHoverParticles ] = useState(false);
    const [ check, setCheck ] = useState(false)
    const [ shake, setShake ] = useState(false);
    const [ timeLeft, setTimeLeft ] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [ error, setError ] = useState<boolean>(false)
    const [ loading, setLoading ] = useState<boolean>(false)

    useEffect(() => {
            const target = new Date("2026-02-15T00:00:00").getTime();

            const timer = setInterval(() => {
                const now = Date.now();
                const distance = target - now;

                if (distance < 0) {
                    clearInterval(timer);
                } else {
                    setTimeLeft({
                        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((distance % (1000 * 60)) / 1000),
                    });
                }
            }, 1000);

            return () => clearInterval(timer);
        }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!check) {
            setShake(true);
            setTimeout(() => setShake(false), 10000); 
            return; 
        }
        try {
            setStatus("")
            setError(false)
            setLoading(true)

            await axios.post(`${import.meta.env.VITE_API_URL}/raffle`, { fullName: user.fullName, email: user.email, phone: user.telefono, description: user.description});
            
        } catch (error) {
            setError(true)
            console.error("Error al generar ticket de sorteo! 🔴", error)
        } finally {
            setStatus("logged")
            setShowConfetti(true)
            setLoading(false)
        }
    };

    if(error) return <Error errorMessage={"Error al inscribirse en el sorteo."} />
    if(loading) return <Loader />

    return (
        <>
        <div className={`dev-sorteo-container ${theme === "light" ? "theme-light" : "theme-dark"}`} style={{ marginTop: 0, background: theme === "dark" ? "black" : "#f4f2ff" }}>
            <div className={`dd-grid-overlay ${theme}`}></div> 
            {showConfetti && <Confetti numberOfPieces={1200} height={document.documentElement.scrollHeight} recycle={false} />}

            <AnimatePresence mode="wait">
                {status === '' && (
                    <motion.div key="form" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className={`dev-card ${shake ? 'animate-shake' : ''}`} >
                        <div className="dev-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                            <p className="terminal-title">new_{user.fullName === "" ? "raffle" : user.fullName.toLowerCase().replace(" ", "_")}_entry.jsx</p>
                        </div>
                        
                        <h2 className='title-raffle'>&lt;{texts[language].raffles.raffleTitle} /&gt;</h2>
                        
                        <p className="subtitle">{texts[language].raffles.raffleText}</p>
                        <CountDown timeLeft={timeLeft} />
                        <form onSubmit={handleSubmit} className="dev-form">
                            {/* nombre */}
                            <input name='fullName' required placeholder={texts[language].raffles.name} onChange={e => setUser({...user, fullName: e.target.value})} />
                            {/* email */}
                            <input name='email' required type="email" placeholder={texts[language].raffles.email} onChange={e => setUser({...user, email: e.target.value})} />
                            {/* telefono */}
                            <input name="phone" required type="number" placeholder="Teléfono" onChange={e => setUser({...user, telefono: e.target.value})} />
                            <textarea name='description' required placeholder={texts[language].raffles.project} onChange={e => setUser({...user, description: e.target.value})} />

                            <div className={`dev-checkbox-group`}>
                                <label className="checkbox-wrapper">
                                    <input type="checkbox" checked={check} onChange={(e) => setCheck(e.target.checked)} />
                                    <span className="checkmark"></span>
                                    <span className="label-text">{texts[language].raffles.conditions.before}<a href="/raffle-terms" target="_blank" rel="noopener noreferrer">{texts[language].raffles.conditions.link}</a>{texts[language].raffles.conditions.after}</span>
                                </label>
                            </div>
                            {shake && <p className="checkbox-warning">You must agree to the terms and conditions to proceed.</p>}
                            
                            <button type="submit" className="btn-glow" onMouseEnter={() => setHoverParticles(true)} onMouseLeave={() => setHoverParticles(false)}>{texts[language].raffles.button}</button>
                        </form>
                        <ParticleButton active={hoverParticles} />
                    </motion.div>
                )}

                {status === 'logged' && (
                    <motion.div key="winner" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="winner-card" >
                        <div className="dev-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                            <p className="terminal-title">new_{user.fullName}_entry.jsx</p>
                        </div>
                        
                        <h1>{texts[language].raffles.registered}</h1>
                        <div className="success-icon">✨</div>
                        <p style={{ whiteSpace: "pre-line" }} >{texts[language].raffles.thanks.before} <strong>{user.fullName}</strong>. {texts[language].raffles.thanks.after}</p>

                        <div className="ticket-summary">
                            <p>{texts[language].raffles.premio}</p>
                        </div>

                        <button onClick={() => window.location.reload()} className="btn-glow">{texts[language].raffles.buttonBack.toUpperCase()}</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </>
    );
};

export default SorteoDev;