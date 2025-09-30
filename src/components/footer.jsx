import React from "react";
import { Leaf } from "lucide-react";

const Footer = ({
    icon: IconComponent = Leaf
}) => {
    return ( <footer className="bg-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <IconComponent className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">AgroMart</span>
            </div>
            <div className="text-center md:text-right">
              <p className="mb-2">Get our app now to get updates on our offers</p>
              <button className="bg-white text-green-700 px-6 py-2 rounded-full font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </footer> );
}
 
export default Footer;