import React from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaArrowRight } from 'react-icons/fa'

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content - Added padding for desktop */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left md:pl-8 lg:pl-12 xl:pl-16"
          >
            <div className="inline-flex items-center space-x-2 mb-6 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
              <FaStar className="text-yellow-500" />
              <span className="font-semibold">Trusted by 10,000+ Clients Worldwide</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Your{' '}
              <span className="gradient-text">Cosmic Blueprint</span>
              {' '}with Precision
            </h1>

            <p className="text-xl text-gray-600 mb-8 md:pr-8">
              Unveil your destiny through ancient Vedic wisdom combined with modern technology. 
              Get accurate predictions, personalized guidance, and life-changing insights.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8 md:pr-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">99%</div>
                <div className="text-sm text-gray-500">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">10K+</div>
                <div className="text-sm text-gray-500">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-500">27</div>
                <div className="text-sm text-gray-500">Nakshatras Expert</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 md:pr-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center justify-center space-x-2"
                onClick={() => document.getElementById('consultation').scrollIntoView({ behavior: 'smooth' })}
              >
                <span>Book Consultation</span>
                <FaArrowRight />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center justify-center space-x-2"
                onClick={() => document.getElementById('kundli').scrollIntoView({ behavior: 'smooth' })}
              >
                <span>Get Your Kundli</span>
                <FaStar />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Content - Animated Zodiac Wheel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative md:pr-8 lg:pr-12 xl:pr-16"
          >
            <div className="relative w-96 h-96 mx-auto">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-8 border-purple-200 rounded-full animate-spin-slow" />
              
              {/* Middle Ring */}
              <div className="absolute inset-12 border-4 border-amber-200 rounded-full animate-spin-slow-reverse" />
              
              {/* Inner Circle */}
              <div className="absolute inset-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl font-bold">ॐ</div>
                  <div className="text-sm mt-2">Cosmic Energy</div>
                </div>
              </div>

              {/* Zodiac Symbols */}
              {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((sign, index) => (
                <div
                  key={sign}
                  className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: `${50 + 40 * Math.sin((index * Math.PI) / 6)}%`,
                    left: `${50 + 40 * Math.cos((index * Math.PI) / 6)}%`,
                  }}
                >
                  <span className="text-2xl">{sign}</span>
                </div>
              ))}

              {/* Floating Planets */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-8 left-8 w-8 h-8 bg-yellow-400 rounded-full shadow-lg"
              />
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-8 right-8 w-6 h-6 bg-red-400 rounded-full shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero