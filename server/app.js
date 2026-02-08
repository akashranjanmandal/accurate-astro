const express = require('express')
const cors = require('cors')
const session = require('express-session')
require('dotenv').config()


// Import routes (you'll need to create these)
const adminRoutes = require('./routes/admin')
const consultationRoutes = require('./routes/consultations')
const demoBookingRoutes = require('./routes/demoBookings')
const kundliRoutes = require('./routes/kundli')
const blogRoutes = require('./routes/blogs')
const testimonialRoutes = require('./routes/testimonials')
const uploadRoutes = require('./routes/upload')
const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session configuration (simplified for now)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Routes
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/demo-bookings', demoBookingRoutes)
app.use('/api/kundli', kundliRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/testimonials', testimonialRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Accurate Astro API'
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler - FIXED VERSION
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`)
})
console.log('🔍 Loading routes...')

// Add console logs for each route
app.use('/api/testimonials', (req, res, next) => {
  console.log(`📞 Testimonials route called: ${req.method} ${req.originalUrl}`)
  next()
})

app.use('/api/blogs', (req, res, next) => {
  console.log(`📞 Blogs route called: ${req.method} ${req.originalUrl}`)
  next()
})

// Then your existing routes
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/blogs', blogRoutes)