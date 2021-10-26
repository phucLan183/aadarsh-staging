const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateRefreshToken } = require('../middlewares/authToken');
const authController = require('../controllers/auth');

router.post('/register', authController.userRegister);
router.post('/login', authController.userLogin);
router.delete('/logout', authenticateToken, authController.userLogout);

router.get('/access-token', authenticateToken, authController.accessToken);
router.post('/refresh-token', authenticateRefreshToken, authController.refreshToken)

module.exports = router