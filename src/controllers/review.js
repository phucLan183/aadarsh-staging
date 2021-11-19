const ReviewModel = require('../models/Reviews');

const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query.keyWord || ''
    const dataReviews = await ReviewModel.find({
      name: { $regex: keyWord, $options: 'i' }
    }).select('name createdAt').skip(skipPage).limit(pageSize).lean()
    const totalReview = await ReviewModel.countDocuments({
      name: { $regex: keyWord, $options: 'i' }
    })
    res.status(200).json({
      status: 'success',
      data: dataReviews,
      total: totalReview,
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const getOneReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const dataReview = await ReviewModel.findById({
      _id: reviewId
    }).select('name createdAt')

    if (!dataReview) {
      return res.status(400).json({
        status: 'false',
        message: 'ReviewId not found'
      })
    }

    res.status(200).json({
      status: 'success',
      data: dataReview,
      total: dataReview.length,
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const createReview = async (req, res) => {
  try {
    const { name } = req.body
    const newReview = new ReviewModel({
      name: name,
    })
    const dataReview = await newReview.save()

    res.status(200).json({
      status: 'success',
      data: {
        _id: dataReview._id,
        name: dataReview.name,
        createdAt: dataReview.createdAt
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const name = req.body.name
    const dataReview = await ReviewModel.findByIdAndUpdate({
      _id: reviewId,
    }, {
      name: name
    }, {
      new: true
    }).select('name createdAt')

    if (!dataReview) {
      return res.status(400).json({
        status: 'false',
        message: 'ReviewId not found'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataReview
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const dataReview = await ReviewModel.findByIdAndDelete(reviewId)
    if (!dataReview) {
      return res.status(400).json({
        status: 'false',
        message: 'ReviewId not found'
      })
    }
    res.status(200).json({
      status: 'success'
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message,
    })
  }
}

module.exports = {
  getAllReviews: getAllReviews,
  getOneReview: getOneReview,
  createReview: createReview,
  updateReview: updateReview,
  deleteReview: deleteReview,
}