import React, { useState, useEffect } from 'react' // Added useEffect
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaTimes, FaStar, FaQuoteLeft, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa'
import ReactPlayer from 'react-player'

const Testimonials = ({ testimonials = [] }) => {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [isClient, setIsClient] = useState(false) // Added client check

  // Check if we're on client side for ReactPlayer
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Helper function to extract YouTube video ID - UPDATED
  const extractVideoId = (url) => {
    if (!url) return null
    
    console.log('🔗 Extracting from URL:', url)
    
    // Try multiple patterns
    const patterns = [
      // Standard watch URL
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      // Direct watch
      /watch\?v=([^"&?\/\s]{11})/i,
      // Short URL
      /youtu\.be\/([^"&?\/\s]{11})/i,
      // Embed URL
      /embed\/([^"&?\/\s]{11})/i,
      // With parameters
      /v=([^&]{11})/,
      // Just the ID (already extracted)
      /^([^&]{11})$/
    ]
    
    for (let i = 0; i < patterns.length; i++) {
      const match = url.match(patterns[i])
      if (match && match[1]) {
        const videoId = match[1]
        console.log('✅ Extracted video ID:', videoId)
        return videoId
      }
    }
    
    console.log('❌ Could not extract video ID')
    return null
  }

  // Ensure testimonials is always an array and process them
  const testimonialArray = Array.isArray(testimonials) ? testimonials : []
  
  // Process testimonials to ensure video_id is available
  const processedTestimonials = testimonialArray.map(testimonial => {
    // Debug each testimonial
    console.log('🔍 Processing testimonial:', {
      name: testimonial.name,
      youtube_url: testimonial.youtube_url,
      video_id: testimonial.video_id,
      extracted: extractVideoId(testimonial.youtube_url)
    })
    
    const videoId = testimonial.video_id || extractVideoId(testimonial.youtube_url)
    
    return {
      ...testimonial,
      video_id: videoId,
      hasVideo: !!videoId
    }
  })

  const displayedTestimonials = showAll ? processedTestimonials : processedTestimonials.slice(0, 3)

  const openVideoModal = (video) => {
    console.log('🎬 Opening video modal:', {
      name: video.name,
      video_id: video.video_id,
      youtube_url: video.youtube_url,
    })
    
    
    setSelectedVideo(video)
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
  }

  // Test YouTube URL function
  const testYouTubeUrl = (videoId) => {
    if (!videoId) return null
    return `https://www.youtube.com/watch?v=${videoId}`
  }

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-b from-white to-purple-50">
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

        {/* Show count and "Show More" button at the top if needed */}
        {processedTestimonials.length > 3 && (
          <div className="flex justify-between items-center mb-8">
            <div className="text-gray-600">
              Showing {showAll ? processedTestimonials.length : 3} of {processedTestimonials.length} testimonials
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 bg-gradient-to-r from-astro-purple to-astro-teal text-white rounded-full font-semibold hover:shadow-xl transition-shadow flex items-center space-x-2"
            >
              <span>{showAll ? 'Show Less' : 'Show All'}</span>
              <FaArrowRight className={showAll ? 'rotate-180 transition-transform' : ''} />
            </motion.button>
          </div>
        )}

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
              >
                {/* Video Thumbnail */}
                <div className="relative h-56 bg-gradient-to-br from-purple-600 to-indigo-600 cursor-pointer group" onClick={() => openVideoModal(testimonial)}>
                  {testimonial?.video_id ? (
                    <>
                      <img 
                        src={`https://img.youtube.com/vi/${testimonial.video_id}/maxresdefault.jpg`} 
                        alt={testimonial?.name || 'Testimonial'}
                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          console.log('❌ Thumbnail error, trying fallback')
                          e.target.src = `https://img.youtube.com/vi/${testimonial.video_id}/hqdefault.jpg`
                          e.target.onerror = () => {
                            console.log('❌ Fallback thumbnail also failed')
                            e.target.style.display = 'none'
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FaPlay className="text-white text-2xl ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <FaQuoteLeft className="text-3xl" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{testimonial?.name || 'Testimonial'}</h3>
                      <p className="text-sm opacity-90">Video testimonial</p>
                    </div>
                  )}
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <FaStar className="text-yellow-500" />
                    <span className="font-bold">{testimonial?.rating || 5}</span>
                  </div>
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
                    <button 
                      onClick={() => openVideoModal(testimonial)}
                      className="text-astro-purple hover:text-astro-dark font-semibold flex items-center space-x-2"
                      disabled={!testimonial?.video_id}
                    >
                      <span>{testimonial?.video_id ? 'Watch' : 'Read'}</span>
                      <FaArrowRight />
                    </button>
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

        {/* Show More/Less Button at bottom */}
        {processedTestimonials.length > 3 && (
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 bg-gradient-to-r from-astro-purple to-astro-teal text-white rounded-full font-semibold hover:shadow-xl transition-shadow flex items-center mx-auto space-x-2"
            >
              <span>{showAll ? 'Show Less Testimonials' : `Show All ${processedTestimonials.length} Testimonials`}</span>
              <FaArrowRight className={showAll ? 'rotate-180 transition-transform' : ''} />
            </motion.button>
          </div>
        )}

        {/* Video Modal - UPDATED WITH BETTER PLAYER */}
        <AnimatePresence>
          {selectedVideo && isClient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={closeVideoModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeVideoModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <FaTimes className="text-white text-xl" />
                </button>

                {/* Video Player - UPDATED */}
                <div className="relative pt-[56.25%] bg-black">
                  {selectedVideo.video_id ? (
                    <>
                      {/* Option 1: Use iframe directly (most reliable) */}
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideo.video_id}?autoplay=1&modestbranding=1&rel=0&controls=1`}
                        title={selectedVideo.name}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                      
                      {/* Option 2: Keep ReactPlayer as backup (uncomment if needed) */}
                      {/* 
                      <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${selectedVideo.video_id}`}
                        controls
                        playing={true}
                        width="100%"
                        height="100%"
                        className="absolute top-0 left-0"
                        config={{
                          youtube: {
                            playerVars: {
                              autoplay: 1,
                              modestbranding: 1,
                              rel: 0,
                              controls: 1,
                              showinfo: 0
                            }
                          }
                        }}
                        onError={(e) => {
                          console.error('❌ ReactPlayer error:', e)
                          // Fallback to iframe
                        }}
                      />
                      */}
                    </>
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                      <div className="text-white text-center p-8">
                        <FaQuoteLeft className="text-6xl mb-6 mx-auto opacity-50" />
                        <h3 className="text-2xl font-bold mb-4">{selectedVideo.name}</h3>
                        <p className="text-lg mb-4 italic">"{selectedVideo.description}"</p>
                        <div className="flex items-center justify-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FaStar className="text-yellow-500" />
                            <span className="font-bold">{selectedVideo.rating || 5}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaMapMarkerAlt />
                            <span>{selectedVideo.location || 'India'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                {selectedVideo.video_id && (
                  <div className="p-6 bg-gray-900">
                    <div className="flex flex-col md:flex-row md:items-center justify-between text-gray-300 gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{selectedVideo.name}</h3>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FaStar className="text-yellow-500" />
                            <span>{selectedVideo.rating || 5}/5</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaMapMarkerAlt />
                            <span>{selectedVideo.location || 'India'}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm opacity-75 max-w-md">
                        {selectedVideo.description || 'Testimonial video'}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Testimonials