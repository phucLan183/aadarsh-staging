const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationBlog } = require('../../middlewares/authValidation');
const tagController = require('../../controllers/tag');

router.get('/tags', authenticateToken, validationBlog, tagController.getAllTags)
router.post('/tags', authenticateToken, validationBlog, tagController.createTag)
router.delete('/tag/:id', authenticateToken, validationBlog, tagController.deleteTag)

module.exports = router