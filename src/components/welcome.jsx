import React from 'react';
import Navbar from './navbar';
import CTASection from './CTA-sec';
import About from './about';
import Works from './work';
import Features from './features';
import Directed from './directed-to';
import Testimonials from './testimonal';
import Footer from './footer';
import Hero from './hero';
import Contact from './contact';
import Questions from './questions';

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
     <Hero />

      {/* About Section */}
     <About />

      {/* How It Works Section */}
     <Works />

      {/* Core Features Section */}
     <Features />

      {/* Who Is It For Section */}
     <Directed />

      {/* Testimonials Section */}
     <Testimonials />

      {/* FAQ Section */}
      <Questions />

      {/* Contact Section */}
     <Contact />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
     <Footer />
    </div>
  );
};

export default App;