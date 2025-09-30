import React from "react";
import { Shield, CreditCard, Users, Star } from "lucide-react";

const Feature = [
  {
    icon: Shield,
    title: "Verified Buyers",
    description: "Browse Buyers by category, view their profiles and ratings."
  },
  {
    icon: CreditCard, 
    title: "Escrow Payment",
    description: "Pay securely, funds are held until order delivery is confirmed."
  },
  {
    icon: Users,
    title: "Post Requests", 
    description: "Create requests with item name, quantity, budget, and location."
  },
  {
    icon: Star,
    title: "Compare Bids",
    description: "View bids with shopper name, rating, prices and accept bid."
  }
];

const Features = ({ feature = Feature, title = "Core Features" }) => {
  return (
    <section className="py-20 bg-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1556741533-974d265c05bf?w=1200&h=600&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30" 
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {feature.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-black bg-opacity-50 p-6 rounded-xl text-center backdrop-blur-sm">
                <IconComponent className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;