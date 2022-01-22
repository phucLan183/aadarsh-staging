const express = require('express');
const router = express.Router()
const { authenticateToken } = require('../../middlewares/authToken');
const { validationUpload } = require('../../middlewares/authValidation')
const uploadFile = require('../../utils/multer');
const uploadController = require('../../controllers/upload');

router.get('/upload', authenticateToken, validationUpload, uploadController.getAllImages)
router.post('/upload', authenticateToken, uploadFile.single('file'), validationUpload, uploadController.createImage)
router.get('/upload/:id', authenticateToken, validationUpload, uploadController.getOneImage)
router.delete('/upload/:id', authenticateToken, validationUpload, uploadController.deleteImage)

module.exports = router