const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authToken');
const { validationUser, validationReview } = require('../middlewares/authValidation');
const usersController = require('../controllers/users');
const reviewsController = require('../controllers/reviews');
const feedbackController = require('../controllers/feedback');

// User
router.get('/users', authenticateToken, validationUser, usersController.getAllUsers)
router.get('/user/:id', authenticateToken, validationUser, usersController.getOneUser)
router.put('/user/:id', authenticateToken, validationUser, usersController.updateUser)
router.delete('/user/:id', authenticateToken, validationUser, usersController.removeUser)

// Review
router.get('/reviews', authenticateToken, validationReview, reviewsController.getAllReviews)
router.post('/reviews', authenticateToken, validationReview, reviewsController.createReview)
router.get('/review/:reviewId', authenticateToken, validationReview, reviewsController.getOneReview)
router.put('/review/:reviewId', authenticateToken, validationReview, reviewsController.updateReview)
router.delete('/review/:reviewId', authenticateToken, validationReview, reviewsController.deleteReview)

// Feedback
router.get('/getAllFeedback', authenticateToken, validationReview, feedbackController.getAllFeedback)
router.post('/review/:reviewId/feedback', authenticateToken, validationReview, feedbackController.createFeedback)
router.get('review/:reviewId/feedback/:feedbackId', authenticateToken, validationReview, feedbackController.getOneFeedback)
router.put('/review/:reviewId/feedback/:feedbackId', authenticateToken, validationReview, feedbackController.updateFeedback)
router.delete('/review/:reviewId/feedback/:feedbackId', authenticateToken, validationReview, feedbackController.deleteFeedback)

module.exports = router