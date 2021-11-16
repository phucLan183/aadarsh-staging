const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateRefreshToken, authenticateResetToken } = require('../../middlewares/authToken');
const validate = require('../../middlewares/validate');
const { loginSchema } = require('../../validations/authValidation');
const authController = require('../../controllers/auth');

router.post('/auth/register', authController.userRegister)
router.post('/auth/login', validate(loginSchema), authController.userLogin)
router.delete('/auth/logout', authController.userLogout)

router.get('/auth/access-token', authenticateToken, authController.accessToken)
router.post('/auth/refresh-token', authenticateRefreshToken, authController.refreshToken)

router.post('/auth/request-reset-password', authController.forgotPassword)
router.post('/auth/reset-password', authenticateResetToken, authController.resetPassword)
module.exports = router