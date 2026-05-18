const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blogController')
const { authenticateToken, isAdmin } = require('../middleware/auth')

// Public routes
router.get('/', blogController.getBlogs)
router.get('/featured', blogController.getFeaturedBlogs)
router.get('/search', blogController.searchBlogs)
router.get('/:slug', blogController.getBlogBySlug)

// Admin routes (protected)
router.post('/', authenticateToken, isAdmin, blogController.createBlog)
router.put('/:id', authenticateToken, isAdmin, blogController.updateBlog)
router.delete('/:id', authenticateToken, isAdmin, blogController.deleteBlog)

module.exports = router