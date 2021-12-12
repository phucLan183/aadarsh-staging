const BlogModel = require('../models/Blogs');

const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query.keyWord || ''
    const dataBlog = await BlogModel.find({
      title: { $regex: keyWord, $options: 'i' }
    }).populate([
      { path: 'tagId', select: '_id label' },
      { path: 'createdBy', select: '_id username fullname' }
    ]).skip(skipPage).limit(pageSize).sort({
      "_id": -1
    }).lean()
    const totalBlog = await BlogModel.countDocuments({
      title: { $regex: keyWord, $options: 'i' }
    })
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
    }).populate([
      { path: 'tagId', select: '_id label' },
      { path: 'createdBy', select: '_id username fullname' }
    ]).lean()
    if (!dataBlog) {
      return res.status(400).json({
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
    const body = req.body
    const newBlog = await BlogModel.create({
      title: body.title,
      description: body.description,
      content: body.content,
      tagId: body.tagId,
      active: body.active,
      urlId: body.urlId,
      thumbnail: body.thumbnail,
      createdBy: req.user.userId
    })
    const dataBlog = {
      _id: newBlog._id,
      title: newBlog.title,
      description: newBlog.description,
      thumbnail: body.thumbnail,
      urlId: body.urlId,
      active: body.active,
      content: newBlog.content,
      createdAt: newBlog.createdAt
    }
    res.status(200).json({
      status: 'success',
      data: dataBlog
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'false',
        message: 'Tiêu đề đã được sử dụng!'
      })
    }
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const updateBlog = async (req, res) => {
  try {
    const body = req.body
    const blogId = req.params.id
    const dataBlog = await BlogModel.findOneAndUpdate({
      _id: blogId
    }, {
      $set: {
        title: body.title,
        description: body.description,
        content: body.content,
        tagId: body.tagId,
        active: body.active,
        urlId: body.urlId,
        thumbnail: body.thumbnail,
        createdBy: req.user.userId
      }
    }, {
      new: true,
      multi: true
    })

    if (!dataBlog) {
      return res.status(400).json({
        status: 'false',
        message: 'Không tìm thấy bài viết'
      })
    }

    res.status(200).json({
      status: 'success',
      data: dataBlog
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'false',
        message: 'Tiêu đề đã được sử dụng!'
      })
    }
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id
    const dataBlog = await BlogModel.findByIdAndDelete({
      _id: blogId
    }).lean()
    if (!dataBlog) {
      return res.status(400).json({
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


// Client
const TagModel = require('../models/Tags');

const getAllBlogInClient = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query.keyWord || ''
    const filter = req.query.filter?.split(",")

    const dataBlog = await BlogModel.find({
      active: true,
      title: { $regex: keyWord, $options: 'i' }
    }).populate([
      { path: 'tagId', select: '_id label' },
      { path: 'createdBy', select: '_id username fullname' }
    ]).skip(skipPage).limit(pageSize).sort({
      "_id": -1
    }).lean()

    let data = dataBlog
    if (filter) {
      data = dataBlog.filter((item) => {
        let isInclude = false
        item.tagId.map(tag => {
          if (filter.includes(tag._id.toString())) isInclude = true
        })
        return isInclude
      })
    }

    res.status(200).json({
      status: 'success',
      data: data
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
  deleteBlog: deleteBlog,
  getAllBlogInClient: getAllBlogInClient
}