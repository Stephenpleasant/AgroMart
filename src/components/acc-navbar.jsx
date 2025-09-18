import React from 'react';
import { Leaf,Receipt, FileText, Wallet, Settings, HelpCircle, LogOut} from 'lucide-react';
const Accnav = () => {
    return ( 
         <div className="w-64 bg-white shadow-lg flex flex-col">
     {/* Logo */}
      <div className="mb-2 mt-4 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
            <Leaf size={28} color="#4CAF50" />
          </div>
          <span className="text-xl font-bold text-gray-900">AgroMart</span>
        </div>
      </div>

     {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
       <ul className="space-y-2">
      <li>
        <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Receipt size={18} />
          <span>Transactions</span>
           </a>
          </li>
           <li>
        <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          <FileText size={18} />
           <span>Invoices</span>
           </a>
         </li>
      <li>
       <a href="#" className="flex items-center space-x-3 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
           <Wallet size={18} />
           <span className="font-medium">My Wallets</span>
                 </a>
        </li>
      <li>
       <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
        <Settings size={18} />
          <span>Settings</span>
        </a>
       </li>
       </ul>
    </nav>

    {/* Bottom Navigation */}
      <div className="p-4 border-t">
       <ul className="space-y-2">
        <li>
      <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
       <HelpCircle size={18} />
        <span>Help</span>
      </a>
       </li>
     <li>
     <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
         <LogOut size={18} />
          <span>Logout</span>
         </a>
       </li>
       </ul>
      </div>
            </div>
     );
}
 
export default Accnav;