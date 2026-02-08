// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken')
      const userData = localStorage.getItem('adminUser')
      
      console.log('🔐 ProtectedRoute: Checking authentication...')
      
      if (!token || !userData) {
        console.log('❌ No token or user data found in ProtectedRoute')
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        // Basic token validation
        const tokenParts = token.split('.')
        if (tokenParts.length !== 3) {
          console.log('❌ Invalid token format in ProtectedRoute')
          throw new Error('Invalid token format')
        }
        
        // Check expiration
        const payload = JSON.parse(atob(tokenParts[1]))
        const currentTime = Math.floor(Date.now() / 1000)
        
        if (payload.exp && payload.exp < currentTime) {
          console.log('❌ Token expired in ProtectedRoute')
          toast.error('Session expired. Please login again.')
          throw new Error('Token expired')
        }
        
        console.log('✅ ProtectedRoute: Token is valid')
        setIsAuthenticated(true)
        
      } catch (error) {
        console.log('❌ ProtectedRoute: Token validation failed:', error.message)
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
    console.log('🚫 ProtectedRoute: Not authenticated, redirecting to login')
    return <Navigate to="/admin/login" replace />
  }

  console.log('✅ ProtectedRoute: Authentication successful')
  return children
}

export default ProtectedRoute