import React from "react";
import { Star } from "lucide-react";
const Testimonials = ({
    icon: IconComponent = Star
}) => {
    return (  <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="text-sm text-green-600 font-semibold mb-2">Testimonials</div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                  What People Say When We Pitch AgroMart
                </h2>
                <div className="flex justify-center items-center space-x-2 mb-8">
                  <span className="text-2xl font-bold">4.8</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <IconComponent key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-yellow-50 p-8 rounded-2xl">
                  <div className="text-4xl text-yellow-500 mb-4">"</div>
                  <p className="text-gray-800 mb-6">
                    This would save me so much time. I'm always begging people abroad to help me shop.
                  </p>
                  <div className="text-sm text-gray-600">— Fola, Fashion Retailer</div>
                </div>
                
                <div className="bg-yellow-50 p-8 rounded-2xl">
                  <div className="text-4xl text-yellow-500 mb-4">"</div>
                  <p className="text-gray-800 mb-6">
                    Wait— I can just send what I want, and verified Buyers will bid to buy it for me? That's genius.
                  </p>
                  <div className="text-sm text-gray-600">— Annie, Busy Mum</div>
                </div>
              </div>
            </div>
          </section> );
}
 
export default Testimonials;