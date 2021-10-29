const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authToken');
const { validationUser } = require('../middlewares/authValidation');
const usersController = require('../controllers/users');

router.get('/users', authenticateToken, validationUser, usersController.getAllUsers)
router.get('/users/:id', authenticateToken, validationUser, usersController.getOneUser)
router.put('/users/:id', authenticateToken, validationUser, usersController.updateUser)
router.delete('/users/:id', authenticateToken, validationUser, usersController.removeUser)

module.exports = router