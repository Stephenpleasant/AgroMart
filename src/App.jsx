import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Auth from "./pages/Auth"; 
import Welcome from "./components/welcome";
import Sellers from "./pages/Sellers-dashboard";
import Buyer from "./pages/Buyer-dashboard";
import Account from "./buyer/account";
import Settings from "./buyer/settings";
import Profile from "./seller/profile";
import LogIn from "./pages/login";
import Wallet from "./seller/wallet";
import AgroMartChat from "./components/Al";
import Order from "./buyer/order";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Helper function to determine redirect path based on user type
  const getRedirectPath = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.userType) {
        return user.userType === 'seller' ? '/sellerdashboard' : '/buyerdashboard';
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    // Default fallback
    return '/buyerdashboard';
  };

  // Listen for storage changes to update token state
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      if (newToken !== token) {
        setToken(newToken);
      }
    };

    // Listen for storage events (for cross-tab updates)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  // Simple check: if token exists, user is considered authenticated
  const isAuthenticated = !!token;

  return (
    <Routes>
      {/* Welcome Route - Default landing page */}
      <Route path="/welcome" element={<Welcome />} />
      
      {/* General Auth Route - redirect to appropriate dashboard based on user type */}
      <Route 
        path="/auth" 
        element={!isAuthenticated ? <Auth /> : <Navigate to={getRedirectPath()} replace />} 
      />
      
      {/* Seller auth route - uses the same Auth component but detects seller from URL */}
      <Route 
        path="/auth/seller" 
        element={!isAuthenticated ? <Auth /> : <Navigate to="/sellerdashboard" replace />} 
      />

      {/* Buyer auth route - uses the same Auth component but detects buyer from URL */}
      <Route 
        path="/auth/buyer" 
        element={!isAuthenticated ? <Auth /> : <Navigate to="/buyerdashboard" replace />} 
      />
    {/*Login route*/}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LogIn /> : <Navigate to={getRedirectPath()} replace />} 
      />
      
      
      {/* Protected Dashboard Routes - Only accessible with valid token */}
      <Route 
        path="/sellerdashboard" 
        element={isAuthenticated ? <Sellers /> : <Navigate to="/auth/seller" replace />} 
      />
      
      <Route 
        path="/buyerdashboard" 
        element={isAuthenticated ? <Buyer /> : <Navigate to="/auth/buyer" replace />} 
      />

      {/*AI chat route*/}
      <Route path="/chat" element={isAuthenticated ? <AgroMartChat /> : <Navigate to="/auth" replace />} />

      
      {/* Other Protected Routes */}
      <Route 
        path="/account" 
        element={isAuthenticated ? <Account /> : <Navigate to="/auth" replace />} 
      />
      <Route
      path="/wallet"
      element={isAuthenticated ? <Wallet /> : <Navigate to="/auth" replace />}
      />
      <Route 
        path="/settings" 
        element={isAuthenticated ? <Settings /> : <Navigate to="/auth" replace />} 
      />
      {/*Profile route*/}
      <Route 
        path="/profile" 
        element={isAuthenticated ? <Profile /> : <Navigate to="/auth" replace />} 
      />
       {/*Order view*/}
      <Route 
        path="/order/:id" 
        element={isAuthenticated ? <Order /> : <Navigate to="/auth" replace />} 
      />
      
      {/* Dashboard route - redirect based on user type */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Navigate to={getRedirectPath()} replace /> : <Navigate to="/auth" replace />} 
      />
      
      {/* Root Route - Always redirect to Welcome first */}
      <Route path="/" element={<Navigate to="/welcome" replace />} />


      {/* Fallback: Redirect unknown routes to Welcome */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}

export default App;