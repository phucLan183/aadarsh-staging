const express = require('express');
const router = express.Router();
const {
  authenticateToken,
  authorization
} = require('../middlewares/authToken');
const usersController = require('../controllers/users');
const {
  permissionModules
} = require('../common/static');

router.get('/users', usersController.getAllUsers)
router.get('/users/:id', usersController.getOneUser)
router.put('/users/:id', authenticateToken, (req, res, next) => authorization(req, res, next, {
  module: permissionModules.user
}), usersController.updateUser)
router.delete('/users/:id', authenticateToken, (req, res, next) => authorization(req, res, next, {
  module: permissionModules.user
}), usersController.removeUser)


module.exports = router