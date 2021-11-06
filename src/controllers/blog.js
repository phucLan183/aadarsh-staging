const BlogModel = require('../models/Blogs');

const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skipPage = page * pageSize - pageSize
    const dataBlog = await BlogModel.find()
      .populate({
        path: 'tagId',
        select: '_id label'
      })
      .select('title description content createdAt')
      .skip(skipPage).limit(pageSize)
      .lean()
    const totalBlog = await BlogModel.countDocuments()
    res.status(200).json({
      status: 'success',
      data: dataBlog,
      total: totalBlog
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const getOneBlog = async (req, res) => {
  try {
    const blogId = req.params.id
    const dataBlog = await BlogModel.findById({
      _id: blogId
    }).populate({
      path: 'tagId'
    }).select('title description content createdAt').lean()
    if (!dataBlog) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy bài viết'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataBlog
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const createBlog = async (req, res) => {
  try {
    const { title, description, content, tagId } = req.body
    const newBlog = await BlogModel.create({
      title: title,
      description: description,
      content: content,
      tagId: tagId
    })
    const dataBlog = {
      _id: newBlog._id,
      title: newBlog.title,
      description: newBlog.description,
      content: newBlog.content,
      createdAt: newBlog.createdAt
    }
    res.status(200).json({
      status: 'success',
      data: dataBlog
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const updateBlog = async (req, res) => {
  try {
    const { title, description, content, tagId } = req.body
    const blogId = req.params.id
    const dataBlog = await BlogModel.findOneAndUpdate({
      _id: blogId
    }, {
      $set: {
        title: title,
        description: description,
        content: content,
        tagId: tagId
      }
    }, {
      new: true
    }).select('title description content createdAt')

    if (!dataBlog) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy bài viết'
      })
    }

    res.status(200).json({
      status: 'success',
      data: dataBlog
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id
    const dataBlog = await BlogModel.deleteOne({
      _id: blogId
    }).lean()
    if (!dataBlog) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy bài viết'
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
  getAllBlogs: getAllBlogs,
  getOneBlog: getOneBlog,
  createBlog: createBlog,
  updateBlog: updateBlog,
  deleteBlog: deleteBlog
}