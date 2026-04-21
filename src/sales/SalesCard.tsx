import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UseTheme } from '../contexts/ThemeContext';
import CheckoutPayment from './CheckoutPayment';
import "./sales.css"

interface Feature { text: string; included: boolean; }

interface SalesCardProps { title: string; price: any; isPopular?: boolean, description?: string; features: Feature[]; buttonText: string; isFeatured?: boolean; }

const SalesCard: React.FC<SalesCardProps> = ({ title, price, isPopular, description, features, buttonText, isFeatured }) => {
    const { theme } = UseTheme();
    const [ openCheck, setOpenCheck ] = useState<boolean>(false)

    return (
        <>
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            viewport={{ once: true }}
            className={`sales-card-isolated ${theme} ${isFeatured ? 'featured' : ''}`}
        >
            {/* Header estilo Mac OS */}
            <div className="sales-mac-header">
                <div className="mac-dots">
                    <span className="m-dot m-red"></span>
                    <span className="m-dot m-yellow"></span>
                    <span className="m-dot m-green"></span>
                </div>
                <p className="mac-filename">{title.toLowerCase()}.tsx</p>
                
            </div>

            <div className="sales-card-body">
                <h2 className="sales-plan-name">{title}: <span>{isPopular === true && "⭐️ Best Seller"}</span></h2>
                <div className="sales-price-section">
                    
                    <span className="sales-amount">${price},-</span>
                </div>
                <h2 className="sales-description">{description}6 Cuotas Sin Interes</h2>

                <div className="sales-features-list">
                    {features.map((item, index) => (
                        <div key={index} className={`sales-feature-row ${!item.included ? 'disabled' : ''}`}>
                            <span className="sales-icon">{item.included ? '⚡' : '❌'}</span>
                            <span className="sales-text">{item.text}</span>
                        </div>
                    ))}
                </div>

                <button className="sales-action-btn" onClick={() => setOpenCheck(!openCheck)}>{buttonText}</button>
            </div>
        </motion.div>
        { openCheck && <CheckoutPayment productData={{ name: title, price: price }} openPayment={() => setOpenCheck(false)} /> }
        </>
    );
};

export default SalesCard;