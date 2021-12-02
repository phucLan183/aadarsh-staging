const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationCategory } = require('../../middlewares/authValidation');
const categoryController = require('../../controllers/category');

router.get('/categories', authenticateToken, validationCategory, categoryController.getAllCategories)
router.post('/categories', authenticateToken, validationCategory, categoryController.createCategory)
router.put('/category/:id', authenticateToken, validationCategory, categoryController.updateCategory)
router.get('/category/:id', authenticateToken, validationCategory, categoryController.getCategory)
router.delete('/category/:id', authenticateToken, validationCategory, categoryController.deleteCategory)

module.exports = router