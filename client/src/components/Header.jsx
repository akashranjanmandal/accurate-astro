import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaBars, FaTimes, FaPhoneAlt } from 'react-icons/fa'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Book Demo', href: '#demo' },
    { name: 'Consultation', href: '#consultation' },
    { name: 'Blogs', href: '#blogs' },
    { name: 'Get Kundli', href: '#kundli' },
  ]

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3"
          >
            {/* Logo Image */}
            <div className="relative">
              <img 
                src="/images/logo.png" 
                alt="Accurate Astro Logo" 
                className="w-12 h-12 object-cover rounded-full border-2 border-purple-100"
                onError={(e) => {
                  console.error('Logo failed to load')
                  // Fallback to gradient logo
                  e.target.style.display = 'none'
                  const fallback = document.createElement('div')
                  fallback.className = 'w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center'
                  fallback.innerHTML = '<span class="text-white font-bold text-lg">AA</span>'
                  e.target.parentNode.appendChild(fallback)
                }}
              />
            </div>
            
            {/* Logo Text */}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Accurate Astro
              </h1>
              <p className="text-xs text-gray-500">Vedic Astrology Solutions</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
            
            {/* Call Now Button - Desktop */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+919876543210"
              className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition-shadow ml-4"
            >
              <FaPhoneAlt className="text-sm" />
              <span className="font-medium">Call Now</span>
            </motion.a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 lg:hidden">
            {/* Call Now Button - Mobile */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+919876543210"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm"
            >
              <FaPhoneAlt />
              <span className="hidden sm:inline">Call</span>
            </motion.a>
            
            <button
              className="text-gray-700 text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4"
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileTap={{ scale: 0.98 }}
                  className="text-gray-700 hover:text-purple-600 font-medium py-3 px-4 rounded-lg hover:bg-purple-50 transition-colors flex items-center group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item.name}
                </motion.a>
              ))}
              
              {/* Mobile Call Button */}
              <motion.a
                whileTap={{ scale: 0.98 }}
                href="tel:+919876543210"
                className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaPhoneAlt />
                <span>Call Now: +91 98765 43210</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export default Header