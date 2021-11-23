const express = require('express');
const router = express.Router()
const { authenticateToken } = require('../../middlewares/authToken');
const uploadImage = require('../../utils/multer');
const uploadController = require('../../controllers/upload');

router.get('/upload/images', authenticateToken, uploadController.getAllImages)
router.post('/upload/images', authenticateToken, uploadImage.single('image'), uploadController.createImage)
router.get('/upload/image/:id', authenticateToken, uploadController.getOneImage)
router.put('/upload/image/:id', authenticateToken, uploadImage.single('image'), uploadController.updateImage)
router.delete('/upload/image/:id', authenticateToken, uploadController.deleteImage)

module.exports = router