const ProductModel = require('../models/Products');

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query.keyWord || ''
    const dataProducts = await ProductModel.find({
      name: { $regex: keyWord, $options: 'i' }
    }).populate({
      path: 'categoryId',
      select: 'name slug',
    }).sort({ _id: -1 }).skip(skipPage).limit(pageSize)
    const totalCategory = await ProductModel.countDocuments({
      name: { $regex: keyWord, $options: 'i' }
    })
    res.status(200).json({
      status: 'success',
      data: dataProducts,
      total: totalCategory
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const getOneProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const dataProduct = await ProductModel.findById(productId).populate({
      path: 'categoryId',
      select: 'name'
    })
    if (!dataProduct) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataProduct
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const createProduct = async (req, res) => {
  try {
    const body = req.body
    const newProduct = new ProductModel({
      name: body.name,
      slug: body.slug,
      categoryId: body.categoryId,
      storage: body.storage,
      active: body.active,
      price: body.price,
      thumbnail: body.thumbnail,
      description: body.description
    })
    const dataProduct = await newProduct.save()
    res.status(200).json({
      status: 'success',
      data: dataProduct
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

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const body = req.body
    const dataProduct = await ProductModel.findOneAndUpdate({
      _id: productId
    }, {
      $set: {
        name: body.name,
        slug: body.slug,
        categoryId: body.categoryId,
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
    if (!dataProduct) {
      return res.status(400).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataProduct
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

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const dataProduct = await ProductModel.findOneAndDelete({
      _id: productId
    })
    if (!dataProduct) {
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
  getAllProducts: getAllProducts,
  getOneProduct: getOneProduct,
  createProduct: createProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct
}