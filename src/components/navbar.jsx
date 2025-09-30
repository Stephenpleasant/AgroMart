import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Menu, X, ChevronDown, User, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInDropdownOpen, setIsSignInDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSignInDropdown = () => {
    setIsSignInDropdownOpen(!isSignInDropdownOpen);
  };

  const closeDropdown = () => {
    setIsSignInDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-md z-50 transition-all duration-300">
      {/* Overlay to close dropdown when clicking outside */}
      {isSignInDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeDropdown}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            <span className="text-lg md:text-xl font-bold text-gray-800">AgroMart</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-600 hover:text-gray-800 transition-colors">Home</a>
            <a href="#about" className="text-gray-600 hover:text-gray-800 transition-colors">About</a>
            <a href="#products" className="text-gray-600 hover:text-gray-800 transition-colors">How it works</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-800 transition-colors">Contact us</a>
          
            {/* Sign In Dropdown */}
            <div className="relative">
              <button
                onClick={toggleSignInDropdown}
                className="relative text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 group flex items-center space-x-1"
              >
                <span>Sign Up</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                  isSignInDropdownOpen ? 'rotate-180' : ''
                }`} />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            
              {/* Dropdown Menu */}
              {isSignInDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <Link
                    to="/auth/buyer"
                    onClick={closeDropdown}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                  >
                    <ShoppingBag className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Sign up as Buyer</div>
                      <div className="text-sm text-gray-500">Purchase fresh products</div>
                    </div>
                  </Link>
                  <Link
                    to="/auth/seller"
                    onClick={closeDropdown}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                  >
                    <User className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Sign up as Seller</div>
                      <div className="text-sm text-gray-500">Sell your products</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              to="/login" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link 
              to="/login" 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
            >
              Login
            </Link>
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Compact */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen 
            ? 'max-h-64 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="py-3 border-t border-gray-200 space-y-1">
            <a 
              href="#home"
              onClick={toggleMenu}
              className="block px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              Home
            </a>
            <a 
              href="#about"
              onClick={toggleMenu}
              className="block px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              About
            </a>
            <a 
              href="#products"
              onClick={toggleMenu}
              className="block px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              How it works
            </a>
            <a 
              href="#contact"
              onClick={toggleMenu}
              className="block px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              Contact us
            </a>
            
            {/* Mobile Sign Up Options - Compact */}
            <div className="pt-2 border-t border-gray-200 mt-2">
              <p className="px-3 py-1 text-xs text-gray-500 font-medium">Sign Up</p>
              <Link 
                to="/auth/buyer" 
                onClick={toggleMenu}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Buyer
              </Link>
              <Link 
                to="/auth/seller" 
                onClick={toggleMenu}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                Seller
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;