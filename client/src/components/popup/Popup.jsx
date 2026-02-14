// components/popup/Popup.jsx
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRocket, FaPhoneAlt, FaScroll, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Popup = () => {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Clear session storage for testing (remove in production)
    sessionStorage.removeItem('popupShown')
    
    const timer = setTimeout(() => {
      console.log('Showing popup now')
      setIsVisible(true)
      sessionStorage.setItem('popupShown', 'true')
    }, 3000) // 3 seconds for testing

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleNavigation = (path) => {
    setIsVisible(false)
    
    if (path.startsWith('#')) {
      const element = document.getElementById(path.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const services = [
    {
      id: 'demo',
      title: 'Book Demo',
      icon: <FaRocket className="text-2xl" />,
      path: '#demo-booking',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'consultation',
      title: 'Consult',
      icon: <FaPhoneAlt className="text-2xl" />,
      path: '#consultation',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'kundli',
      title: 'Kundli',
      icon: <FaScroll className="text-2xl" />,
      path: '#kundli',
      bgColor: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-600',
      hoverColor: 'hover:bg-amber-600'
    }
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />

          {/* Popup Container - Perfectly Centered */}
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 via-blue-600 to-amber-600 p-6 text-center">
                  <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <FaTimes size={20} />
                  </button>
                  
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Accurate Astro
                  </h2>
                  <p className="text-sm text-white/90">
                    Your cosmic journey begins here
                  </p>
                </div>

                {/* Services */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleNavigation(service.path)}
                        className="group focus:outline-none"
                      >
                        <div className={`${service.lightBg} rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}>
                          <div className={`w-14 h-14 ${service.bgColor} rounded-full flex items-center justify-center text-white mb-2 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            {service.icon}
                          </div>
                          <span className={`text-sm font-semibold ${service.textColor}`}>
                            {service.title}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Maybe Later Button */}
                  <button
                    onClick={handleClose}
                    className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
                  >
                    Maybe later
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Popup