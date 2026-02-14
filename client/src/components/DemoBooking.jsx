// components/DemoBooking.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { FaCalendarAlt, FaClock, FaUser, FaPhoneAlt, FaEnvelope, FaCheck, FaVenusMars } from 'react-icons/fa'
import api from '../utils/api'

const DemoBooking = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const onSubmit = async (data) => {
    try {
      // Ensure date and time are included
      const formData = {
        ...data,
        date: selectedDate,
        time: selectedTime
      }
      
      console.log('Submitting form data:', formData) // Debug log
      
      const response = await api.post('/demo-bookings', formData)
      if (response.data.success) {
        toast.success('Demo booked successfully! We will contact you soon.')
        reset()
        setSelectedDate('')
        setSelectedTime('')
      }
    } catch (error) {
      toast.error('Failed to book demo. Please try again.')
      console.error('Error booking demo:', error)
    }
  }

  // Generate time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00'
  ]

  // Generate dates for next 7 days
  const getNextDays = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  // Get max date for DOB (18 years ago for minimum age)
  const getMaxDOBDate = () => {
    const today = new Date()
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    return maxDate.toISOString().split('T')[0]
  }

  // Get min date for DOB (100 years ago)
  const getMinDOBDate = () => {
    const today = new Date()
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
    return minDate.toISOString().split('T')[0]
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime('') // Reset time when date changes
    setValue('date', date, { shouldValidate: true })
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setValue('time', time, { shouldValidate: true })
  }

  return (
    <section id="demo" className="section-padding bg-gradient-to-br from-white to-amber-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center mb-4 bg-amber-100 text-amber-700 px-4 py-2 rounded-full">
              <FaCalendarAlt className="mr-2" />
              <span className="font-semibold">Free Consultation</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Book Your <span className="text-amber-600">Free Astrology Demo</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Experience the power of Vedic astrology firsthand. Schedule a free 30-minute demo session 
              with our expert astrologers and discover how we can guide you towards your true potential.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaCheck className="text-amber-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Personalized Guidance</h4>
                  <p className="text-gray-600">Get insights specific to your birth chart and planetary positions.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaCheck className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">No Obligation</h4>
                  <p className="text-gray-600">Completely free session with no commitment required.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaCheck className="text-teal-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Expert Astrologers</h4>
                  <p className="text-gray-600">Consult with our certified Vedic astrologers with 10+ years of experience.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl p-8 card-hover"
          >
            <h3 className="text-2xl font-bold mb-8 text-center">Schedule Your Demo</h3>

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

              {/* Date of Birth */}
              <div>
                <label className="form-label">
                  <FaCalendarAlt className="inline mr-2" /> Date of Birth *
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
                        const minDate = new Date(getMinDOBDate())
                        const maxDate = new Date(getMaxDOBDate())
                        return (dob >= minDate && dob <= maxDate) || 'Please enter a valid date of birth'
                      }
                    }
                  })}
                  className="form-input"
                  min={getMinDOBDate()}
                  max={getMaxDOBDate()}
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

              {/* Demo Date Selection */}
              <div>
                <label className="form-label">
                  <FaCalendarAlt className="inline mr-2" /> Select Demo Date *
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {getNextDays().map((date) => {
                    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
                    const dateNum = new Date(date).getDate()
                    const month = new Date(date).toLocaleDateString('en-US', { month: 'short' })
                    return (
                      <button
                        key={date}
                        type="button"
                        onClick={() => handleDateSelect(date)}
                        className={`py-3 rounded-lg border transition-all ${
                          selectedDate === date 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <div className="text-sm">{day}</div>
                        <div className="font-bold text-lg">{dateNum}</div>
                        <div className="text-xs opacity-75">{month}</div>
                      </button>
                    )
                  })}
                </div>
                <input
                  type="hidden"
                  {...register('date', { required: 'Please select a date' })}
                  value={selectedDate}
                />
                {errors.date && !selectedDate && (
                  <p className="text-red-500 text-sm mt-1">Please select a date</p>
                )}
              </div>

              {/* Time Selection */}
              <div>
                <label className="form-label">
                  <FaClock className="inline mr-2" /> Select Time Slot *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      disabled={!selectedDate}
                      className={`py-3 rounded-lg border text-center transition-all ${
                        !selectedDate 
                          ? 'opacity-50 cursor-not-allowed bg-gray-100'
                          : selectedTime === time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <span className="font-medium">{time}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="hidden"
                  {...register('time', { required: 'Please select a time slot' })}
                  value={selectedTime}
                />
                {errors.time && !selectedTime && (
                  <p className="text-red-500 text-sm mt-1">Please select a time slot</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || !selectedDate || !selectedTime}
                className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
                  isSubmitting || !selectedDate || !selectedTime
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                }`}
              >
                {isSubmitting ? 'Booking...' : 'Book Free Demo'}
              </motion.button>

              <p className="text-center text-gray-500 text-sm">
                By booking, you agree to our terms and conditions. We respect your privacy.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default DemoBooking