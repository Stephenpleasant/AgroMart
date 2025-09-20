import React from 'react';
import { Leaf, Users,  ShoppingCart, Star,  Shield, CreditCard } from 'lucide-react';
import Navbar from './navbar';

const App = () => {
  const handleGetStarted = () => {
    // For now, just scroll to contact section
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Connecting 
                <span className="text-green-600 block">users</span>
                <span className="text-gray-800">and Buyers</span>
    
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Whether you're buying or helping others shop, AgroMart
                makes the process easy, secure, and rewarding.
              </p>
              <div className="flex space-x-4">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                  Sign up
                </button>
                <button className="border border-gray-300 text-green-700 hover:bg-green-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
                  Login
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl p-8 transform rotate-3">
                <div className="bg-white rounded-2xl p-6 transform -rotate-3 shadow-xl">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=100&fit=crop&crop=face" alt="Shopper 1" className="w-full h-20 object-cover rounded-lg" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=100&fit=crop&crop=face" alt="Shopper 2" className="w-full h-20 object-cover rounded-lg" />
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=100&fit=crop&crop=face" alt="Shopper 3" className="w-full h-20 object-cover rounded-lg" />
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=100&fit=crop&crop=face" alt="Shopper 4" className="w-full h-20 object-cover rounded-lg" />
                  </div>
                  <div className="text-center">
                    <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=face" alt="Main shopper" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-green-200" />
                    <div className="text-sm text-gray-600">Connect with trusted Buyers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">ABOUT US</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop" alt="Fresh produce 1" className="w-full h-32 object-cover rounded-lg" />
              <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop" alt="Shopping experience" className="w-full h-32 object-cover rounded-lg" />
              <img src="https://images.unsplash.com/photo-1586952518485-11b180e92764?w=300&h=200&fit=crop" alt="Fresh vegetables" className="w-full h-32 object-cover rounded-lg" />
            </div>
            
            <div>
              <p className="text-lg text-gray-600 mb-6">
                AgroMart connects buyers with trusted personal Buyers who purchase and deliver fresh agri products exactly what they want.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Buyers post requests, get competitive bids, and choose the best offer. Buyers earn flexibly while helping others.
              </p>
              <div className="flex space-x-4">
                <button className="bg-green-900 text-white px-6 py-3 rounded-full font-semibold">Farmers</button>
                <button className="bg-green-100 text-green-600 px-6 py-3 rounded-full font-semibold">Buyers</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center space-x-4 mb-8">
              <button className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold">Farmers</button>
              <button className="bg-green-100 text-green-600 px-6 py-3 rounded-full font-semibold">Buyers</button>
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
                <CreditCard className="h-12 w-12 text-blue-600 mx-auto" />
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

      {/* Core Features Section */}
      <section className="py-20 bg-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1556741533-974d265c05bf?w=1200&h=600&fit=crop" alt="Background" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Core Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-black bg-opacity-50 p-6 rounded-xl text-center backdrop-blur-sm">
              <Shield className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Buyers</h3>
              <p className="text-gray-300 text-sm">Browse Buyers by category, view their profiles and ratings.</p>
            </div>
            
            <div className="bg-black bg-opacity-50 p-6 rounded-xl text-center backdrop-blur-sm">
              <CreditCard className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Escrow Payment</h3>
              <p className="text-gray-300 text-sm">Pay securely, funds are held until order delivery is confirmed.</p>
            </div>
            
            <div className="bg-black bg-opacity-50 p-6 rounded-xl text-center backdrop-blur-sm">
              <Users className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Post Requests</h3>
              <p className="text-gray-300 text-sm">Create requests with item name, quantity, budget, and location.</p>
            </div>
            
            <div className="bg-black bg-opacity-50 p-6 rounded-xl text-center backdrop-blur-sm">
              <Star className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Compare Bids</h3>
              <p className="text-gray-300 text-sm">View bids with shopper name, rating, prices and accept bid.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-16">Who is it for</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-green-600 mb-4">Farmers</h3>
                <p className="text-gray-600 mb-6">
                  If you don't have the time or energy to shop yourself, 
                  AgroMart connects you with trusted Buyers who can 
                  make the trips easy, secure, and rewarding.
                </p>
                <button className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold">
                  Sign up
                </button>
              </div>
              
              <div className="mt-8">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop" alt="Happy shopper" className="w-full h-48 object-cover rounded-2xl" />
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
                <button className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold">
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
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
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
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
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Frequently Asked Questions – AgroMart
              </h2>
              
              <div className="space-y-4">
                {[
                  "What is AgroMart?",
                  "How does AgroMart work?",
                  "Is it safe to pay through AgroMart?",
                  "Can I choose the shopper I want?",
                  "How do I place a shopping request?"
                ].map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{question}</span>
                      <span className="text-gray-500">+</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-2xl p-12 mb-8">
                <div className="text-6xl mb-4">❓</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Have more questions?</h3>
              <p className="text-gray-600 mb-6">Send a direct email to our customer care</p>
              <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold">
                Send Email
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1556741533-974d265c05bf?w=1200&h=600&fit=crop" alt="Contact background" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Contact Us</h2>
          
          <div className="bg-black bg-opacity-50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  placeholder="John Smith"
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="johnsmith@gmail.com"
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <select className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <textarea
                  rows={4}
                  placeholder="Write your full message here"
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to make shopping easier or earn as a personal shopper?
            </h2>
            <div className="flex justify-center mb-6">
              <ShoppingCart className="h-16 w-16 text-green-600" />
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Get started
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Leaf className="h-8 w-8 text-green-400" />
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
      </footer>
    </div>
  );
};

export default App;