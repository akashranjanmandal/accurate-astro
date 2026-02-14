import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUser, FaLock, FaStar, FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import api from '../../utils/api'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Try with /api/admin/login
      const response = await api.post('/admin/login', formData)
      
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token)
        localStorage.setItem('adminUser', JSON.stringify(response.data.user))
        
        toast.success('Login successful!')
        navigate('/admin/dashboard')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error)
      
      // If API fails, try hardcoded credentials
      if (
        (formData.username === 'akash' && formData.password === 'admin@123') ||
        (formData.username === 'admin' && formData.password === 'admin@123')
      ) {
        // Create dummy token for development
        const dummyToken = 'dev-token-' + Date.now()
        localStorage.setItem('adminToken', dummyToken)
        localStorage.setItem('adminUser', JSON.stringify({
          id: '1',
          username: formData.username,
          email: formData.username + '@accurateastro.com',
          role: 'admin'
        }))
        
        toast.success('Login successful! (Development Mode)')
        navigate('/admin/dashboard')
      } else {
        toast.error(error.response?.data?.message || 'Invalid credentials')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <FaStar className="text-white text-2xl" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Accurate Astro</h1>
          <p className="text-gray-600">Admin Dashboard Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" /> Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors"
                  placeholder="Enter your username"
                  required
                  disabled={isLoading}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaUser />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaLock />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login to Dashboard'}
            </motion.button>
          </form>


          {/* Security Note */}
          <p className="mt-6 text-center text-xs text-gray-500">
            🔒 Secure admin access. Unauthorized access is prohibited.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Accurate Astro Admin Panel
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Developed with 💜 by GOBT
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin