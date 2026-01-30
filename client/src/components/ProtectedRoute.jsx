import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../utils/api'

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        // Verify token with backend
        const response = await api.get('/admin/profile')
        if (response.data.success) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminUser')
          setIsAuthenticated(false)
        }
      } catch (error) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute