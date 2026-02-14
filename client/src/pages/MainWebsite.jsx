// MainWebsite.jsx (updated)
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaPlay, FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaUser, FaClock, FaMapMarkerAlt, FaVenusMars, FaRocket, FaQuoteLeft, FaArrowRight } from 'react-icons/fa'
import Header from '../components/Header'
import Hero from '../components/Hero'
import AboutUs from '../components/AboutUs' 
import Testimonials from '../components/Testimonials'
import DemoBooking from '../components/DemoBooking'
import Consultation from '../components/Consultation'
import Blogs from '../components/Blogs'
import Kundli from '../components/Kundli'
import Footer from '../components/Footer'
import Popup from '../components/popup/Popup'
import api from '../utils/api'

const MainWebsite = () => {
  const [testimonials, setTestimonials] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 MainWebsite mounted, fetching data...')
    fetchTestimonials()
    fetchBlogs()
  }, [])

  const fetchTestimonials = async () => {
    try {
      console.log('📡 Fetching testimonials...')
      const response = await api.get('/testimonials', {
        params: {
          limit: 20,
          page: 1
        }
      })
      
      console.log('✅ API Response Full:', {
        success: response.data.success,
        testimonialsCount: response.data.testimonials?.length,
        totalInPagination: response.data.pagination?.total,
        allTestimonialIds: response.data.testimonials?.map(t => ({
          id: t.id,
          name: t.name,
          hasVideo: !!(t.video_id || t.youtube_url)
        }))
      })
      
      console.log('📊 Raw testimonials data:', JSON.stringify(response.data.testimonials, null, 2))
      
      if (response.data.success) {
        setTestimonials(response.data.testimonials || [])
        console.log('🎯 Setting state with:', response.data.testimonials?.length || 0, 'testimonials')
      }
      
    } catch (error) {
      console.error('❌ Error fetching testimonials:', error)
    }
  }

  const fetchBlogs = async () => {
    try {
      console.log('📞 Fetching blogs from /blogs')
      const response = await api.get('/blogs')
      console.log('✅ Blogs API Response:', response)
      console.log('📊 Response data:', response.data)
      console.log('📊 Response status:', response.status)
      
      if (response.data && Array.isArray(response.data)) {
        console.log('🎯 Setting blogs as array:', response.data.length)
        setBlogs(response.data)
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log('🎯 Setting blogs from response.data.data:', response.data.data.length)
        setBlogs(response.data.data)
      } else if (response.data && response.data.blogs && Array.isArray(response.data.blogs)) {
        console.log('🎯 Setting blogs from response.data.blogs:', response.data.blogs.length)
        setBlogs(response.data.blogs)
      } else {
        console.warn('⚠️ Unexpected blogs format:', response.data)
        setBlogs([])
      }
    } catch (error) {
      console.error('❌ Error fetching blogs:', error)
      console.error('Error details:', error.response ? error.response.data : error.message)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  console.log('📊 Current state - testimonials:', testimonials)
  console.log('📊 Current state - blogs:', blogs)
  console.log('📊 Loading:', loading)

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 star-background pointer-events-none z-0" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10">
        <Header />
        <Hero />
        <AboutUs />
        
        {/* Show loading state */}
        {loading && (
          <div className="section-padding text-center">
            <div className="inline-block p-4 bg-blue-100 text-blue-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading data from API...</span>
              </div>
            </div>
          </div>
        )}

        {/* Show if no data */}
        {!loading && testimonials.length === 0 && (
          <div className="section-padding text-center">
            <div className="inline-block p-4 bg-yellow-100 text-yellow-800 rounded-lg">
              <p>No testimonials found. Check if API is returning data.</p>
              <button 
                onClick={fetchTestimonials}
                className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Retry Fetch
              </button>
            </div>
          </div>
        )}

        {/* Pass data to components */}
        <Testimonials testimonials={testimonials} />
        <DemoBooking />
        <Consultation />
        <Blogs blogs={blogs} />
        <Kundli />
        <Footer />
      </div>

      {/* Add the Popup component */}
      <Popup />
    </div>
  )
}

export default MainWebsite