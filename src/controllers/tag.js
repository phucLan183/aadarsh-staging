const TagModel = require('../models/Tags');

const getAllTags = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query.keyWord || ''
    const dataTag = await TagModel.find({
      label: { $regex: keyWord, $options: 'i' }
    }).sort({
      "_id": -1
    }).select('-__v').skip(skipPage).limit(pageSize).lean()
    const totalTags = await TagModel.countDocuments({
      label: { $regex: keyWord, $options: 'i' }
    })
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
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'false',
        message: 'Dữ liệu đã được sử dụng!'
      })
    }
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id
    const checkDataTag = await TagModel.findByIdAndDelete({
      _id: tagId
    }).lean()
    if (!checkDataTag) {
      return res.status(400).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    res.status(200).json({
      status: 'success',
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
  createTag: createTag,
  deleteTag: deleteTag
}
