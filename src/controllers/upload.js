const ImageModel = require('../models/Uploads');
const cloudinary = require('../utils/cloudinary');

const getAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const dataImage = await ImageModel.find().select('urlImage publicIdImage createdAt').skip(skipPage).limit(pageSize).lean()
    const totalImage = await ImageModel.countDocuments()
    res.status(200).json({
      status: 'success',
      data: dataImage,
      total: totalImage
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const createImage = async (req, res) => {
  try {
    const image = req.file.path
    const uploadImageIntoCloud = await cloudinary.uploader.upload(image, {
      folder: 'Images'
    })
    const dataImage = new ImageModel({
      urlImage: uploadImageIntoCloud.secure_url,
      publicIdImage: uploadImageIntoCloud.public_id
    })
    const saveData = await dataImage.save()
    res.status(200).json({
      status: 'success',
      data: {
        url: saveData.urlImage
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const getOneImage = async (req, res) => {
  try {
    const imageId = req.params.id
    const dataImage = await ImageModel.findById({
      _id: imageId
    }).select('urlImage publicIdImage createdAt').lean()
    if (!dataImage) {
      return res.status(400).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    res.status(200).json({
      status: 'success',
      data: dataImage
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const updateImage = async (req, res) => {
  try {
    const imageId = req.params.id
    const currentImage = req.file.path
    const checkDataImage = await ImageModel.findById(imageId).lean()
    if (!checkDataImage) {
      return res.status(404).json({
        status: 'false',
        message: 'Không tìm thấy dữ liệu!'
      })
    }
    const updateImageIntoCloud = await cloudinary.uploader.upload(currentImage, {
      public_id: checkDataImage.publicIdImage,
      overwrite: true
    })
    const updateDataImage = await ImageModel.findByIdAndUpdate({
      _id: imageId
    }, {
      $set: {
        urlImage: updateImageIntoCloud.secure_url,
        publicIdImage: updateImageIntoCloud.public_id
      }
    }, { new: true })
    res.status(200).json({
      status: 'success',
      data: {
        url: updateDataImage.urlImage
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id
    const checkDataImageAndDelete = await ImageModel.findByIdAndDelete({
      _id: imageId
    }, { new: true })
    const deleteImageInCloud = await cloudinary.uploader.destroy(checkDataImageAndDelete.publicIdImage)
    if (!checkDataImageAndDelete || !deleteImageInCloud) {
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
  getAllImages: getAllImages,
  createImage: createImage,
  getOneImage: getOneImage,
  updateImage: updateImage,
  deleteImage: deleteImage
}