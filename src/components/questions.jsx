import React from "react";
const Questions = () => {
    return (   <section className="py-20 bg-white">
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
      </section> );
}
 
export default Questions;