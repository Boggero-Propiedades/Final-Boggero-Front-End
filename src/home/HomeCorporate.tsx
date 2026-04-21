import React from 'react';
import { motion } from 'framer-motion';
import './homeCorporate.css';
import ScrollCarrousel from '../scroll/ScrollCarrousel';
import videoCorpHome from '../assets/video-corp-home3.mp4';
/* import WorkSection from '../inmersive/WorkSection'; */

const HomeCorporate: React.FC = () => {

    return (
        <>
        <section className="v3-hero">
              {/* Contenedor del Video Background */}
              <div className="v3-video-wrapper">
                  <video autoPlay muted loop playsInline className="v3-hero-video">
                      <source src={videoCorpHome} type="video/mp4" />
                      Tu navegador no soporta videos.
                  </video>
                  {/* Overlay para asegurar que el texto sea legible */}
                  <div className="v3-video-overlay" />
              </div>

              <div className="v3-container">
                  <motion.h1 whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}className="v3-huge-title">
                      Boggero Propiedades <br />
                      <span>Estudio Jurídico</span>
                  </motion.h1>
              </div>
          </section>

        <ScrollCarrousel />
        
        {/* <WorkSection /> */}
        </>
    );
};

export default HomeCorporate;