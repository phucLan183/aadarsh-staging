const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateRefreshToken, authenticateResetToken } = require('../../middlewares/authToken');
const authController = require('../../controllers/auth');

router.post('/auth/register', authController.register)
router.post('/auth/login', authController.userLogin, authController.memberLogin)
router.delete('/auth/logout', authController.userLogout)

router.get('/auth/access-token', authenticateToken, authController.accessToken)
router.post('/auth/refresh-token', authenticateRefreshToken, authController.refreshToken)

router.post('/auth/request-reset-password', authController.forgotPassword)
router.post('/auth/reset-password', authenticateResetToken, authController.resetPassword)
module.exports = router