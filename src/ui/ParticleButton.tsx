import { UseTheme } from "../contexts/ThemeContext";
import "./particleButton.css";

type CSSVars = React.CSSProperties & {
    [key: `--${string}`]: string;
};

type ParticleButtonProps = {
    active: boolean;
};

const ParticleButton = ({ active }: ParticleButtonProps) => {
    const { theme } = UseTheme()

    if (!active) return null;

    return (
        <div className="particle-field">
        {Array.from({ length: 500 }).map((_, i) => (
            <span
            key={i}
            className={theme === "dark" ? "particle" : "particle-light-theme"}
            style={
                {
                '--x': `${Math.random() * 200 - 100}px`,
                '--y': `${Math.random() * 200 - 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${5 + Math.random() * 2}s`,
                } as CSSVars
            }
            />
        ))}
        </div>
    );
};

export default ParticleButton;