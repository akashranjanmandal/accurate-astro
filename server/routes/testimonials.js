const express = require('express')
const router = express.Router()
const testimonialController = require('../controllers/testimonialController')
const { authenticateToken, isAdmin } = require('../middleware/auth')

// Public routes
router.get('/', testimonialController.getTestimonials)
router.get('/featured', testimonialController.getFeaturedTestimonials)
router.get('/:id', testimonialController.getTestimonialById)

// Admin routes (protected)
router.post('/', authenticateToken, isAdmin, testimonialController.createTestimonial)
router.put('/:id', authenticateToken, isAdmin, testimonialController.updateTestimonial)
router.delete('/:id', authenticateToken, isAdmin, testimonialController.deleteTestimonial)

module.exports = router