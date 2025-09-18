import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsRegister((prev) => !prev);
    setError('');
    setFormData({ name: '', email: '', password: '' });
    setShowPassword(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Debug: Log the API URL being used
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    console.log('API Base URL:', baseUrl);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister
      ? formData
      : { email: formData.email, password: formData.password };

    console.log('Making request to:', `${baseUrl}${endpoint}`);
    console.log('Payload:', payload);

    try {
      const res = await axios.post(`${baseUrl}${endpoint}`, payload);
      console.log('Response:', res.data);

      if (!isRegister) {
        // Store user data
        localStorage.setItem('token', res.data.token);
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: res.data.name,
            email: res.data.email,
            _id: res.data._id,
          })
        );
        
        // Debug: Verify data was stored
        console.log('Token stored:', localStorage.getItem('token'));
        console.log('User stored:', localStorage.getItem('user'));
        
        alert('Login successful!');
        
        // Navigate to dashboard
        console.log('Navigating to dashboard...');
        navigate('/dashboard');
        
      } else {
        alert(res.data.message || 'User registered successfully');
        setIsRegister(false);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      console.error('Request failed:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-blue-500 flex items-center justify-center p-4">
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center text-white hover:text-green-200 transition-colors duration-200"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Home
      </Link>

      {/* Auth Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {isRegister 
                ? 'Join us to sell your agriculture products' 
                : 'Sign in to continue your journey'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>
            )}

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
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Please wait...
                </div>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
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
        </div>

        {/* Decorative Bottom */}
        <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
      </div>
    </div>
  );
};

export default Auth;