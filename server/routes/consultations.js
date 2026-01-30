const express = require('express')
const router = express.Router()
const consultationController = require('../controllers/consultationController')
const { authenticateToken, isAdmin } = require('../middleware/auth')

// Public routes
router.post('/create', consultationController.createConsultation)
router.post('/verify', consultationController.verifyPayment)

// Admin routes (protected)
router.get('/', authenticateToken, isAdmin, consultationController.getConsultations)
router.get('/:id', authenticateToken, isAdmin, consultationController.getConsultationById)
router.put('/:id/status', authenticateToken, isAdmin, consultationController.updateConsultationStatus)
router.delete('/:id', authenticateToken, isAdmin, consultationController.deleteConsultation)

module.exports = router