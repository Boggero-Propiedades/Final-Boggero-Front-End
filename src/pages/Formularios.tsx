import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "./formularios.css"; 
import PdfAccidente from "../pdfGenerator/PdfAccidente";
import PdfEnfermedad from "../pdfGenerator/PdfEnfermedad";
import PdfIncapacidad from "../pdfGenerator/PdfIncapacidad";
import { UseTheme } from '../contexts/ThemeContext';

const Formularios = () => {
    const { theme } = UseTheme();
    const [activeTab, setActiveTab] = useState<'accidente' | 'enfermedad' | 'incapacidad'>('accidente');

    const tabs = [
        { id: 'accidente', label: 'ACCIDENTE DE TRÁNSITO', component: <PdfAccidente /> },
        { id: 'enfermedad', label: 'ENFERMEDAD PROFESIONAL', component: <PdfEnfermedad /> },
        { id: 'incapacidad', label: 'CÁLCULO DE INCAPACIDAD', component: <PdfIncapacidad /> },
    ];

    return (
        <main className={`corp-full-layout ${theme}`}>
            <header className="raw-header">
                <nav className="raw-nav">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`raw-tab ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </header>

            <section className="raw-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="raw-component-wrapper"
                    >
                        {tabs.find(t => t.id === activeTab)?.component}
                    </motion.div>
                </AnimatePresence>
            </section>
        </main>
    );
}

export default Formularios;