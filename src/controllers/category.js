const CategoryModel = require('../models/categories');

const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query.keyWord || ''
    const dataCategory = await CategoryModel.find({
      name: { $regex: keyWord, $options: 'i' }
    }).sort({ _id: -1 }).skip(skipPage).limit(pageSize)
    const totalCategory = await CategoryModel.countDocuments({
      name: { $regex: keyWord, $options: 'i' }
    })
    res.status(200).json({
      status: 'success',
      data: dataCategory,
      total: totalCategory
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id
    const dataCategory = await CategoryModel.findById(categoryId)
    if (!dataCategory) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataCategory
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const createCategory = async (req, res) => {
  try {
    const body = req.body
    const newCategory = new CategoryModel({
      name: body.name,
      slug: body.slug,
      storage: body.storage,
      active: body.active,
      price: body.price,
      thumbnail: body.thumbnail,
      description: body.description
    })
    const dataCategory = await newCategory.save()
    res.status(200).json({
      status: 'success',
      data: dataCategory
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'false',
        message: 'Tên thể loại đã được sử dụng!'
      })
    }
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id
    const body = req.body
    const dataCategory = await CategoryModel.findOneAndUpdate({
      _id: categoryId
    }, {
      $set: {
        name: body.name,
        slug: body.slug,
        price: body.price,
        thumbnail: body.thumbnail,
        description: body.description,
        active: body.active,
        storage: body.storage
      }
    }, {
      new: true,
      multi: true
    })
    if (!dataCategory) {
      return res.status(400).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataCategory
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'false',
        message: 'Tên thể loại đã được sử dụng!'
      })
    }
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id
    const dataCategory = await CategoryModel.findOneAndDelete({
      _id: categoryId
    })
    if (!dataCategory) {
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
  getAllCategories: getAllCategories,
  getCategory: getCategory,
  createCategory: createCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory
}