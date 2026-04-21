import { motion, useScroll, useTransform, useSpring, type TargetAndTransition } from "framer-motion";
import { useRef } from "react";
import "./products.css"
import FloatingIcon from "../ui/FloatingIcon"
import { UseLanguage }   from "../contexts/LanguageContext";
import { UseTheme } from "../contexts/ThemeContext";

const ProductsInfo = () => {
    const { language, texts } = UseLanguage()  
    const { theme } = UseTheme()
    // Configuración de suavizado
    const springConfig = { stiffness: 50, damping: 25, mass: 0.5 };

    // WEB APPS
    const textRef = useRef(null);
    const { scrollYProgress: scroll1 } = useScroll({
        target: textRef,
        offset: ["start end", "end start"]
    });
    const x = useSpring(useTransform(scroll1, [0, 0.5, 1], [-500, 0, 200]), springConfig);
    const opacity = useSpring(useTransform(scroll1, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // APPS
    const textRef2 = useRef(null);
    const { scrollYProgress: scroll2 } = useScroll({
        target: textRef2,
        offset: ["start end", "end start"]
    });
    const x2 = useSpring(useTransform(scroll2, [0, 0.5, 1], [600, 0, -150]), springConfig);
    const opacity2 = useSpring(useTransform(scroll2, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // CUSTOM SOFTWARE
    const textRef3 = useRef(null);
    const { scrollYProgress: scroll3 } = useScroll({
        target: textRef3,
        offset: ["start end", "end start"]
    });
    const x3 = useSpring(useTransform(scroll3, [0, 0.5, 1], [-500, 0, -150]), springConfig);
    const opacity3 = useSpring(useTransform(scroll3, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // AI INTEGRATION
    const textRef4 = useRef(null);
    const { scrollYProgress: scroll4 } = useScroll({
        target: textRef4,
        offset: ["start end", "end start"]
    });
    const x4 = useSpring(useTransform(scroll4, [0, 0.5, 1], [600, 0, -150]), springConfig);
    const opacity4 = useSpring(useTransform(scroll4, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // AUTOMATION
    const textRef5 = useRef(null);
    const { scrollYProgress: scroll5 } = useScroll({
        target: textRef5,
        offset: ["start end", "end start"]
    });
    const x5 = useSpring(useTransform(scroll5, [0, 0.5, 1], [-500, 0, -250]), springConfig);
    const opacity5 = useSpring(useTransform(scroll5, [0, 0.1, 0.9, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // Estilo de gradiente animado reutilizable
    const gradientBase = {
        background: theme === "dark" ? "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 50%, #8B5CF6 100%)" :
        "linear-gradient(90deg, #102A43 0%, #0062FF 50%, #0099bbff 100%)",
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    };

    const gradientAnim: TargetAndTransition = {
        backgroundPosition: ["100% 50%", "100% 50%"],
        transition: { duration: 4, repeat: Infinity, ease: "backInOut" }
    };

    return (
        <div className="products-overlay">
            
        <div className="products-section" style={{ background: theme === "dark" ? "black" : "#F0F4F8" }}>

            <div className={`dd-grid-overlay ${theme}`}></div>

            {/* WEB APPLICATIONS */}
            <div className="web-apps-section" ref={textRef}>
                <motion.h1 className="h1-web" style={{ ...gradientBase, opacity: opacity, x: x }} 
                    animate={gradientAnim}>
                    {texts[language].products.webTitle}
                </motion.h1>

                <div className="web-text-icons-section">
                    <motion.p className="p-web" style={{ ...gradientBase, opacity: opacity, x: x }} 
                        animate={gradientAnim}>
                        {texts[language].products.webText}
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "1rem" }}>
                        <FloatingIcon src="/logos/chrome.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="/logos/safari2.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="/logos/firefox.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="/logos/edge.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>

            {/* MOBILE APPS */}
            <div className="apps-section" ref={textRef2}>
                <motion.h1 className="h1-apps" style={{ ...gradientBase, opacity: opacity2, x: x2 }} 
                    animate={gradientAnim}>
                        {texts[language].products.appTitle}
                </motion.h1>

                <div className="app-text-icons-section">
                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem" }}>
                        <FloatingIcon src="/logos/appstore.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="/logos/playstore.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src={`/logos/${theme === "dark" ? "apple" : "apple2"}.svg`} delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="/logos/android2.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>

                    <motion.p className="p-apps" style={{ ...gradientBase, opacity: opacity2, x: x2 }} 
                        animate={gradientAnim}>
                        {texts[language].products.appText}
                    </motion.p>
                </div> 
            </div>

            {/* CUSTOM SOFTWARE */}
            <div className="custom-section" ref={textRef3}>
                <motion.h1 className="h1-custom" style={{ ...gradientBase, opacity: opacity3, x: x3 }} 
                    animate={gradientAnim}>
                        {texts[language].products.customTitle}
                </motion.h1>

                <div className="custom-icons-section">
                    <motion.p className="p-custom" style={{ ...gradientBase, opacity: opacity3, x: x3 }} 
                        animate={gradientAnim}>
                        {texts[language].products.customText}
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem" }}>
                        <FloatingIcon src="/logos/soft.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="/logos/graf.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="/logos/ingenieria.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="/logos/flow.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>     

            {/* AI INTEGRATION */}
            <div className="ai-section" ref={textRef4} style={{ marginRight: "3rem" }}>
                <motion.h1 className="h1-ai" style={{ ...gradientBase, opacity: opacity4, x: x4 }} 
                    animate={gradientAnim}>
                        {texts[language].products.AiTitle}
                </motion.h1>

                <div className="ai-icons-section">
                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem" }}>
                        <FloatingIcon src="/logos/brain.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="/logos/cubo.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="/logos/platform.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="/logos/chat.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>

                    <motion.p className="p-ai" style={{ ...gradientBase, opacity: opacity4, x: x4 }} 
                        animate={gradientAnim}>
                        {texts[language].products.AiText}
                    </motion.p>
                </div> 
            </div>       

            {/* AUTOMATION */}
            <div className="automation-section" ref={textRef5}>
                <motion.h1 className="h1-autom" style={{ ...gradientBase, opacity: opacity5, x: x5 }} 
                    animate={gradientAnim}>
                        {texts[language].products.automationTitle}
                </motion.h1>

                <div className="automation-icons-section">
                    <motion.p className="p-autom" style={{ ...gradientBase, opacity: opacity5, x: x5 }} 
                        animate={gradientAnim}>
                        {texts[language].products.automationText}
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem"}}>
                        <FloatingIcon src="/logos/recycle.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="/logos/work.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="/logos/ingenieria.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="/logos/flow.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>  
        </div>
        </div>
    );
};

export default ProductsInfo;