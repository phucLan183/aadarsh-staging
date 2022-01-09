const QuestionModel = require('../models/Questions');

const getAllQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query.keyWord || ''
    const dataQuestion = await QuestionModel.find({
      $or: [
        { title: { $regex: keyWord, $options: 'i' } },
        { content: { $regex: keyWord, $options: 'i' } }
      ]
    }).select('title content createdAt').skip(skipPage).limit(pageSize).lean()
    const totalQuestion = await QuestionModel.countDocuments({
      $or: [
        { title: { $regex: keyWord, $options: 'i' } },
        { content: { $regex: keyWord, $options: 'i' } }
      ]
    })
    res.status(200).json({
      status: 'success',
      data: dataQuestion,
      total: totalQuestion
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
    const dataQuestion = await QuestionModel.findById(questionId).select('title content createdAt').lean()
    if (!dataQuestion) {
      return res.status(400).json({
        status: 'false',
        message: 'Could not find data question'
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
    const newQuestion = new QuestionModel({
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
    const dataQuestion = await QuestionModel.findByIdAndUpdate({
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
      return res.status(400).json({
        status: 'false',
        message: 'Could not find data question'
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
    const dataQuestion = await QuestionModel.findByIdAndDelete({
      _id: questionId
    })
    if (!dataQuestion) {
      return res.status(400).json({
        status: 'false',
        message: 'Could not find data question'
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