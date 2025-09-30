import React from "react";
import { CreditCard } from "lucide-react";
const Works = ({
    icon: IconComponent = CreditCard
}) => {
    return (  
        <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center space-x-4 mb-8">
           
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Shop in 4 Easy Steps
            </h2>
            <p className="text-lg text-gray-600">Get your shopping done in four simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-orange-100 rounded-2xl p-6 mb-4">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=150&fit=crop" alt="Request" className="w-full h-24 object-cover rounded-lg" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Request</h3>
              <p className="text-gray-600">Post your shopping request with details about what you need and when.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-orange-100 rounded-2xl p-6 mb-4">
                <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop" alt="Receive Bids" className="w-full h-24 object-cover rounded-lg" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Receive Bids</h3>
              <p className="text-gray-600">Get proposals from qualified Buyers with pricing and timelines.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-2xl p-6 mb-4">
                <IconComponent className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Pay Securely</h3>
              <p className="text-gray-600">Choose your shopper and pay safely through our secure system.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-orange-100 rounded-2xl p-6 mb-4">
                <img src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=150&fit=crop" alt="Get Delivery" className="w-full h-24 object-cover rounded-lg" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Delivery</h3>
              <p className="text-gray-600">Receive your items and rate your shopping experience.</p>
            </div>
          </div>
        </div>
      </section>
    );
}
 
export default Works;