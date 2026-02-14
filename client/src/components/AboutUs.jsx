// components/AboutUs.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaAward, FaUserFriends, FaGlobe, FaChartLine, FaShieldAlt } from 'react-icons/fa'

const AboutUs = () => {
  const features = [
    {
      icon: <FaAward className="text-3xl" />,
      title: "Vedic Astrology Experts",
      description: "Our team consists of certified Vedic astrologers with decades of experience.",
      delay: 0.1
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Accurate Predictions",
      description: "Using ancient calculations combined with modern technology for precision.",
      delay: 0.2
    },
    {
      icon: <FaUserFriends className="text-3xl" />,
      title: "Personalized Guidance",
      description: "Every consultation is tailored to your unique birth chart and circumstances.",
      delay: 0.3
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Confidential & Secure",
      description: "Your personal information and consultations are kept completely private.",
      delay: 0.4
    },
  ]



  return (
    <section id="about" className="section-padding bg-gradient-to-b from-white to-blue-50">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Accurate Astro</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in navigating life's journey through the ancient wisdom of Vedic astrology
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden ">
                <img 
  src="/images/about-image.jpeg"
  alt="Vedic Astrology Consultation"
  className="w-full h-[500px] object-cover"
/>
              </div>

              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaStar className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">25+ Years</p>
                    <p className="text-sm text-gray-600">Of Experience</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl shadow-xl text-white"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <FaAward className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Certified</p>
                    <p className="text-sm opacity-90">Vedic Experts</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h3 className="text-3xl font-bold mb-6 text-gray-800">
              Guiding Your Destiny with Precision & Care
            </h3>
            
            <div className="space-y-4 mb-8">
              <p className="text-gray-600 leading-relaxed">
                At <span className="font-semibold text-blue-600">Accurate Astro</span>, we blend ancient Vedic wisdom with modern technology to provide you with the most accurate astrological insights. Our mission is to empower you with knowledge about your destiny, relationships, career, and life purpose.
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                Founded in 2001, we have helped thousands of individuals navigate life's challenges and opportunities. Our team of certified Vedic astrologers meticulously analyzes your birth chart using precise mathematical calculations and planetary positions.
              </p>
            
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg hover:bg-white transition-colors duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  )
}

export default AboutUs