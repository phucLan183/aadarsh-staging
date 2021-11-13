const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationReview } = require('../../middlewares/authValidation');
const reviewController = require('../../controllers/review');

// Review
router.get('/reviews', authenticateToken, validationReview, reviewController.getAllReviews)
router.post('/reviews', authenticateToken, validationReview, reviewController.createReview)
router.get('/review/:reviewId', authenticateToken, validationReview, reviewController.getOneReview)
router.put('/review/:reviewId', authenticateToken, validationReview, reviewController.updateReview)
router.delete('/review/:reviewId', authenticateToken, validationReview, reviewController.deleteReview)

module.exports = router
