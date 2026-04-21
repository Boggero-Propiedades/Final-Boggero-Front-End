import { UseLanguage }   from "../contexts/LanguageContext";

interface CountProps{
    timeLeft: any;
}

const CountDown = ({ timeLeft }: CountProps) => {
    const { language, texts } = UseLanguage()  
    return(
        <div className="countdown-display" style={{ marginTop: '10px', marginBottom: '25px', display: 'flex', justifyContent: 'center', gap: '15px', color: 'white', fontFamily: 'Montserrat, Inter, monospace' }}>
            <div className="time-box" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', display: 'block' }}>{timeLeft.days}</span>
                <small style={{ opacity: 0.6, fontSize: '10px' }}>{texts[language].raffles.days}</small>
            </div>
            <span style={{ fontSize: '2rem', opacity: 0.5 }}>:</span>
            <div className="time-box" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', display: 'block' }}>{timeLeft.hours.toString().padStart(2, '0')}</span>
                <small style={{ opacity: 0.6, fontSize: '10px' }}>{texts[language].raffles.hours}</small>
            </div>
            <span style={{ fontSize: '2rem', opacity: 0.5 }}>:</span>
            <div className="time-box" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', display: 'block' }}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <small style={{ opacity: 0.6, fontSize: '10px' }}>{texts[language].raffles.minutes}</small>
            </div>
            <span style={{ fontSize: '2rem', opacity: 0.5 }}>:</span>
            <div className="time-box" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', display: 'block' }}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <small style={{ opacity: 0.6, fontSize: '10px' }}>{texts[language].raffles.seconds}</small>
            </div>
        </div>
    )
}

export default CountDown;