import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Auth from "./pages/auth"; 
import Welcome from "./components/welcome";
import Authbuyer from "./components/auth-buyer";
import Authseller from "./components/auth-seller";
import Sellers from "./pages/Sellers-dashboard";
import Buyer from "./pages/Buyer-dashboard";
import Account from "./buyer/account";
import Settings from "./buyer/settings";
function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Listen for storage changes to update token state
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    // Listen for storage events (for cross-tab updates)
    window.addEventListener("storage", handleStorageChange);

    // Also check localStorage periodically (for same-tab updates)
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== token) {
        setToken(currentToken);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [token]);

  return (
    <Routes>
      {/* Welcome Route - Now the default landing page */}
      <Route path="/welcome" element={<Welcome />} />
      
      {/* General Auth Route */}
      <Route path="/auth" element={!token ? <Auth /> : <Navigate to="/dashboard" replace />} />
      
      {/* Seller auth route */ }
      <Route path="/auth/seller" element={!token ? <Authseller /> : <Navigate to="/sellerdashboard" replace />} />

      {/*Buyer auth route */ }
      <Route path="/auth/buyer" element={!token ? <Authbuyer /> : <Navigate to="/buyerdashboard" replace />} />
      
      {/* Buyer Dashboard Route */}
      <Route path="/buyerdashboard" element={token ? <Buyer /> : <Navigate to="/auth/buyer" replace />} />
  
      
      {/* Seller Dashboard Route */}
      <Route path="/sellerdashboard" element={token ? <Sellers /> : <Navigate to="/auth/seller" replace />} />


      {/* Account Dashboard Route */}
      <Route path="/account" element={token ? <Account /> : <Navigate to="/auth" replace />} />

      {/* Settings Route */}
      <Route path="/settings" element={token ? <Settings /> : <Navigate to="/auth" replace />} />
      
      {/* Root Route - Always redirect to Welcome first */}
      <Route path="/" element={<Navigate to="/welcome" replace />} />

      {/* Fallback: Redirect unknown routes to Welcome */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}

export default App;