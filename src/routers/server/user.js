const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationUser } = require('../../middlewares/authValidation');
const { validationEditPermission } = require('../../middlewares/user');
const userController = require('../../controllers/user');

// User
router.get('/current-user', authenticateToken, userController.getCurrentUser)
router.get('/users', authenticateToken, validationUser, userController.getAllUsers)
router.post('/users', authenticateToken, validationUser, userController.createUser)
router.get('/user/:id', authenticateToken, validationUser, userController.getOneUser)
router.put('/user/:id', authenticateToken, validationEditPermission, userController.updateUser)
router.delete('/user/:id', authenticateToken, validationUser, userController.removeUser)
module.exports = router
