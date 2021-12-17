const express = require('express');
const router = express.Router()
const { authenticateToken } = require('../../middlewares/authToken');
const { validationUpload } = require('../../middlewares/authValidation')
const uploadImage = require('../../utils/multer');
const uploadController = require('../../controllers/upload');

router.get('/upload/images', authenticateToken, validationUpload, uploadController.getAllImages)
router.post('/upload/images', authenticateToken, validationUpload, uploadImage.single('image'), uploadController.createImage)
router.get('/upload/image/:id', authenticateToken, validationUpload, uploadController.getOneImage)
router.put('/upload/image/:id', authenticateToken, validationUpload, uploadImage.single('image'), uploadController.updateImage)
router.delete('/upload/image/:id', authenticateToken, validationUpload, uploadController.deleteImage)

module.exports = router