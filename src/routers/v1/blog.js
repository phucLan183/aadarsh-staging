const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationBlog } = require('../../middlewares/authValidation');
const blogController = require('../../controllers/blog');

router.get('/blogs', authenticateToken, validationBlog, blogController.getAllBlogs)
router.post('/blogs', authenticateToken, validationBlog, blogController.createBlog)
router.get('/blog/:id', authenticateToken, validationBlog, blogController.getOneBlog)
router.put('/blog/:id', authenticateToken, validationBlog, blogController.updateBlog)
router.delete('/blog/:id', authenticateToken, validationBlog, blogController.deleteBlog)

module.exports = router