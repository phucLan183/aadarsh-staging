const TagModel = require('../models/Tags');

const getAllTags = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skipPage = page * pageSize - pageSize
    const dataTag = await TagModel.find().select('_id label').skip(skipPage).limit(pageSize).lean()
    const totalTags = await TagModel.countDocuments()
    res.status(200).json({
      status: 'success',
      data: dataTag,
      total: totalTags,
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const createTag = async (req, res) => {
  try {
    const label = req.body.label
    const newTag = await TagModel.create({
      label: label
    })
    const dataTag = {
      _id: newTag._id,
      label: newTag.label,
      createdAt: newTag.createdAt
    }
    res.status(200).json({
      status: 'success',
      data: dataTag
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

module.exports = {
  getAllTags: getAllTags,
  createTag: createTag
}