import React from "react";
import { Link } from "react-router-dom";
const Directed = () => {
    return ( <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-16">Who is it for</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-green-600 mb-4">Farmers</h3>
                <p className="text-gray-600 mb-6">
                  If you don't have the time or energy to shop yourself, 
                  AgroMart connects you with trusted Farmers who can 
                  make the trips easy, secure, and rewarding.
                </p>
                <Link to="/auth">
                <button className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold">
                  Sign up
                </button>
                </Link>
              </div>
              
              <div className="mt-8">
                <img src="images\gettyimages-1940005387-612x612.jpg" alt="Happy shopper" className="w-full h-48 object-cover rounded-2xl" />
              </div>
            </div>
            
            <div>
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop" alt="Shopping bags" className="w-full h-48 object-cover rounded-2xl mb-8" />
              
              <div className="bg-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-green-600 mb-4">Buyers</h3>
                <p className="text-gray-600 mb-6">
                  For reliable Buyers who want to earn money by 
                  helping others buy and deliver the things they need 
                  while working on their own schedule.
                </p>
                <Link to="/auth">
                <button className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold">
                  Sign up
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> );
}
 
export default Directed;