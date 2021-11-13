const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationUser, validationReview } = require('../../middlewares/authValidation');
const feedbackController = require('../../controllers/feedback');

// Feedback
router.get('/review/:reviewId/feedback', authenticateToken, validationReview, feedbackController.getAllFeedback)
router.post('/review/:reviewId/feedback', authenticateToken, validationReview, feedbackController.createFeedback)
router.get('/review/:reviewId/feedback/:feedbackId', authenticateToken, validationReview, feedbackController.getOneFeedback)
router.put('/review/:reviewId/feedback/:feedbackId', authenticateToken, validationReview, feedbackController.updateFeedback)
router.delete('/review/:reviewId/feedback/:feedbackId', authenticateToken, validationReview, feedbackController.deleteFeedback)

module.exports = router
