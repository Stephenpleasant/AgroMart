import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = ({ 
  title = "Ready to make shopping easier or earn as a personal shopper?", 
  buttonText = "Get started", 
  linkTo = "/auth/buyer",
  backgroundColor = "bg-green-600",
  icon: IconComponent = ShoppingCart,
  iconColor = "text-green-600"
}) => {
  return (
    <section className={`py-20 ${backgroundColor}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          <div className="flex justify-center mb-6">
            <IconComponent className={`h-16 w-16 ${iconColor}`} />
          </div>
          <Link to={linkTo}>
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;