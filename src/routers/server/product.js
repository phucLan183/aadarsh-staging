const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationProduct } = require('../../middlewares/authValidation');
const productController = require('../../controllers/product');

router.get('/products', authenticateToken, validationProduct, productController.getAllProducts)
router.post('/products', authenticateToken, validationProduct, productController.createProduct)
router.put('/product/:id', authenticateToken, validationProduct, productController.updateProduct)
router.get('/product/:id', authenticateToken, validationProduct, productController.getOneProduct)
router.delete('/product/:id', authenticateToken, validationProduct, productController.deleteProduct)

module.exports = router