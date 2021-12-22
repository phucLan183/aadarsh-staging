const OrderModel = require('../models/Orders');
const UserModel = require('../models/Users');
const MemberModel = require('../models/Members');


const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query?.keyWord || ''
    const dataOrders = await OrderModel.find().populate({ path: 'productId', select: '-storage' }).sort({ _id: -1 }).skip(skipPage)
    const resultData = dataOrders.filter((item) => {
      let isInclude = false
      const allNameProducts = item.productId.map((product) => product.name.toLowerCase())
      const nameCreateBy = item.createdBy.fullname.toLowerCase()
      const allSearchString = [...allNameProducts, nameCreateBy]
      allSearchString.map((searchString) => {
        if (searchString.includes(keyWord.toLowerCase())) isInclude = true
      })
      return isInclude
    })
    res.status(200).json({
      status: 'success',
      data: resultData.slice(0, pageSize),
      total: resultData.length
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
    const dataOrder = await OrderModel.findById(orderId).populate({ path: 'productId' })
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
    const { userId, role } = req.user
    const selectData = 'username fullname'
    if (role === 'USER') {
      var data = await UserModel.findById(userId).select(selectData).lean()
    }
    if (role === 'MEMBER') {
      var data = await MemberModel.findById(userId).select(selectData).lean()
    }
    const newOrder = new OrderModel({
      productId: body.productId,
      price: body.price,
      status: body.status,
      attachment: body.attachment,
      createdBy: {
        userId: data._id,
        username: data.username,
        fullname: data.fullname,
        role: role,
      },
      updatedBy: {
        userId: data._id,
        username: data.username,
        fullname: data.fullname,
        role: role,
      },
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
    const { userId, role } = req.user
    const dataUser = await UserModel.findById(userId).select('username fullname').lean()
    const dataOrder = await OrderModel.findOneAndUpdate({
      _id: orderId
    }, {
      $set: {
        productId: body.productId,
        price: body.price,
        status: body.status,
        attachment: body.attachment,
        updatedBy: {
          userId: dataUser._id,
          username: dataUser.username,
          fullname: dataUser.fullname,
          role: role
        },
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

const getOrdersCurrentUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const keyWord = req.query?.keyWord || ''
    const { userId } = req.user
    const dataOrders = await OrderModel.find({
      'createdBy.userId': userId,
    }).populate({ path: 'productId', select: '-storage' }).sort({ _id: -1 }).skip(skipPage)
    const resultData = dataOrders.filter((item) => {
      let isInclude = false
      const allNameProducts = item.productId.map((product) => product.name.toLowerCase())
      const nameCreateBy = item.createdBy.fullname.toLowerCase()
      const allSearchString = [...allNameProducts, nameCreateBy]
      allSearchString.map((searchString) => {
        if (searchString.includes(keyWord.toLowerCase())) isInclude = true
      })
      return isInclude
    })
    res.status(200).json({
      status: 'success',
      data: resultData.slice(0, pageSize),
      total: resultData.length
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const getOneOrderCurrentUser = async (req, res) => {
  try {
    const orderId = req.params.id
    const { userId } = req.user
    const dataOrder = await OrderModel.findOne({
      _id: orderId,
      'createdBy.userId': userId
    }).populate({ path: 'productId' })
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

const updateOrderMember = async (req, res) => {
  try {
    const orderId = req.params.id
    const body = req.body
    const { userId, role } = req.user
    const dataMember = await MemberModel.findById(userId).select('username fullname').lean()
    const dataOrder = await OrderModel.findOneAndUpdate({
      _id: orderId,
      'createdBy.userId': userId
    }, {
      $set: {
        attachment: body.attachment,
        notes: body.notes,
        updatedBy: {
          userId: dataMember._id,
          username: dataMember.username,
          fullname: dataMember.fullname,
          role: role
        }
      }
    })
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

module.exports = {
  getAllOrders: getAllOrders,
  getOneOrder: getOneOrder,
  createOrder: createOrder,
  updateOrder: updateOrder,
  deleteOrder: deleteOrder,
  getOrdersCurrentUser: getOrdersCurrentUser,
  getOneOrderCurrentUser: getOneOrderCurrentUser,
  updateOrderMember: updateOrderMember
}