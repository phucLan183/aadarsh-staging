const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationOrder } = require('../../middlewares/authValidation');
const orderController = require('../../controllers/order');

router.get('/orders', authenticateToken, validationOrder, orderController.getAllOrders)
router.post('/orders', authenticateToken, validationOrder, orderController.createOrder)
router.put('/order/:id', authenticateToken, validationOrder, orderController.updateOrder)
router.get('/order/:id', authenticateToken, validationOrder, orderController.getOneOrder)
router.delete('/order/:id', authenticateToken, validationOrder, orderController.deleteOrder)

module.exports = router