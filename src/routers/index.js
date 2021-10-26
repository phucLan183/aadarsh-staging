const express = require('express');
const router = express.Router();
const { authorization } = require('../middlewares/authToken');
const usersController = require('../controllers/users');

router.get('/users', usersController.getAllUsers)
router.get('/users/:id', usersController.getOneUser)
router.put('/users/:id', usersController.updateUser)
router.delete('/users/:id', authorization, usersController.removeUser)


module.exports = router