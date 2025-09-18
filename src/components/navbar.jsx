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
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50 transition-all duration-300">
      {/* Overlay to close dropdown when clicking outside */}
      {isSignInDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeDropdown}
        />
      )}
      
      <nav className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-8 w-8 text-green-500" />
                    <span className="text-xl font-bold text-gray-800">AgroMart</span>
                  </div>
                  <div className="hidden md:flex items-center space-x-8">
                    <a href="#home" className="text-gray-600 hover:text-gray-800">Home</a>
                    <a href="#about" className="text-gray-600 hover:text-gray-800">About</a>
                    <a href="#products" className="text-gray-600 hover:text-gray-800">How it works</a>
                    <a href="#contact" className="text-gray-600 hover:text-gray-800">Contact us</a>
                  </div>
            
            {/* Sign In Dropdown */}
            <div className="relative">
              <button
                onClick={toggleSignInDropdown}
                className="relative text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 group flex items-center space-x-1"
              >
                <span>Sign In</span>
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
                      <div className="font-medium">Sign in as Buyer</div>
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
                      <div className="font-medium">Sign in as Seller</div>
                      <div className="text-sm text-gray-500">Sell your products</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              to="/auth" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-80 opacity-100 pb-6' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <Link 
              to="/" 
              onClick={toggleMenu}
              className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors duration-200"
            >
              Home
            </Link>
            
            {/* Mobile Sign In Options */}
            <div className="px-4 py-2">
              <div className="text-gray-700 font-medium mb-2">Sign In As:</div>
              <div className="space-y-2 ml-2">
                <Link 
                  to="/auth/buyer" 
                  onClick={toggleMenu}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Buyer
                </Link>
                <Link 
                  to="/auth/seller" 
                  onClick={toggleMenu}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                >
                  <User className="h-4 w-4 mr-2" />
                  Seller
                </Link>
              </div>
            </div>
            
            <Link 
              to="/dashboard" 
              onClick={toggleMenu}
              className="block mx-4 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-center rounded-full font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>
    </nav>
  );
};

export default Navbar;