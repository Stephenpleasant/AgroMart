import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShoppingCart, Store, User, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'buyer',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('https://agromart-4tnl.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Login response data:', data);
        
        // Store token - consistent with Auth.jsx
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // Store user data in the EXACT format that App.jsx expects
        const userData = {
          fullName: data.fullName || data.name || data.user?.fullName || data.user?.name || '',
          email: data.email || data.user?.email || formData.email,
          _id: data._id || data.id || data.user?._id || data.user?.id || '',
          userType: formData.role, // This is crucial - matches App.jsx expectations
          phone: data.phone || data.user?.phone || '',
          address: data.address || data.user?.address || '',
          // Add any additional fields that might be useful
          role: formData.role, // Backup field
          verified: data.verified || data.user?.verified || false
        };
        
        // Log for debugging
        console.log('Storing user data:', userData);
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Verify storage worked
        console.log('Token stored:', localStorage.getItem('token'));
        console.log('User stored:', JSON.parse(localStorage.getItem('user')));
        
        setShowSuccess(true);
        
        // Navigate to appropriate dashboard
        const dashboardRoute = formData.role === 'buyer' ? '/buyerdashboard' : '/sellerdashboard';
        
        // Navigate immediately - don't wait for timeout
        navigate(dashboardRoute, { replace: true });
        
        // Optional: Show success message briefly
        // setTimeout(() => {
        //   navigate(dashboardRoute, { replace: true });
        // }, 1000);
        
      } else {
        // Handle API errors
        console.error('Login failed:', data);
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || 'Login failed. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-500 via-green-600 to-indigo-700">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent mb-2">
              AgroMart
            </h1>
            <p className="text-gray-600 text-lg">Connect. Trade. Grow.</p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-center animate-pulse">
              ✅ Login successful! Redirecting to {formData.role} dashboard...
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-center">
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Role Selector */}
              <div className="grid grid-cols-2 gap-2 p-2 bg-gray-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'buyer' }))}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    formData.role === 'buyer'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ShoppingCart size={18} />
                  <span>Buyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'seller' }))}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    formData.role === 'seller'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Store size={18} />
                  <span>Seller</span>
                </button>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Mail size={16} />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 ${
                      errors.email ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    disabled={isLoading}
                  />
                  {formData.email && (
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    ⚠️ {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Lock size={16} />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 ${
                      errors.password ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    ⚠️ {errors.password}
                  </p>
                )}
              </div>

              {/* Form Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    disabled={isLoading}
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-green-600 hover:text-green-600 font-semibold transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  Sign In as {formData.role === 'buyer' ? 'Buyer' : 'Seller'}
                </span>
                {isLoading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/auth" className="text-green-600 hover:text-green-600 font-semibold transition-colors">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;