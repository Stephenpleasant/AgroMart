import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, AlertCircle } from 'lucide-react';

const Logout = ({ 
  showAsButton = true, 
  className = "", 
  children,
  onLogoutStart,
  onLogoutSuccess,
  onLogoutError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoading(true);
    
    // Call optional callback
    if (onLogoutStart) onLogoutStart();

    try {
      // Clear all authentication data from memory
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      localStorage.removeItem('favorites');
      
      // Clear any session storage as well
      localStorage.clear();
      sessionStorage.clear();
      
      // Call success callback
      if (onLogoutSuccess) onLogoutSuccess();
      
      // Small delay for better UX
      setTimeout(() => {
        setIsLoading(false);
        setShowConfirm(false);
        
        // Redirect to welcome/login page
        navigate('/welcome', { replace: true });
        
      }, 500);

    } catch (error) {
      console.error('Logout error:', error);
      
      // Call error callback
      if (onLogoutError) onLogoutError(error);
      
      setIsLoading(false);
      setShowConfirm(false);
      
      // Still redirect even if there's an error
      navigate('/welcome', { replace: true });
    }
  };

  const confirmLogout = () => {
    setShowConfirm(true);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  // Confirmation Modal
  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Logout</h3>
              <p className="text-sm text-gray-500">Are you sure you want to log out?</p>
            </div>
          </div>
          
          <div className="flex space-x-3 justify-end">
            <button
              onClick={cancelLogout}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render as button or custom element
  if (showAsButton) {
    return (
      <button
        onClick={confirmLogout}
        disabled={isLoading}
        className={`flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 ${className}`}
      >
        <LogOut className="h-5 w-5 mr-2" />
        {children || 'Logout'}
      </button>
    );
  }

  // Render as custom clickable element
  return (
    <div
      onClick={confirmLogout}
      className={`cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children || (
        <div className="flex items-center text-red-600 hover:text-red-700">
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </div>
      )}
    </div>
  );
};

export default Logout;