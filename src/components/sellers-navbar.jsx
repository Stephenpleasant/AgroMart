import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Grid3X3, ShoppingBag, Wallet, Bell, HelpCircle, LogOut, Settings, Menu, X } from 'lucide-react';

const SellersNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { to: "/sellerdashboard", icon: Grid3X3, label: "Dashboard" },
    { to: "/orders", icon: ShoppingBag, label: "Order" },
    { to: "/wallet", icon: Wallet, label: "Wallet" },
    { to: "/notifications", icon: Bell, label: "Notification" },
    { to: "/support", icon: HelpCircle, label: "Support" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button - Only shows on small screens */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Navigation Sidebar - Always visible on desktop (md and up) */}
      <nav 
        className={`
          fixed left-0 top-0 h-screen w-64 bg-white shadow-lg 
          flex flex-col py-6 z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="mb-8 px-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
              <Leaf size={28} color="#4CAF50" />
            </div>
            <span className="text-xl font-bold text-gray-900">AgroMart</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col space-y-2 px-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            
            return (
              <Link 
                key={item.to}
                to={item.to} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-4 px-4 py-3 rounded-xl 
                  transition-all group relative
                  ${active 
                    ? 'bg-green-50 border border-green-200' 
                    : 'hover:bg-green-50 hover:border hover:border-green-200'
                  }
                `}
              >
                <Icon 
                  size={22} 
                  className={`
                    ${active ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'}
                  `}
                />
                <span 
                  className={`
                    text-sm font-medium
                    ${active ? 'text-green-600' : 'text-gray-700 group-hover:text-green-600'}
                  `}
                >
                  {item.label}
                </span>
                
                {/* Active indicator dot */}
                {active && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-green-600 rounded-r"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom section - Log out */}
        <div className="px-4 mt-auto">
          <button 
            className="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-red-50 hover:border hover:border-red-200 transition-all group w-full"
            onClick={() => {
              setIsMobileMenuOpen(false);
              // Add your logout logic here
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            <LogOut size={20} className="text-gray-600 group-hover:text-red-600" />
            <span className="text-sm text-gray-700 group-hover:text-red-600 font-medium">Log out</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default SellersNavbar;