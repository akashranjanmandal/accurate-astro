import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { 
  FaUser, FaPhoneAlt, FaEnvelope, FaCalendar, FaClock, 
  FaMapMarkerAlt, FaVenusMars, FaStar, FaPlay, FaLock 
} from 'react-icons/fa'
import api from '../utils/api'

const Kundli = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm()
  const [withBirthTime, setWithBirthTime] = useState(false)
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
      description: 'Kundli Generation',
      order_id: orderData.orderId,
      handler: async (response) => {
        try {
          const verifyResponse = await api.post('kundli/verify', {
            ...response,
            kundliId: orderData.kundliId
          })
          
          if (verifyResponse.data.success) {
            toast.success('Payment successful! Your kundli will be generated.')
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
        color: '#0D9488'
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
    data.with_birth_time = withBirthTime
    if (!withBirthTime) {
      data.birth_time = null
    }

    try {
      const response = await api.post('kundli/create', data)
      if (response.data.success) {
        setShowPayment(true)
        await displayRazorpay({
          ...data,
          kundliId: response.data.kundliId,
          amount: response.data.amount,
          orderId: response.data.orderId
        })
      }
    } catch (error) {
      toast.error('Failed to create kundli request')
      console.error('Error:', error)
    }
  }

  return (
    <section id="kundli" className="section-padding bg-gradient-to-b from-white to-teal-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl p-8 card-hover"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center mb-4 bg-teal-100 text-teal-700 px-4 py-2 rounded-full">
                <FaStar className="mr-2" />
                <span className="font-semibold">Generate Your Birth Chart</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Get Your <span className="text-teal-600">Hand Written Kundli Report</span></h2>
              <p className="text-gray-600">Complete birth chart analysis with personalized predictions</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Toggle Birth Time */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="font-medium">Without Birth Time</span>
                <button
                  type="button"
                  onClick={() => setWithBirthTime(!withBirthTime)}
                  className={`relative w-16 h-8 rounded-full transition-colors ${withBirthTime ? 'bg-teal-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${withBirthTime ? 'left-9' : 'left-1'}`} />
                </button>
                <span className="font-medium">With Birth Time</span>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    <FaUser className="inline mr-2" /> Full Name
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="form-input"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    <FaVenusMars className="inline mr-2" /> Gender
                  </label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className="form-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                  )}
                </div>
              </div>

              {/* Birth Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    <FaCalendar className="inline mr-2" /> Birth Date
                  </label>
                  <input
                    type="date"
                    {...register('birth_date', { required: 'Birth date is required' })}
                    className="form-input"
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.birth_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.birth_date.message}</p>
                  )}
                </div>

                {withBirthTime && (
                  <div>
                    <label className="form-label">
                      <FaClock className="inline mr-2" /> Birth Time
                    </label>
                    <input
                      type="time"
                      {...register('birth_time', { required: withBirthTime ? 'Birth time is required' : false })}
                      className="form-input"
                    />
                    {errors.birth_time && (
                      <p className="text-red-500 text-sm mt-1">{errors.birth_time.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Birth Place */}
              <div>
                <label className="form-label">
                  <FaMapMarkerAlt className="inline mr-2" /> Birth Place
                </label>
                <input
                  type="text"
                  {...register('birth_place', { required: 'Birth place is required' })}
                  className="form-input"
                  placeholder="City, State, Country"
                />
                {errors.birth_place && (
                  <p className="text-red-500 text-sm mt-1">{errors.birth_place.message}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    <FaPhoneAlt className="inline mr-2" /> Phone Number
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
                    placeholder="Enter your phone"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    <FaEnvelope className="inline mr-2" /> Email Address
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
              </div>

              {/* Security & Payment Info */}
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <div className="flex items-start space-x-3">
                  <FaLock className="text-teal-600 mt-1" />
                  <div>
                    <p className="font-semibold text-sm mb-1">Secure & Confidential</p>
                    <p className="text-xs text-gray-600">
                      Your birth details are encrypted and used only for generating your kundli. 
                      We never share your personal information with third parties.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing & Submit */}
              <div className="text-center space-y-4">
                <div className="inline-block bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-full">
                  <span className="text-2xl font-bold">₹1999</span>
                  <span className="ml-2">One-Time Payment</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || showPayment}
                  className={`w-full py-4 rounded-lg font-bold text-white transition-all flex items-center justify-center space-x-2 ${
                    isSubmitting || showPayment
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700'
                  }`}
                >
                  <FaStar />
                  <span>
                    {isSubmitting ? 'Processing...' : showPayment ? 'Opening Payment...' : 'Pay ₹300 & Generate Kundli'}
                  </span>
                </motion.button>

                <p className="text-sm text-gray-500">
                  By proceeding, you agree to our terms and privacy policy.
                </p>
              </div>
            </form>
          </motion.div>

          {/* Right Content - Demo Video & Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Demo Video */}
            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-1">
              <div className="bg-black rounded-xl overflow-hidden">
                <div className="relative pt-[56.25%]">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-indigo-900/80 flex items-center justify-center">
                    <button className="group">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaPlay className="text-white text-3xl ml-2" />
                      </div>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Kundli Demo Video</h3>
                  <p className="text-teal-100">
                    Watch how we generate detailed birth charts with accurate planetary positions and predictions.
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">What's Included in Your Kundli Report:</h3>
              
              {[
                {
                  icon: '🌙',
                  title: 'Moon Sign Analysis',
                  description: 'Detailed analysis of your emotional nature and subconscious patterns'
                },
                {
                  icon: '☀️',
                  title: 'Sun Sign Interpretation',
                  description: 'Understanding your core personality and life purpose'
                },
                {
                  icon: '⭐',
                  title: 'Planetary Positions',
                  description: 'Complete planetary positions at birth with house placements'
                },
                {
                  icon: '📈',
                  title: 'Dasha Periods',
                  description: 'Current and upcoming planetary periods affecting your life'
                },
                {
                  icon: '💝',
                  title: 'Relationship Analysis',
                  description: 'Compatibility analysis for marriage and partnerships'
                },
                {
                  icon: '💼',
                  title: 'Career Guidance',
                  description: 'Professional aptitude and ideal career paths'
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { text: '100% Accurate', color: 'from-green-500 to-emerald-500' },
                { text: 'Secure Data', color: 'from-blue-500 to-cyan-500' },
                { text: '24/7 Support', color: 'from-purple-500 to-pink-500' }
              ].map((badge, index) => (
                <div key={index} className={`bg-gradient-to-r ${badge.color} text-white p-4 rounded-xl text-center`}>
                  <div className="text-sm font-semibold">{badge.text}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Kundli