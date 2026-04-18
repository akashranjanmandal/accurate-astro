// components/Footer.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { 
  FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin 
} from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaYoutube />, href: '#', label: 'YouTube' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-gradient-to-b from-astro-dark to-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info with Logo */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              {/* Logo Image */}
              <div className="relative">
                <img 
                  src="/images/logo.png" 
                  alt="Accurate Astro Logo" 
                  className="w28 h-28 object-cover rounded-full"
                  onError={(e) => {
                    console.error('Footer logo failed to load')
                    e.target.src = 'https://via.placeholder.com/56x56?text=AA'
                  }}
                />
              </div>
              
            </div>
            
            <p className="text-gray-400 mb-6">
              Bringing ancient Vedic wisdom to the modern world with accurate predictions 
              and personalized guidance for life's journey.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Testimonials', 'Book Demo', 'Consultation', 'Blogs', 'Get Kundli'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {[
                'Personal Consultation',
                'Kundli Generation',
                'Marriage Compatibility',
                'Career Guidance',
                'Gemstone Recommendation',
                'Vastu Consultation'
              ].map((service) => (
                <li key={service} className="text-gray-400 flex items-center">
                  <FaStar className="text-blue-500 text-xs mr-3" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">Phone Number</p>
                  <p className="text-gray-400">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">Email Address</p>
                  <p className="text-gray-400">contact@accurateastro.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">Office Address</p>
                  <p className="text-gray-400">Astro Tower, Sector 45, Noida, UP 201301</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            © {currentYear} Accurate Astro. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </a>
            <a href="/refund" className="text-gray-400 hover:text-white text-sm">
              Refund Policy
            </a>
          </div>
        </div>

        {/* Developer Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 pt-6 border-t border-gray-800"
        >
          <p className="text-gray-500 text-sm">
            Developed with 💜 by <span className="text-blue-400 font-semibold">GOBT</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Cosmic energy flows through every line of code
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer