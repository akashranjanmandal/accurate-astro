// components/Testimonials.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaTimes, FaStar, FaQuoteLeft, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa'

const Testimonials = ({ testimonials = [] }) => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Check if we're on client side for ReactPlayer
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Helper function to extract YouTube video ID
  const extractVideoId = (url) => {
    if (!url) return null
    
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      /watch\?v=([^"&?\/\s]{11})/i,
      /youtu\.be\/([^"&?\/\s]{11})/i,
      /embed\/([^"&?\/\s]{11})/i,
      /v=([^&]{11})/
    ]
    
    for (let pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    
    return null
  }

  // Ensure testimonials is always an array and process them
  const testimonialArray = Array.isArray(testimonials) ? testimonials : []
  
  // Process testimonials
  const processedTestimonials = testimonialArray.map(testimonial => {
    const videoId = testimonial.video_id || extractVideoId(testimonial.youtube_url)
    const hasVideo = !!videoId
    const hasText = !!testimonial.description && testimonial.description.trim().length > 0
    
    return {
      ...testimonial,
      video_id: videoId,
      hasVideo,
      hasText,
      type: hasVideo ? (hasText ? 'video_and_text' : 'video_only') : (hasText ? 'text_only' : 'no_content')
    }
  })

  const displayedTestimonials = showAll ? processedTestimonials : processedTestimonials.slice(0, 3)

  const openModal = (testimonial) => {
    setSelectedTestimonial(testimonial)
  }

  const closeModal = () => {
    setSelectedTestimonial(null)
  }

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-b from-white to-blue-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="text-astro-gold font-semibold text-sm uppercase tracking-wider">Success Stories</span>
            <div className="h-1 w-20 bg-gradient-to-r from-astro-gold to-astro-teal mx-auto mt-2" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Transforming Lives</span> Through Astrology
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our satisfied clients about their life-changing experiences with Accurate Astro.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {displayedTestimonials.length > 0 ? (
            displayedTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial?.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden card-hover"
                onClick={() => openModal(testimonial)}
              >
                {/* Card Content */}
                {testimonial.hasVideo ? (
                  // Video Testimonial Card
                  <div className="relative h-56 bg-gradient-to-br from-blue-600 to-indigo-600 cursor-pointer group">
                    <img 
                      src={`https://img.youtube.com/vi/${testimonial.video_id}/maxresdefault.jpg`} 
                      alt={testimonial?.name || 'Testimonial'}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${testimonial.video_id}/hqdefault.jpg`
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaPlay className="text-white text-2xl ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Text Only Testimonial Card
                  <div className="h-56 bg-gradient-to-br from-blue-500 to-indigo-500 cursor-pointer group flex flex-col items-center justify-center p-6 text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <FaQuoteLeft className="text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-center">{testimonial?.name || 'Client Testimonial'}</h3>
                    <div className="flex items-center justify-center">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-300 mx-0.5" />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                  <FaStar className="text-yellow-500" />
                  <span className="font-bold">{testimonial?.rating || 5}</span>
                </div>

                {/* Testimonial Content */}
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <FaQuoteLeft className="text-astro-light text-2xl mr-3 mt-1" />
                    <p className="text-gray-600 italic line-clamp-3">
                      {testimonial?.description || 'Life-changing consultation! Highly recommended.'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <h4 className="font-bold text-gray-800">{testimonial?.name || 'Happy Client'}</h4>
                      <p className="text-sm text-gray-500 flex items-center">
                        <FaMapMarkerAlt className="mr-1" /> {testimonial?.location || 'India'}
                      </p>
                    </div>
                    <div className="text-astro-blue hover:text-astro-dark font-semibold flex items-center space-x-2">
                      <span>{testimonial.hasVideo ? 'Watch' : 'Read'}</span>
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No testimonials available yet</div>
              <p className="text-gray-500">Check back soon for client success stories!</p>
            </div>
          )}
        </div>

        {/* Show More/Less Button */}
        {processedTestimonials.length > 3 && (
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 bg-gradient-to-r from-astro-blue to-astro-teal text-white rounded-full font-semibold hover:shadow-xl transition-shadow flex items-center mx-auto space-x-2"
            >
              <span>{showAll ? 'Show Less Testimonials' : `Show All ${processedTestimonials.length} Testimonials`}</span>
              <FaArrowRight className={showAll ? 'rotate-180 transition-transform' : ''} />
            </motion.button>
          </div>
        )}

        {/* Testimonial Modal */}
        <AnimatePresence>
          {selectedTestimonial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                  <FaTimes className="text-white text-xl" />
                </button>

                {/* Modal Content */}
                <div className="max-h-[90vh] overflow-y-auto">
                  {selectedTestimonial.hasVideo ? (
                    // Video Modal
                    <div className="relative pt-[56.25%] bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedTestimonial.video_id}?autoplay=1&modestbranding=1&rel=0&controls=1`}
                        title={selectedTestimonial.name}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  ) : (
                    // Text Only Modal
                    <div className="p-8 md:p-12">
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FaQuoteLeft className="text-white text-3xl" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">{selectedTestimonial.name}</h3>
                        <div className="flex items-center justify-center space-x-4 mb-6">
                          <div className="flex items-center space-x-1">
                            <FaStar className="text-yellow-500" />
                            <span className="font-bold">{selectedTestimonial.rating || 5}/5</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaMapMarkerAlt />
                            <span>{selectedTestimonial.location || 'India'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 mb-6">
                        <div className="flex items-start">
                          <FaQuoteLeft className="text-blue-400 text-3xl mr-4 mt-1 flex-shrink-0" />
                          <p className="text-lg md:text-xl text-gray-700 italic leading-relaxed">
                            "{selectedTestimonial.description || 'Life-changing consultation! Highly recommended.'}"
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-center text-gray-500 text-sm">
                        Testimonial submitted on {new Date(selectedTestimonial.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  
                  {/* Video Info (only for video testimonials) */}
                  {selectedTestimonial.hasVideo && (
                    <div className="p-6 bg-gray-50 border-t">
                      <div className="flex flex-col md:flex-row md:items-center justify-between text-gray-700 gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedTestimonial.name}</h3>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <FaStar className="text-yellow-500" />
                              <span>{selectedTestimonial.rating || 5}/5</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FaMapMarkerAlt />
                              <span>{selectedTestimonial.location || 'India'}</span>
                            </div>
                          </div>
                        </div>
                        {selectedTestimonial.description && (
                          <p className="text-sm opacity-90 max-w-md">
                            {selectedTestimonial.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Testimonials