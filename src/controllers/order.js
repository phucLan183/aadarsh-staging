const OrderModel = require('../models/Orders');

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query?.keyWord || ''
    const dataOrders = await OrderModel.find().populate([
      { path: 'productId', select: '-storage' },
      { path: 'createdBy', select: 'username ' },
      { path: 'updatedBy', select: 'username ' }
    ]).sort({ _id: -1 }).skip(skipPage)

    res.status(200).json({
      status: 'success',
      data: dataOrders.slice(0, pageSize),
      total: dataOrders.length
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const getOneOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    const dataOrder = await OrderModel.findById(orderId).populate([
      { path: 'productId' },
      { path: 'createdBy', select: 'username ' },
      { path: 'updatedBy', select: 'username ' }
    ])
    if (!dataOrder) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataOrder
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const createOrder = async (req, res) => {
  try {
    const body = req.body
    const user = req.user
    const newOrder = new OrderModel({
      productId: body.productId,
      price: body.price,
      status: body.status,
      attachment: body.attachment,
      createdBy: user.userId,
      updatedBy: user.userId,
      notes: body.notes
    })
    const dataOrder = await newOrder.save()
    res.status(200).json({
      status: 'success',
      data: dataOrder
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

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    const body = req.body
    const user = req.user
    const dataOrder = await OrderModel.findOneAndUpdate({
      _id: orderId
    }, {
      $set: {
        productId: body.productId,
        price: body.price,
        status: body.status,
        attachment: body.attachment,
        updatedBy: user.userId,
        notes: body.notes
      }
    }, {
      new: true,
      runValidators: true,
      multi: true
    })
    if (!dataOrder) {
      return res.status(400).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataOrder
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    const dataOrder = await OrderModel.findOneAndDelete({
      _id: orderId
    })
    if (!dataOrder) {
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
  getAllOrders: getAllOrders,
  getOneOrder: getOneOrder,
  createOrder: createOrder,
  updateOrder: updateOrder,
  deleteOrder: deleteOrder
}