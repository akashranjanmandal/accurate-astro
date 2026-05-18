// components/popup/Popup.jsx
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRocket, FaPhoneAlt, FaScroll, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Popup = () => {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('popupShown')
    if (alreadyShown) return

    const timer = setTimeout(() => {
      setIsVisible(true)
      sessionStorage.setItem('popupShown', 'true')
    }, 5000)

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
    } else {
      navigate(path)
    }
  }

  const services = [
    {
      id: 'demo',
      title: 'Free Consult',
      icon: <FaRocket className="text-2xl" />,
      path: '#demo',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-white/90',
      textColor: 'text-gray-800',
      hoverColor: 'hover:bg-blue-500'
    },
    {
      id: 'consultation',
      title: 'Consult',
      icon: <FaPhoneAlt className="text-2xl" />,
      path: '#consultation',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-white/90',
      textColor: 'text-gray-800',
      hoverColor: 'hover:bg-blue-500'
    },
    {
      id: 'kundli',
      title: 'Kundli',
      icon: <FaScroll className="text-2xl" />,
      path: '#kundli',
      bgColor: 'bg-amber-500',
      lightBg: 'bg-white/90',
      textColor: 'text-gray-800',
      hoverColor: 'hover:bg-amber-500'
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
                className="w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative"
                style={{ 
                  backgroundImage: "url('/images/popup.avif')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '500px'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
                
                {/* Content */}
                <div className="relative p-6 flex flex-col min-h-[500px]">
                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors z-10 bg-black/30 rounded-full p-2 backdrop-blur-sm"
                    aria-label="Close"
                  >
                    <FaTimes size={20} />
                  </button>
                  
                  {/* Header Text */}
                  <div className="text-center mt-8 mb-4">
                    <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                      Accurate Astro
                    </h2>
                    <p className="text-lg text-white/90 drop-shadow-md">
                      Your cosmic journey begins here
                    </p>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1"></div>

                  {/* Services - Three buttons with text */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleNavigation(service.path)}
                        className="group focus:outline-none"
                      >
                        <div className={`${service.lightBg} backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-white/20`}>
                          <div className={`w-14 h-14 ${service.bgColor} rounded-full flex items-center justify-center text-white mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:shadow-xl`}>
                            {service.icon}
                          </div>
                          <span className={`text-sm font-semibold ${service.textColor} drop-shadow-sm`}>
                            {service.title}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Maybe Later Button */}
                  <button
                    onClick={handleClose}
                    className="w-full text-white/90 hover:text-white transition-colors py-3 bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 font-medium"
                  >
                    Maybe later
                  </button>

                  {/* Small decorative text */}
                  <p className="text-xs text-white/60 text-center mt-4">
                    ✨ Click any option to begin your journey ✨
                  </p>
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