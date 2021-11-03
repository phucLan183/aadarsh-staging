const express = require('express');
const router = express.Router();
const questionsController = require('../../controllers/questions');
const { authenticateToken } = require('../../middlewares/authToken');
const { validationQuestion } = require('../../middlewares/authValidation');

router.get('/questions', authenticateToken, validationQuestion, questionsController.getAllQuestions)
router.post('/questions', authenticateToken, validationQuestion, questionsController.createQuestion)
router.get('/question/:id', authenticateToken, validationQuestion, questionsController.getOneQuestion)
router.put('/question/:id', authenticateToken, validationQuestion, questionsController.updateQuestion)
router.delete('/question/:id', authenticateToken, validationQuestion, questionsController.deleteQuestion)

module.exports = router