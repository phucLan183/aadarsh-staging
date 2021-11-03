const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationUser } = require('../../middlewares/authValidation');
const usersController = require('../../controllers/users');

// User
router.get('/users', authenticateToken, validationUser, usersController.getAllUsers)
router.post('/users', authenticateToken, validationUser, usersController.createUser)
router.get('/user/:id', authenticateToken, validationUser, usersController.getOneUser)
router.put('/user/:id', authenticateToken, validationUser, usersController.updateUser)
router.delete('/user/:id', authenticateToken, validationUser, usersController.removeUser)

module.exports = router
