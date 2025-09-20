import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, ShoppingBag, User } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('buyer'); // 'buyer' or 'seller'
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Determine user type from URL path
  useEffect(() => {
    if (location.pathname.includes('/seller')) {
      setUserType('seller');
    } else {
      setUserType('buyer');
    }
  }, [location.pathname]);

  // Handle navigation after successful login
  useEffect(() => {
    if (loginSuccess) {
      const dashboardRoute = userType === 'buyer' ? '/buyerdashboard' : '/sellerdashboard';
      console.log('useEffect navigation to:', dashboardRoute);
      
      const timer = setTimeout(() => {
        navigate(dashboardRoute, { replace: true });
        // Fallback navigation
        setTimeout(() => {
          if (window.location.pathname !== dashboardRoute) {
            window.location.href = dashboardRoute;
          }
        }, 100);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, userType, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setLoginSuccess(false);

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://agromart-4tnl.onrender.com';
    console.log('API Base URL:', baseUrl);

    // Login endpoint
    const endpoint = '/api/auth/login';
    const payload = {
      email: formData.email,
      password: formData.password
    };

    console.log('Making request to:', `${baseUrl}${endpoint}`);
    console.log('Payload:', payload);

    try {
      const res = await axios.post(`${baseUrl}${endpoint}`, payload);
      console.log('Response:', res.data);

      // Store user data with user type
      localStorage.setItem('token', res.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          fullName: res.data.fullName,
          email: res.data.email,
          _id: res.data._id,
          userType: userType, // Use the current userType
          phone: res.data.phone,
          address: res.data.address,
        })
      );
      
      console.log('Token stored:', localStorage.getItem('token'));
      console.log('User stored:', localStorage.getItem('user'));
      
      alert(`${userType === 'buyer' ? 'Buyer' : 'Seller'} login successful!`);
      
      // Trigger navigation via useEffect
      setLoginSuccess(true);
      
    } catch (err) {
      console.error('Request failed:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTypeDisplay = () => {
    return userType === 'buyer' ? 'Buyer' : 'Seller';
  };

  const getUserTypeIcon = () => {
    return userType === 'buyer' ? <ShoppingBag className="h-6 w-6" /> : <User className="h-6 w-6" />;
  };

  const getAuthDescription = () => {
    return userType === 'buyer' 
      ? 'Sign in to start shopping' 
      : 'Sign in to manage your products';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-blue-500 flex items-center justify-center p-4">
      {/* Back to Home Button */}
      <Link 
        to="/welcome" 
        className="absolute top-6 left-6 flex items-center text-white hover:text-green-200 transition-colors duration-200"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Home
      </Link>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          {/* User Type Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <div className="text-green-600">
                {getUserTypeIcon()}
              </div>
            </div>
            <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-2">
              {getUserTypeDisplay()} Account
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              {getAuthDescription()}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                disabled={isLoading}
                autoComplete="current-password"
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Please wait...
                </div>
              ) : (
                `Sign In as ${getUserTypeDisplay()}`
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">
              Don't have an account?{' '}
            </span>
            <Link
              to={`/auth/${userType}`}
              className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
            >
              Create Account
            </Link>
          </div>

          {/* Switch User Type */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <span className="text-gray-600 text-sm">
                Looking to {userType === 'buyer' ? 'sell' : 'buy'} instead?{' '}
              </span>
              <Link
                to={userType === 'buyer' ? '/login/seller' : '/login/buyer'}
                className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200"
              >
                {userType === 'buyer' ? 'Seller Login' : 'Buyer Login'}
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Bottom */}
        <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
      </div>
    </div>
  );
};

export default Login;