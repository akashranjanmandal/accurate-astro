const express = require('express')
const router = express.Router()
const demoBookingController = require('../controllers/demoBookingController')
const { authenticateToken, isAdmin } = require('../middleware/auth')

// Public routes
router.post('/', demoBookingController.createDemoBooking)

// Admin routes (protected)
router.get('/', authenticateToken, isAdmin, demoBookingController.getDemoBookings)
router.get('/upcoming', authenticateToken, isAdmin, demoBookingController.getUpcomingDemos)
router.get('/:id', authenticateToken, isAdmin, demoBookingController.getDemoBookingById)
router.put('/:id/status', authenticateToken, isAdmin, demoBookingController.updateDemoBookingStatus)
router.delete('/:id', authenticateToken, isAdmin, demoBookingController.deleteDemoBooking)

module.exports = router