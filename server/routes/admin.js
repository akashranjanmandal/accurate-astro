const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { authenticateToken, isAdmin } = require('../middleware/auth')

router.post('/login', adminController.login)
router.get('/dashboard/stats', authenticateToken, isAdmin, adminController.getDashboardStats)
router.get('/profile', authenticateToken, isAdmin, adminController.getProfile)
router.put('/profile', authenticateToken, isAdmin, adminController.updateProfile)
router.put('/change-password', authenticateToken, isAdmin, adminController.changePassword)
router.post('/logout', authenticateToken, adminController.logout)

module.exports = router