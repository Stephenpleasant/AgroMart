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
import Wallet from "./seller/wallet";
import AgroMartChat from "./components/Al";
import Order from "./buyer/order";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Helper function to determine redirect path based on user type
  const getRedirectPath = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const currentToken = localStorage.getItem('token');
      
      // Check if user has valid token and user data
      if (!currentToken || !user) {
        return '/auth'; // Redirect to registration if no token or user data
      }
      
      if (user && user.userType) {
        return user.userType === 'seller' ? '/sellerdashboard' : '/buyerdashboard';
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    // Default fallback - redirect to auth for registration
    return '/auth';
  };

  // Simple authentication check - only requires token and user data
  const isAuthenticated = () => {
    try {
      const currentToken = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem('user'));
      
      // User only needs token and basic user data
      return !!(currentToken && user);
    } catch (error) {
      return false;
    }
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

  return (
    <Routes>
      {/* Welcome Route - Default landing page */}
      <Route path="/welcome" element={<Welcome />} />
      
      {/* General Auth Route - redirect to appropriate dashboard based on user type */}
      <Route 
        path="/auth" 
        element={!isAuthenticated() ? <Auth /> : <Navigate to={getRedirectPath()} replace />} 
      />
      
      {/* Seller auth route - uses the same Auth component but detects seller from URL */}
      <Route 
        path="/auth/seller" 
        element={!isAuthenticated() ? <Auth /> : <Navigate to="/sellerdashboard" replace />} 
      />

      {/* Buyer auth route - uses the same Auth component but detects buyer from URL */}
      <Route 
        path="/auth/buyer" 
        element={!isAuthenticated() ? <Auth /> : <Navigate to="/buyerdashboard" replace />} 
      />

      {/* Redirect /login to auth - no separate login component needed */}
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      
      {/* Protected Dashboard Routes - Only accessible with valid token AND verified email */}
      <Route 
        path="/sellerdashboard" 
        element={isAuthenticated() ? <Sellers /> : <Navigate to="/auth/seller" replace />} 
      />
      
      <Route 
        path="/buyerdashboard" 
        element={isAuthenticated() ? <Buyer /> : <Navigate to="/auth/buyer" replace />} 
      />

      {/*AI chat route*/}
      <Route 
        path="/chat" 
        element={isAuthenticated() ? <AgroMartChat /> : <Navigate to="/auth" replace />} 
      />

      {/* Other Protected Routes */}
      <Route 
        path="/account" 
        element={isAuthenticated() ? <Account /> : <Navigate to="/auth" replace />} 
      />
      <Route
        path="/wallet"
        element={isAuthenticated() ? <Wallet /> : <Navigate to="/auth" replace />}
      />
      <Route 
        path="/settings" 
        element={isAuthenticated() ? <Settings /> : <Navigate to="/auth" replace />} 
      />
      {/*Profile route*/}
      <Route 
        path="/profile" 
        element={isAuthenticated() ? <Profile /> : <Navigate to="/auth" replace />} 
      />
       {/*Order view*/}
      <Route 
        path="/order/:id" 
        element={isAuthenticated() ? <Order /> : <Navigate to="/auth" replace />} 
      />
      
      {/* Dashboard route - redirect based on user type */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated() ? <Navigate to={getRedirectPath()} replace /> : <Navigate to="/auth" replace />} 
      />
      
      {/* Root Route - Always redirect to Welcome first */}
      <Route path="/" element={<Navigate to="/welcome" replace />} />

      {/* Fallback: Redirect unknown routes to Welcome */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}

export default App;