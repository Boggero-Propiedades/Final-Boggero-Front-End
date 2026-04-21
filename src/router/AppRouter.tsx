import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SessionProvider } from "../contexts/SessionContext";
import Footer from "../footer/Footer";
import NavBarCorporate from "../navbar/NavBarCorporate";
import PoliticaCookiesCorporate from "../cookies/PoliticaCookiesCorporate";
import CompanyInfoCorporate from "../company/CompanyInfoCorporate";
import ContactCorporate from "../contact/ContactCorporate";
import HomeCorporate from "../home/HomeCorporate";
import ProductsCorporate from "../products/ProductsCorporate";
import SpinnerCorporate from "../spinner/corporate/SpinerCorporate";
import CookiesCorporate from "../cookies/CookiesCorporate.tsx/CookiesCorporate";
import Error from "../processMessages/Error";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "../pages/AdminDashboard";
import Dashboard from "../pages/Dashboard";
import MethodCorporate from "../pages/MethodCorporate";

const AppRouter = () => {
    return (
        <Router>
            <SessionProvider>
                <CookiesCorporate />
                <NavBarCorporate />

                <Routes>
                    <Route path="/" element={<HomeCorporate />} />
                    <Route path="/products" element={<ProductsCorporate />} />
                    <Route path="/company" element={<CompanyInfoCorporate />} />
                    <Route path="/contact" element={<ContactCorporate />} />
                    <Route path="/method" element={<MethodCorporate />} />
                    <Route path="/policy" element={<PoliticaCookiesCorporate />} />
                    <Route path="/*" element={<Error errorMessage="" />} />
                    <Route path="/loader" element={<SpinnerCorporate />} />
                    <Route path="/dashboard" element={<PrivateRoute adminOnly={false}><Dashboard /></PrivateRoute>} />
                    {/* Tiene Acceso solo el admin con la prop pasada */}
                    <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
                    {/* <Route path="/admin" element={<AdminDashboard />} /> */}
                </Routes>
                <Footer />
            </SessionProvider>
        </Router>
    );  
}

export default AppRouter;   

