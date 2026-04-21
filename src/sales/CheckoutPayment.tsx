import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import useMercadoPago from "../hooks/useMercadoPago";
import Loader from "../loader/Loader";
import "./checkout.css"
import { UseTheme } from "../contexts/ThemeContext";
import CreditCard from "./CreditCard";
import ProcessOk from "../processMessages/ProcessOk";
import { v4 } from 'uuid';
import { createPortal } from "react-dom";

interface CheckoutPaymentProps {
  openPayment: () => void; // antes estaba como boolean en el comment de la funcion anterior
  productData: any
}

const CheckoutPayment = ({ openPayment, productData }: CheckoutPaymentProps) => {
    const checkoutRef = useRef<HTMLDivElement>(null);
    const mp = useMercadoPago();

    const { theme } = UseTheme()
    const [ exit, setExit ] = useState(false);
    const [ formData, setFormData ] = useState({ nombre: "", email: "", dni: "", tarjetaNumero: "", mesVencimiento: "", añoVencimiento: "", cvv: "", cuotas: "1" })
    
    const [ idempotencyKey ] = useState(v4());
    const [ isFlipped, setIsFlipped ] = useState(false);
    const [ status, setStatus ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null | boolean>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    let priceQuote

    if(formData.cuotas === "1"){
        priceQuote = `1 Pago de $${productData.price}`
    } else if(formData.cuotas === "3"){
        priceQuote = `3 Pagos de $${productData.price / 3}`
    } else{
        priceQuote = `6 Pagos de $${productData.price / 6}`
    }

    const handleClose = () => {
        setExit(true);
        
        setTimeout(() => {
            openPayment(); 
        }, 600);
    };

        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (checkoutRef.current && !checkoutRef.current.contains(e.target as Node)) {
                    handleClose();
                }
            };
    
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);


        const makePayment = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!mp) return;

            try {
                setError(false);
                setLoading(true);

                const cardNumber = formData.tarjetaNumero.trim().replace(/\s/g, "");
                
                const bin = cardNumber.substring(0, 6);

                // 1. Obtener primero el método de pago
                const paymentMethodsResponse = await mp.getPaymentMethods({ bin });

                // CORRECCIÓN: Acceder a .results[0] según el log que mostraste
                const paymentMethod = paymentMethodsResponse && paymentMethodsResponse.results && paymentMethodsResponse.results.length > 0 
                    ? paymentMethodsResponse.results[0] 
                    : null;

                if (!paymentMethod) {
                    throw new Error("No se pudo identificar el método de pago.");
                }

                // 2. Intentar obtener el emisor
                let issuerId = undefined;
                try {
                    // Según tu log, el emisor ya viene dentro del paymentMethod: paymentMethod.issuer.id
                    // Intentamos obtenerlo de la API por seguridad, pero tenemos el fallback del log
                    const issuers = await mp.getIssuers({ 
                        paymentMethodId: paymentMethod.id, 
                        bin 
                    });

                    if (issuers && issuers.length > 0) {
                        issuerId = issuers[0].id;
                    } else if (paymentMethod.issuer && paymentMethod.issuer.id) {
                        // Fallback: usar el que ya detectó getPaymentMethods
                        issuerId = paymentMethod.issuer.id;
                    }
                } catch (issuerError) {
                    console.warn("No se pudo obtener el emisor, continuando sin él...", issuerError);
                }

                // 3. Generar el CardToken
                // Nota: Asegúrate que identificationType sea dinámico si planeas aceptar otros que no sean DNI
                const cardToken = await mp.createCardToken({
                    cardNumber,
                    cardholderName: formData.nombre.trim(),
                    cardExpirationMonth: formData.mesVencimiento.trim(),
                    cardExpirationYear: formData.añoVencimiento.trim(),
                    securityCode: formData.cvv.trim(),
                    identificationType: "DNI", 
                    identificationNumber: formData.dni.trim(),
                });
                
                if (!cardToken || !cardToken.id) {
                    throw new Error("Error al generar el token de seguridad.");
                }

                // 4. Construir Payload
                const payload = {
                    token: cardToken.id,
                    issuer_id: issuerId ? String(issuerId) : undefined, 
                    payment_method_id: paymentMethod.id,
                    transaction_amount: Number(productData.price),
                    installments: Number(formData.cuotas),
                    description: `Plan ${productData.title} - DeepDev`,
                    plan: productData.title,
                    payer: {
                        email: formData.email,
                        identification: {
                            type: "DNI",
                            number: formData.dni,
                        },
                        // Asegúrate que esta variable de entorno esté cargada
                        id_internal: `${import.meta.env.VITE_ID__MP_INTERNAL}`,
                    },
                    // Asegúrate que esta variable esté definida en tu componente
                    idempotencyKey: typeof idempotencyKey !== 'undefined' ? idempotencyKey : undefined 
                };

                const response = await axios.post(`${import.meta.env.VITE_API_URL}/mercado-pago-payments`, payload);

                if (response.data.status === "approved") {
                    setStatus("ok");
                } else {
                    setError(`Estado: ${response.data.status_detail || response.data.status}`);
                }

            } catch (error: any) {
                console.error("Error detallado en integración:", error);
                setError("Error al procesar el pago. Verifique los datos de su tarjeta.");
            } finally {
                setLoading(false);
            }
        };

     if (loading) return <Loader />;
     if(status === "ok") return <ProcessOk processMessage={"Pago procesado exitosamente, Muchas Gracias!"} />

        const content = <div ref={checkoutRef} className={`checkout-container ${exit ? "exit" : ""} ${theme === 'light' ? 'theme-light' : 'theme-dark'}`} style={{ background: theme === "dark" ? "#0000009a" : "#f4f2ffa0" }}>
            <button className="close-button" onClick={handleClose}>✕</button>
        
            <CreditCard data={formData} isFlipped={isFlipped} />

            <p className="checkout-subtitle">{productData.name} — {priceQuote}</p>

            <form className="checkout-form" onSubmit={makePayment}>
                
                <div className="checkout-input-group">
                    <label>Titular de la tarjeta</label>
                    <input name="nombre" placeholder="Nombre completo" onChange={handleChange} className="checkout-input" required />
                </div>

                <div className="checkout-input-group">
                    <label>Email de facturación</label>
                    <input name="email" type="email" placeholder="email@ejemplo.com" onChange={handleChange} className="checkout-input" required />
                </div>

                <div className="card-row">
                    <div className="checkout-input-group" style={{ flex: 2 }}>
                        <label>DNI</label>
                        <input name="dni" placeholder="Número" onChange={handleChange} className="checkout-input" required />
                    </div>
                    <div className="checkout-input-group" style={{ flex: 1 }}>
                        <label>Cuotas</label>
                        <select name="cuotas" onChange={handleChange} className="checkout-input cuotas">
                            <option value="1">1 Pago</option>
                            <option value="3">3 Pagos</option>
                            <option value="6">6 Pagos</option>
                        </select>
                    </div>
                </div>

                <div className="checkout-input-group">
                    <label>Número de Tarjeta</label>
                    <input placeholder="0000 0000 0000 0000" onChange={(e) => setFormData({...formData, tarjetaNumero: e.target.value})} className="checkout-input" required />
                </div>

                <div className="card-row">
                    <input onFocus={() => setIsFlipped(false)} placeholder="Mes" onChange={(e) => setFormData({...formData, mesVencimiento: e.target.value})} className="checkout-input numbers" style={{ flex: 1 }} required />
                    <input onFocus={() => setIsFlipped(false)} placeholder="Año" onChange={(e) => setFormData({...formData, añoVencimiento: e.target.value})} className="checkout-input numbers" style={{ flex: 1 }} required />
                    <input onFocus={() => setIsFlipped(true)} onBlur={()=> setIsFlipped(false)} onChange={(e) => setFormData({...formData, cvv: e.target.value})} placeholder="CVV"  className="checkout-input numbers" style={{ flex: 1 }} required />
                </div>

                {error && <p className="error-password" style={{marginTop: '1rem'}}>{error}</p>}

                <button type="submit" className="checkout-btn" disabled={loading}>{loading ? "Procesando..." : "Procesar Pago"}</button>
            </form>
        </div>
    
    return createPortal(content, document.body);
}

export default CheckoutPayment