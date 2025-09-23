import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, ShoppingBag, User, CheckCircle, AlertCircle } from 'lucide-react';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    phone: '', 
    address: '' 
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('buyer'); // 'buyer' or 'seller'
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'error', or null
  const [verificationMessage, setVerificationMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check for verification token in URL
  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type') || 'buyer'; // Get user type from URL params
    
    if (token) {
      setUserType(type);
      verifyEmail(token, type);
    }
  }, [searchParams]);

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
    if (loginSuccess && !isRegister) {
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
  }, [loginSuccess, isRegister, userType, navigate]);

  // Email verification function
  const verifyEmail = async (token, type) => {
    setIsVerifying(true);
    setVerificationStatus(null);
    setVerificationMessage('');

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://agromart-4tnl.onrender.com';

    try {
      console.log('Verifying email with token:', token);
      // Use separate verification endpoints for buyers and sellers
      const verificationEndpoint = type === 'buyer' 
        ? `/api/buyer/verify-email` 
        : `/api/seller/verify-email`;
      
      const res = await axios.post(`${baseUrl}${verificationEndpoint}`, { 
        token
      });

      console.log('Verification response:', res.data);
      
      setVerificationStatus('success');
      setVerificationMessage(res.data.message || 'Email verified successfully!');

      // Auto-redirect after successful verification
      setTimeout(() => {
        const dashboardRoute = type === 'buyer' ? '/buyerdashboard' : '/sellerdashboard';
        navigate(dashboardRoute);
      }, 2000);

    } catch (err) {
      console.error('Email verification failed:', err);
      setVerificationStatus('error');
      setVerificationMessage(
        err.response?.data?.message || 'Email verification failed. Please try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleAuthMode = () => {
    setIsRegister((prev) => !prev);
    setError('');
    setFormData({ 
      fullName: '', 
      email: '', 
      password: '', 
      phone: '', 
      address: '' 
    });
    setShowPassword(false);
    setLoginSuccess(false);
  };

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

    // Use separate endpoints for buyer and seller registration/login
    let endpoint;
    let payload;

    if (isRegister) {
      // Registration endpoints
      endpoint = userType === 'buyer' 
        ? '/api/buyer/register' 
        : '/api/seller/register';
      
      // Remove userType from payload since it's now implicit in the endpoint
      payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      };
    } else {
      // Login endpoints
      endpoint = userType === 'buyer' 
        ? '/api/auth/login' 
        : '/api/auth/login';
      
      payload = {
        email: formData.email,
        password: formData.password
      };
    }

    console.log('Making request to:', `${baseUrl}${endpoint}`);
    console.log('Payload:', payload);

    try {
      const res = await axios.post(`${baseUrl}${endpoint}`, payload);
      console.log('Response:', res.data);

      if (!isRegister) {
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
        
      } else {
        alert(res.data.message || `${userType === 'buyer' ? 'Buyer' : 'Seller'} registered successfully. Please check your email for verification link.`);
        setIsRegister(false);
        setFormData({ 
          fullName: '', 
          email: '', 
          password: '', 
          phone: '', 
          address: '' 
        });
      }
    } catch (err) {
      console.error('Request failed:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Operation failed');
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

  const getUserTypeDescription = () => {
    return userType === 'buyer' 
      ? 'Purchase fresh agricultural products' 
      : 'Sell your agricultural products';
  };

  const getAuthDescription = () => {
    if (isRegister) {
      return userType === 'buyer' 
        ? 'Join us to buy fresh agricultural products' 
        : 'Join us to sell your agricultural products';
    } else {
      return userType === 'buyer' 
        ? 'Sign in to start shopping' 
        : 'Sign in to manage your products';
    }
  };

  // If currently verifying email, show verification screen
  if (isVerifying || verificationStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="p-8 text-center">
            {isVerifying ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Verifying Your Email
                </h1>
                <p className="text-gray-600">
                  Please wait while we verify your email address...
                </p>
              </>
            ) : verificationStatus === 'success' ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-green-800 mb-2">
                  Email Verified!
                </h1>
                <p className="text-gray-600 mb-4">
                  {verificationMessage}
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to your dashboard...
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-red-800 mb-2">
                  Verification Failed
                </h1>
                <p className="text-gray-600 mb-6">
                  {verificationMessage}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setVerificationStatus(null);
                      setVerificationMessage('');
                      navigate(`/auth/${userType}`);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                  >
                    Back to {getUserTypeDisplay()} Login
                  </button>
                  <Link
                    to="/"
                    className="block text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                  >
                    Go to Home
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
        </div>
      </div>
    );
  }

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

      {/* Auth Card */}
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
              {isRegister ? 'Create Account' : 'Welcome Back'}
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
            {isRegister && (
              <>
                {/* Full Name Field */}
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                    disabled={isLoading}
                    autoComplete="tel"
                  />
                </div>

                {/* Address Field */}
                <div>
                  <textarea
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                    disabled={isLoading}
                    autoComplete="street-address"
                  />
                </div>
              </>
            )}

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
                autoComplete={isRegister ? 'new-password' : 'current-password'}
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
                isRegister ? `Create ${getUserTypeDisplay()} Account` : `Sign Up as ${getUserTypeDisplay()}`
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            </span>
            <button
              onClick={toggleAuthMode}
              className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
              disabled={isLoading}
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          {/* Switch User Type */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <span className="text-gray-600 text-sm">
                Looking to {userType === 'buyer' ? 'sell' : 'buy'} instead?{' '}
              </span>
              <Link
                to={userType === 'buyer' ? '/auth/seller' : '/auth/buyer'}
                className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200"
              >
                {userType === 'buyer' ? 'Seller Account' : 'Buyer Account'}
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

export default Auth;