const express = require('express');
const router = express.Router()
const uploadImage = require('../../utils/multer');
const uploadController = require('../../controllers/upload');

router.get('/upload/images', uploadController.getAllImages)
router.post('/upload/images', uploadImage.single('image'), uploadController.createImage)
router.get('/upload/image/:id', uploadController.getOneImage)
router.put('/upload/image/:id', uploadImage.single('image'), uploadController.updateImage)
router.delete('/upload/image/:id', uploadController.deleteImage)


module.exports = router