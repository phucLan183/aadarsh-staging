const ReviewModel = require('../models/Reviews');

const filterDataReview = 'fullname star content createdAt'

const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query.keyWord || ''
    const dataReviews = await ReviewModel.find({
      $or: [
        { fullname: { $regex: keyWord, $options: 'i' } },
        { content: { $regex: keyWord, $options: 'i' } }
      ]
    }).select(filterDataReview).skip(skipPage).limit(pageSize).lean()
    const totalReview = await ReviewModel.countDocuments({
      $or: [
        { fullname: { $regex: keyWord, $options: 'i' } },
        { content: { $regex: keyWord, $options: 'i' } }
      ]
    })
    res.status(200).json({
      status: 'success',
      data: dataReviews,
      total: totalReview,
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const getOneReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const dataReview = await ReviewModel.findById({
      _id: reviewId
    }).select(filterDataReview)

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
      message: error.message
    })
  }
}

const createReview = async (req, res) => {
  try {
    const { fullname, star, content } = req.body
    const newReview = new ReviewModel({
      fullname: fullname,
      star: star,
      content: content
    })
    const dataReview = await newReview.save()

    res.status(200).json({
      status: 'success',
      data: {
        _id: dataReview._id,
        fullname: dataReview.fullname,
        star: dataReview.star,
        content: dataReview.content,
        createdAt: dataReview.createdAt
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const { fullname, star, content } = req.body
    const dataReview = await ReviewModel.findByIdAndUpdate({
      _id: reviewId,
    }, {
      $set: {
        fullname: fullname,
        star: star,
        content: content
      }
    }, {
      new: true
    }).select(filterDataReview)

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
      message: error.message
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
        message: 'Không tìm thấy dữ liệu!'
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
  getAllReviews: getAllReviews,
  getOneReview: getOneReview,
  createReview: createReview,
  updateReview: updateReview,
  deleteReview: deleteReview,
}