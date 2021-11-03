const QuestionsModel = require('../models/Questions');

const getAllQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skipPage = page * pageSize - pageSize
    const dataQuestion = await QuestionsModel.find().select('title content createdAt').skip(skipPage).limit(pageSize).lean()
    res.status(200).json({
      status: 'success',
      data: dataQuestion,
      total: dataQuestion.length
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const getOneQuestion = async (req, res) => {
  try {
    const questionId = req.params.id
    const dataQuestion = await QuestionsModel.findById(questionId).select('title content createdAt').lean()
    if (!dataQuestion) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy câu hỏi'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataQuestion
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const createQuestion = async (req, res) => {
  try {
    const { title, content } = req.body
    const newQuestion = new QuestionsModel({
      title: title,
      content: content
    })
    const dataQuestion = await newQuestion.save()
    res.status(200).json({
      status: 'success',
      data: {
        _id: dataQuestion._id,
        title: dataQuestion.title,
        content: dataQuestion.content,
        createdAt: dataQuestion.createdAt
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id
    const { title, content } = req.body
    const dataQuestion = await QuestionsModel.findByIdAndUpdate({
      _id: questionId
    }, {
      $set: {
        title: title,
        content: content
      }
    }, {
      new: true
    }).select('title content createdAt')
    if (!dataQuestion) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy câu hỏi'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataQuestion
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id
    const dataQuestion = await QuestionsModel.deleteOne({
      _id: questionId
    })
    if (!dataQuestion) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy câu hỏi'
      })
    }
    res.status(200).json({
      status: 'success'
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

module.exports = {
  getAllQuestions: getAllQuestions,
  getOneQuestion: getOneQuestion,
  createQuestion: createQuestion,
  updateQuestion: updateQuestion,
  deleteQuestion: deleteQuestion
}