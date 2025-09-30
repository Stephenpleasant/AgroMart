import React from "react";
import { Link } from "react-router-dom";
const Hero = () => {
    return (  <section id="home" className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Connecting 
                <span className="text-green-600 block">Farmers</span>
                <span className="text-gray-800">and Buyers</span>
    
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Whether you're buying or helping others shop, AgroMart
                makes the process easy, secure, and rewarding.
              </p>
              <div className="flex space-x-4">
                <Link to="/auth">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                  Sign up
                </button>
                </Link>
                <button className="border border-gray-300 text-green-700 hover:bg-green-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
                  Login
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-green-400 rounded-3xl p-8 transform rotate-3">
                <div className="bg-white rounded-2xl p-6 transform -rotate-3 shadow-xl">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <img src="images\gettyimages-1440572041-612x612.jpg" alt="Shopper 1" className="w-full h-20 object-cover rounded-lg" />
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=100&fit=crop&crop=face" alt="Shopper 3" className="w-full h-20 object-cover rounded-lg" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=100&fit=crop&crop=face" alt="Shopper 2" className="w-full h-20 object-cover rounded-lg" />
                    <img src="images\gettyimages-1468258861-612x612.jpg" alt="Shopper 3" className="w-full h-20 object-cover rounded-lg" />
                    
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Connect with trusted Buyers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> );
}
 
export default Hero;