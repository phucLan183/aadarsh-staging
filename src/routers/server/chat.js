const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationMessage } = require('../../middlewares/authValidation');
const chatController = require('../../controllers/chat');

router.get('/rooms', authenticateToken, chatController.getAllRooms)
router.get('/room/:id', authenticateToken, chatController.getRoomId)
router.delete('/room/:id', authenticateToken, validationMessage, chatController.deleteRoom)

router.get('/messages', authenticateToken, chatController.getAllMessages)

module.exports = router