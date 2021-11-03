const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/authToken');
const { validationReview } = require('../../middlewares/authValidation');
const reviewsController = require('../../controllers/reviews');

// Review
router.get('/reviews', authenticateToken, validationReview, reviewsController.getAllReviews)
router.post('/reviews', authenticateToken, validationReview, reviewsController.createReview)
router.get('/review/:reviewId', authenticateToken, validationReview, reviewsController.getOneReview)
router.put('/review/:reviewId', authenticateToken, validationReview, reviewsController.updateReview)
router.delete('/review/:reviewId', authenticateToken, validationReview, reviewsController.deleteReview)

module.exports = router
