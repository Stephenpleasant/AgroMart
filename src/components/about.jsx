import React from "react";
import { Link } from "react-router-dom";
const About = ({
    title = "About Us",
    description = "AgroMart connects farmers with trusted personal Buyers who purchase and deliver fresh agri products exactly what they want. Framers post farm goods, get competitive bids, and sell their goods. Farmers earn flexibly while helping others.",
    buttonText1 = "Farmers",
    buttonText2 = "Buyers"
}) => {
    return ( 
          <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">{title}</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop" alt="Fresh produce 1" className="w-full h-32 object-cover rounded-lg" />
              <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop" alt="Shopping experience" className="w-full h-32 object-cover rounded-lg" />
              <img src="https://images.unsplash.com/photo-1586952518485-11b180e92764?w=300&h=200&fit=crop" alt="Fresh vegetables" className="w-full h-32 object-cover rounded-lg" />
            </div>
            
            <div>
              <p className="text-lg text-gray-600 mb-6">
                {description}
                  </p>
              <p className="text-lg text-gray-600 mb-8">
                Farmers post farm goods, get competitive bids, and sell their goods. Farmers earn flexibly while helping others.
              </p>
              <div className="flex space-x-4">
                <Link to="/auth">
                <button className="bg-green-900 text-white px-6 py-3 rounded-full font-semibold">{buttonText1}</button></Link>
                <Link to= "/auth">
                <button className="bg-green-100 text-green-600 px-6 py-3 rounded-full font-semibold">{buttonText2}</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

     );
}
 
export default About;