const FeedbackModel = require('../models/Feedbacks');
const ReviewsModel = require('../models/Reviews');

const getAllFeedback = async (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skipPage = page * pageSize - pageSize

    const dataFeedback = await FeedbackModel.find({
      reviewId: reviewId
    }).select('fullname star content createdAt').skip(skipPage).limit(pageSize).lean()
    const totalFeedback = await FeedbackModel.countDocuments()
    res.status(200).json({
      status: 'success',
      data: dataFeedback,
      total: totalFeedback,
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const getOneFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId

    const dataFeedback = await FeedbackModel.findById({
      _id: feedbackId
    }).select('fullname star content createdAt')

    if (!dataFeedback) {
      return res.status(400).json({
        status: 'false',
        message: 'FeedbackId not found'
      })
    }

    res.status(200).json({
      status: 'success',
      data: dataFeedback
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const createFeedback = async (req, res) => {
  try {
    const reviewId = req.params.reviewId
    const { fullname, star, content } = req.body

    const newFeedback = new FeedbackModel({
      fullname: fullname,
      star: star,
      content: content,
      reviewId: reviewId,
    })

    const updateReview = await ReviewsModel.findByIdAndUpdate({
      _id: reviewId
    }, {
      $addToSet: {
        feedbackId: newFeedback._id
      }
    })

    if (!updateReview) {
      return res.status(400).json({
        status: 'false',
        message: 'ReviewId not found'
      })
    }

    const dataFeedback = await newFeedback.save()

    res.status(200).json({
      status: 'success',
      data: dataFeedback
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const updateFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId
    const { fullname, star, content } = req.body

    const dataFeedback = await FeedbackModel.findByIdAndUpdate({
      _id: feedbackId
    }, {
      $set: {
        fullname: fullname,
        star: star,
        content: content
      }
    }, {
      new: true,
    })

    if (!dataFeedback) {
      return res.status(400).json({
        status: 'false',
        message: 'FeedbackId not found'
      })
    }

    res.status(200).json({
      status: 'success',
      data: dataFeedback
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const deleteFeedback = async (req, res) => {
  try {
    const { reviewId, feedbackId } = req.params

    const updateReview = await ReviewsModel.findOneAndUpdate({
      _id: reviewId,
      feedbackId: feedbackId
    }, {
      $pullAll: {
        feedbackId: [feedbackId]
      }
    }).lean()

    if (!updateReview) {
      return res.status(400).json({
        status: 'false',
        message: 'ID not found'
      })
    }

    const dataFeedback = await FeedbackModel.deleteOne({
      _id: feedbackId
    }).lean()

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
  getAllFeedback: getAllFeedback,
  getOneFeedback: getOneFeedback,
  createFeedback: createFeedback,
  updateFeedback: updateFeedback,
  deleteFeedback: deleteFeedback
}