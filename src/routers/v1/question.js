const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/question');
const { authenticateToken } = require('../../middlewares/authToken');
const { validationQuestion } = require('../../middlewares/authValidation');

router.get('/questions', authenticateToken, validationQuestion, questionController.getAllQuestions)
router.post('/questions', authenticateToken, validationQuestion, questionController.createQuestion)
router.get('/question/:id', authenticateToken, validationQuestion, questionController.getOneQuestion)
router.put('/question/:id', authenticateToken, validationQuestion, questionController.updateQuestion)
router.delete('/question/:id', authenticateToken, validationQuestion, questionController.deleteQuestion)

module.exports = router