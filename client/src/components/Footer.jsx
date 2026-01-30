import React from 'react'
import { motion } from 'framer-motion'
import { 
  FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin 
} from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-astro-dark to-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                <FaStar className="text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Accurate Astro</h3>
                <p className="text-sm text-purple-300">Divine Guidance, Modern Science</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Bringing ancient Vedic wisdom to the modern world with accurate predictions 
              and personalized guidance for life's journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Testimonials', 'Book Demo', 'Consultation', 'Blogs', 'Get Kundli'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
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
                <li key={service} className="text-gray-400">
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
                <FaPhone className="text-purple-400 mt-1" />
                <div>
                  <p className="font-semibold">Phone Number</p>
                  <p className="text-gray-400">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaEnvelope className="text-purple-400 mt-1" />
                <div>
                  <p className="font-semibold">Email Address</p>
                  <p className="text-gray-400">contact@accurateastro.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-purple-400 mt-1" />
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
          
        </div>

        {/* Developer Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 pt-6 border-t border-gray-800"
        >
          <p className="text-gray-500 text-sm">
            Developed with 💜 by <span className="text-purple-400 font-semibold">GOBT</span>
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