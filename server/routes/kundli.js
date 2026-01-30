const express = require('express')
const router = express.Router()
const kundliController = require('../controllers/kundliController')
const { authenticateToken, isAdmin } = require('../middleware/auth')

// Public routes
router.post('/create', kundliController.createKundliRequest)
router.post('/verify', kundliController.verifyKundliPayment)

// Admin routes (protected)
router.get('/', authenticateToken, isAdmin, kundliController.getKundliRequests)
router.get('/:id', authenticateToken, isAdmin, kundliController.getKundliById)
router.put('/:id/status', authenticateToken, isAdmin, kundliController.updateKundliStatus)
router.delete('/:id', authenticateToken, isAdmin, kundliController.deleteKundli)

module.exports = router