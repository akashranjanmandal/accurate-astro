// components/Consultation.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { FaUser, FaPhoneAlt, FaEnvelope, FaCreditCard, FaLock, FaShieldAlt, FaCalendar, FaVenusMars } from 'react-icons/fa'
import api from '../utils/api'

const Consultation = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [showPayment, setShowPayment] = useState(false)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const displayRazorpay = async (orderData) => {
    const res = await loadRazorpayScript()
    if (!res) {
      toast.error('Razorpay SDK failed to load. Check your connection')
      return
    }

    const options = {
      key: 'rzp_test_S9LiztGfZXMOh1',
      amount: orderData.amount,
      currency: 'INR',
      name: 'Accurate Astro',
      description: 'Astrology Consultation',
      order_id: orderData.orderId,
      handler: async (response) => {
        try {
          const verifyResponse = await api.post('consultations/verify', {
            ...response,
            consultationId: orderData.consultationId
          })
          
          if (verifyResponse.data.success) {
            toast.success('Payment successful! Consultation booked.')
            setShowPayment(false)
          } else {
            toast.error('Payment verification failed')
          }
        } catch (error) {
          toast.error('Payment verification error')
        }
      },
      prefill: {
        name: orderData.name,
        email: orderData.email,
        contact: orderData.phone
      },
      theme: {
        color: '#8B5CF6'
      },
      modal: {
        ondismiss: () => {
          toast.error('Payment cancelled')
          setShowPayment(false)
        }
      }
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  const onSubmit = async (data) => {
    try {
      const response = await api.post('consultations/create', data)
      if (response.data.success) {
        setShowPayment(true)
        await displayRazorpay({
          ...data,
          consultationId: response.data.consultationId,
          amount: response.data.amount,
          orderId: response.data.orderId
        })
      }
    } catch (error) {
      toast.error('Failed to create consultation')
      console.error('Error:', error)
    }
  }

  // Get max date (18 years ago for minimum age)
  const getMaxDate = () => {
    const today = new Date()
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    return maxDate.toISOString().split('T')[0]
  }

  // Get min date (100 years ago)
  const getMinDate = () => {
    const today = new Date()
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
    return minDate.toISOString().split('T')[0]
  }

  return (
    <section id="consultation" className="section-padding bg-gradient-to-b from-white to-blue-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center mb-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
              <FaShieldAlt className="mr-2" />
              <span className="font-semibold">Secure Booking</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Book Your <span className="gradient-text">Personal Consultation</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get comprehensive astrology guidance with our expert consultation. 
              One-on-one session with detailed analysis of your birth chart.
            </p>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 card-hover"
          >
            <div className="md:flex">
              {/* Left Side - Benefits */}
              <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-8">
                <h3 className="text-2xl font-bold mb-6">What You'll Get</h3>
                <ul className="space-y-4">
                  {[
                    '60-minute personal consultation',
                    'Detailed birth chart analysis',
                    'Planetary position interpretation',
                    'Career & financial guidance',
                    'Relationship compatibility',
                    'Remedial solutions',
                    'Follow-up support',
                    'Digital report'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <FaShieldAlt className="text-xs" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Side - Form & Payment */}
              <div className="md:w-1/2 p-8">
                <div className="text-center mb-8">
                  <div className="inline-block px-6 py-2 bg-blue-100 text-blue-700 rounded-full mb-4">
                    <span className="text-sm font-semibold">One-Time Payment</span>
                  </div>
                  <div className="flex items-end justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-800">₹600</span>
                    <span className="text-gray-500 ml-2">/ consultation</span>
                  </div>
                  <p className="text-gray-500 text-sm">Fixed price - No hidden charges</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="form-label">
                      <FaUser className="inline mr-2" /> Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="form-label">
                      <FaEnvelope className="inline mr-2" /> Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email address'
                        }
                      })}
                      className="form-input"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="form-label">
                      <FaPhoneAlt className="inline mr-2" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Enter a valid 10-digit phone number'
                        }
                      })}
                      className="form-input"
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="form-label">
                      <FaCalendar className="inline mr-2" /> Date of Birth *
                    </label>
                    <input
                      type="date"
                      {...register('dob', { 
                        required: 'Date of birth is required',
                        validate: {
                          minAge: (value) => {
                            const dob = new Date(value)
                            const today = new Date()
                            const age = today.getFullYear() - dob.getFullYear()
                            const monthDiff = today.getMonth() - dob.getMonth()
                            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                              return age - 1 >= 18 || 'You must be at least 18 years old'
                            }
                            return age >= 18 || 'You must be at least 18 years old'
                          },
                          validDate: (value) => {
                            const dob = new Date(value)
                            const minDate = new Date(getMinDate())
                            const maxDate = new Date(getMaxDate())
                            return (dob >= minDate && dob <= maxDate) || 'Please enter a valid date of birth'
                          }
                        }
                      })}
                      className="form-input"
                      min={getMinDate()}
                      max={getMaxDate()}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      You must be at least 18 years old
                    </p>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="form-label">
                      <FaVenusMars className="inline mr-2" /> Gender *
                    </label>
                    <select
                      {...register('gender', { required: 'Gender is required' })}
                      className="form-input"
                      defaultValue=""
                    >
                      <option value="" disabled>Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                    )}
                  </div>

                  {/* Security Info */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <FaLock className="text-blue-600" />
                      <div>
                        <p className="font-semibold text-sm">Secure Payment</p>
                        <p className="text-xs text-gray-500">Powered by Razorpay • SSL Encrypted</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || showPayment}
                    className={`w-full py-4 rounded-lg font-bold text-white transition-all flex items-center justify-center space-x-2 ${
                      isSubmitting || showPayment
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    }`}
                  >
                    <FaCreditCard />
                    <span>{isSubmitting ? 'Processing...' : showPayment ? 'Opening Payment...' : 'Pay ₹600 & Book Now'}</span>
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Testimonials Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 text-center"
          >
            {[
              { icon: '⭐', text: '4.9/5 Average Rating' },
              { icon: '👥', text: '10,000+ Satisfied Clients' },
              { icon: '⏱️', text: '24/7 Customer Support' }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-semibold text-gray-700">{item.text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Consultation